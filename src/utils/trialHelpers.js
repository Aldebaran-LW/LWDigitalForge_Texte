import { supabase } from '@/lib/customSupabaseClient';

/**
 * Verifica se um usuário tem acesso ativo (teste ou comprado) a um produto
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @returns {Promise<{hasAccess: boolean, accessType: string, expiresAt: string}>}
 */
export const checkUserProductAccess = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('user_product_access')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar acesso:', error);
      return { hasAccess: false, accessType: null, expiresAt: null };
    }

    if (!data) {
      return { hasAccess: false, accessType: null, expiresAt: null };
    }

    // Verificar se o teste expirou
    if (data.expires_at) {
      const now = new Date();
      const expiryDate = new Date(data.expires_at);
      
      if (now > expiryDate) {
        // Atualizar status para expirado
        await supabase
          .from('user_product_access')
          .update({ status: 'expired' })
          .eq('id', data.id);
        
        return { hasAccess: false, accessType: 'expired', expiresAt: data.expires_at };
      }
    }

    return {
      hasAccess: true,
      accessType: data.is_trial ? 'trial' : 'purchased',
      expiresAt: data.expires_at,
      accessLevel: data.access_level
    };
  } catch (error) {
    console.error('Erro ao verificar acesso ao produto:', error);
    return { hasAccess: false, accessType: null, expiresAt: null };
  }
};

/**
 * Inicia um teste grátis para um produto
 * @param {string} userId - ID do usuário
 * @param {object} product - Objeto do produto
 * @returns {Promise<{success: boolean, data: object, error: string, redirectUrl: string}>}
 */
export const startProductTrial = async (userId, product) => {
  try {
    if (!product.trial_period_days || product.trial_period_days <= 0) {
      return {
        success: false,
        error: 'Este produto não oferece período de teste.'
      };
    }

    // Verificar se já tem teste ativo
    const existingAccess = await checkUserProductAccess(userId, product.id);
    if (existingAccess.hasAccess) {
      return {
        success: false,
        error: 'Você já tem acesso ativo a este produto.',
        redirectUrl: product.vercel_deployment_url || product.github_repo_url
      };
    }

    // Verificar se já teve teste antes (mesmo que expirado)
    const { data: previousTrial } = await supabase
      .from('user_product_access')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .eq('is_trial', true)
      .single();

    if (previousTrial) {
      return {
        success: false,
        error: 'Você já utilizou o período de teste deste produto.'
      };
    }

    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + product.trial_period_days);

    const { data, error } = await supabase
      .from('user_product_access')
      .insert({
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        access_level: 'trial',
        is_trial: true,
        trial_started_at: trialStartDate.toISOString(),
        trial_ends_at: trialEndDate.toISOString(),
        expires_at: trialEndDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data,
      redirectUrl: product.vercel_deployment_url || product.github_repo_url
    };
  } catch (error) {
    console.error('Erro ao iniciar teste:', error);
    return {
      success: false,
      error: error.message || 'Não foi possível iniciar o teste.'
    };
  }
};

/**
 * Calcula o tempo restante de um teste
 * @param {string} expiresAt - Data de expiração
 * @returns {string} Tempo restante formatado
 */
export const calculateTimeLeft = (expiresAt) => {
  if (!expiresAt) return 'Sem limite';
  
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry - now;

  if (diff <= 0) return 'Expirado';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''}, ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
};

export default {
  checkUserProductAccess,
  startProductTrial,
  calculateTimeLeft
};

