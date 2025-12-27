
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const sessionInitializedRef = useRef(false);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setRole(null);
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore error if no profile is found yet
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      const userRole = data?.role || 'USER';
      setRole(userRole);
      setProfile(data);
      return { ...data, role: userRole };

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de Perfil",
        description: "Não foi possível carregar as informações do seu perfil.",
      });
      setRole('USER'); 
      setProfile(null);
      return null;
    }
  }, [toast]);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    if (currentUser) {
      await fetchUserProfile(currentUser);
    } else {
      setRole(null);
      setProfile(null);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;
    sessionInitializedRef.current = false;

    // Primeiro, buscar a sessão atual e processar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        sessionInitializedRef.current = true;
        handleSession(session);
      }
    }).catch((error) => {
      console.error('Erro ao buscar sessão:', error);
      if (mounted) {
        sessionInitializedRef.current = true;
        setLoading(false);
      }
    });

    // Depois, escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Só processar se já inicializamos a sessão (evita processar o evento inicial antes de getSession())
        if (mounted && sessionInitializedRef.current) {
          await handleSession(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (fullName, phone, email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: fullName,
            phone: phone
        }
      }
    });
    
    if (error) {
        setLoading(false);
        toast({
            variant: "destructive",
            title: "Falha no Cadastro",
            description: error.message || "Algo deu errado. Tente novamente.",
        });
        return { error };
    }


    setLoading(false);
    toast({
        title: "Cadastro Quase Concluído!",
        description: "Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.",
    });

    return { error: null };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    if (error) {
      if (error.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "E-mail Não Confirmado",
            description: "Por favor, verifique seu e-mail para ativar sua conta antes de fazer o login.",
          });
      } else {
        toast({
          variant: "destructive",
          title: "Falha no Login",
          description: "Credenciais inválidas. Verifique seu e-mail e senha.",
        });
      }
      return { error };
    }

    if (data.user) {
      const userProfile = await fetchUserProfile(data.user);
      const userRole = userProfile?.role || 'USER';

      toast({
        title: `Bem-vindo${userProfile?.full_name ? `, ${userProfile.full_name}` : ''}!`,
        description: "Login realizado com sucesso! Redirecionando...",
      });
      
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/portal/meus-produtos');
      }
    }
    
    return { error: null };
  }, [toast, navigate, fetchUserProfile]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Tentando login com Google. Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Erro no signInWithOAuth:', error);
        toast({
          variant: "destructive",
          title: "Erro no Login com Google",
          description: error.message || "Não foi possível fazer login com Google. Verifique se o OAuth está configurado no Supabase.",
        });
        setLoading(false);
        return { error };
      }

      console.log('signInWithOAuth iniciado com sucesso:', data);
      // O loading será desativado quando a sessão for estabelecida
      // ou quando o usuário retornar da página do Google
      return { error: null };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível conectar com o Google. Verifique sua conexão.",
      });
      setLoading(false);
      return { error };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
    toast({ title: "Logout Realizado", description: "Você foi desconectado com sucesso." });
    navigate('/login');
  }, [toast, navigate]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    role,
    profile,
    isAuthenticated: !!user && !!session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }), [user, session, loading, role, profile, signUp, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
