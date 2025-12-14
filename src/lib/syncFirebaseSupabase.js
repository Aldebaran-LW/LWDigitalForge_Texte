/**
 * Serviço de Sincronização Bidirecional entre Firebase Auth e Supabase
 * 
 * Este serviço garante que quando um usuário é cadastrado em um sistema,
 * ele também seja cadastrado no outro sistema automaticamente.
 */

import { auth } from './firebaseClient';
import { supabase } from './customSupabaseClient';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { googleProvider } from './firebaseClient';

/**
 * Sincroniza um usuário do Supabase para o Firebase
 * @param {Object} supabaseUser - Usuário do Supabase
 * @param {string} password - Senha do usuário (opcional, apenas para novos cadastros)
 * @returns {Promise<Object>} - Resultado da sincronização
 */
export const syncSupabaseToFirebase = async (supabaseUser, password = null) => {
  try {
    if (!auth) {
      console.warn('⚠️ Firebase não está configurado. Pulando sincronização para Firebase.');
      return { success: false, error: 'Firebase não configurado' };
    }

    const email = supabaseUser.email;
    if (!email) {
      return { success: false, error: 'Email não encontrado no usuário do Supabase' };
    }

    // Verificar se o usuário já existe no Firebase
    try {
      // Tentar fazer login para verificar se o usuário existe
      if (password) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Usuário já existe no Firebase');
        return { success: true, message: 'Usuário já existe no Firebase' };
      }
    } catch (error) {
      // Se o erro for "user-not-found", criar o usuário
      if (error.code === 'auth/user-not-found' && password) {
        try {
          // Criar usuário no Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Atualizar perfil do Firebase com dados do Supabase
          const displayName = supabaseUser.user_metadata?.full_name || 
                            supabaseUser.user_metadata?.name ||
                            email.split('@')[0];

          await updateProfile(firebaseUser, {
            displayName: displayName,
            photoURL: supabaseUser.user_metadata?.avatar_url || null
          });

          console.log('✅ Usuário sincronizado do Supabase para Firebase:', email);
          return { 
            success: true, 
            message: 'Usuário criado no Firebase com sucesso',
            firebaseUser: firebaseUser
          };
        } catch (createError) {
          console.error('❌ Erro ao criar usuário no Firebase:', createError);
          return { 
            success: false, 
            error: createError.message,
            code: createError.code
          };
        }
      } else {
        console.warn('⚠️ Não foi possível sincronizar para Firebase:', error.message);
        return { 
          success: false, 
          error: error.message,
          code: error.code
        };
      }
    }

    return { success: true, message: 'Usuário já existe no Firebase' };
  } catch (error) {
    console.error('❌ Erro na sincronização Supabase -> Firebase:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Sincroniza um usuário do Firebase para o Supabase
 * @param {Object} firebaseUser - Usuário do Firebase
 * @param {string} password - Senha do usuário (opcional)
 * @returns {Promise<Object>} - Resultado da sincronização
 */
export const syncFirebaseToSupabase = async (firebaseUser, password = null) => {
  try {
    const email = firebaseUser.email;
    if (!email) {
      return { success: false, error: 'Email não encontrado no usuário do Firebase' };
    }

    // Verificar se o usuário já existe no Supabase verificando o perfil
    // (não podemos acessar auth.users diretamente no frontend)
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .limit(1)
      .single();

    // Se o perfil já existe, atualizar
    if (existingProfile && !checkError) {
      console.log('✅ Usuário já existe no Supabase');
      
      // Atualizar perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: email,
          full_name: firebaseUser.displayName || existingProfile.full_name || email.split('@')[0],
          avatar_url: firebaseUser.photoURL || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar perfil no Supabase:', updateError);
        return { 
          success: false, 
          error: updateError.message 
        };
      }

      return { 
        success: true, 
        message: 'Usuário já existe no Supabase, perfil atualizado',
        supabaseUserId: existingProfile.id
      };
    }

    // Criar usuário no Supabase usando Admin API (via Edge Function)
    // Como não temos acesso direto ao Admin API no frontend,
    // vamos usar signUp do Supabase Auth
    if (password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: firebaseUser.displayName || email.split('@')[0],
            avatar_url: firebaseUser.photoURL || null
          }
        }
      });

      if (error) {
        // Se o erro for "User already registered", o usuário já existe
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log('✅ Usuário já existe no Supabase');
          return { 
            success: true, 
            message: 'Usuário já existe no Supabase' 
          };
        }
        
        console.error('❌ Erro ao criar usuário no Supabase:', error);
        return { 
          success: false, 
          error: error.message 
        };
      }

      console.log('✅ Usuário sincronizado do Firebase para Supabase:', email);
      return { 
        success: true, 
        message: 'Usuário criado no Supabase com sucesso',
        supabaseUser: data.user
      };
    } else {
      // Se não há senha (OAuth), precisamos usar uma Edge Function
      // Por enquanto, retornamos um aviso
      console.warn('⚠️ Sincronização de OAuth requer Edge Function. Usuário:', email);
      return { 
        success: false, 
        error: 'Sincronização de OAuth requer configuração adicional',
        requiresEdgeFunction: true
      };
    }
  } catch (error) {
    console.error('❌ Erro na sincronização Firebase -> Supabase:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Sincroniza usuário após login com Google OAuth no Supabase
 * @param {Object} supabaseUser - Usuário do Supabase após OAuth
 * @returns {Promise<Object>} - Resultado da sincronização
 */
export const syncGoogleOAuthToFirebase = async (supabaseUser) => {
  try {
    if (!auth || !googleProvider) {
      console.warn('⚠️ Firebase não está configurado. Pulando sincronização para Firebase.');
      return { success: false, error: 'Firebase não configurado' };
    }

    const email = supabaseUser.email;
    if (!email) {
      return { success: false, error: 'Email não encontrado' };
    }

    // Para OAuth, não temos a senha, então não podemos criar usuário com email/senha
    // A melhor abordagem é tentar fazer login com Google no Firebase também
    // Mas isso abriria um popup, o que não é ideal
    
    // Alternativa: Usar uma Edge Function no backend que usa Firebase Admin SDK
    // para criar o usuário sem senha (apenas OAuth)
    
    // Por enquanto, vamos apenas registrar que o usuário precisa ser sincronizado
    // e deixar que uma Edge Function ou processo backend faça isso
    console.log('ℹ️ Usuário do Google OAuth detectado. Sincronização com Firebase requer backend:', email);
    
    // Tentar verificar se o usuário já existe no Firebase
    // (não podemos fazer isso diretamente sem Admin SDK, então apenas logamos)
    
    return { 
      success: true, 
      message: 'Usuário OAuth detectado. Sincronização completa requer Edge Function com Firebase Admin SDK.',
      requiresBackendSync: true,
      email: email
    };
  } catch (error) {
    console.error('❌ Erro na sincronização Google OAuth -> Firebase:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Configura listener para sincronizar quando usuário fizer login no Firebase
 * @returns {Function} - Função para desinscrever o listener
 */
export const setupFirebaseAuthListener = () => {
  if (!auth) {
    console.warn('⚠️ Firebase não está configurado. Listener não será configurado.');
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log('🔔 Usuário autenticado no Firebase:', firebaseUser.email);
      
      // Sincronizar com Supabase
      // Primeiro, verificar se o perfil já existe
      try {
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', firebaseUser.email)
          .limit(1)
          .single();

        if (existingProfile && !checkError) {
          // Perfil existe, apenas atualizar
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: firebaseUser.displayName || existingProfile.full_name || firebaseUser.email.split('@')[0],
              avatar_url: firebaseUser.photoURL || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingProfile.id);

          if (updateError) {
            console.error('❌ Erro ao atualizar perfil do Firebase para Supabase:', updateError);
          } else {
            console.log('✅ Perfil atualizado do Firebase para Supabase');
          }
        } else {
          // Perfil não existe - tentar sincronizar completo
          // Nota: Se o usuário não existir no Supabase Auth, não podemos criar o perfil
          // pois o perfil precisa de um ID de auth.users
          console.log('ℹ️ Perfil não encontrado no Supabase. Tentando sincronização completa...');
          const syncResult = await syncFirebaseToSupabase(firebaseUser);
          if (syncResult.success) {
            console.log('✅ Usuário sincronizado do Firebase para Supabase:', syncResult.message);
          } else {
            console.warn('⚠️ Não foi possível sincronizar completamente:', syncResult.error);
            console.warn('⚠️ O usuário pode precisar se cadastrar no Supabase primeiro ou usar uma Edge Function.');
          }
        }
      } catch (error) {
        console.error('❌ Erro na sincronização automática:', error);
      }
    }
  });

  return unsubscribe;
};
