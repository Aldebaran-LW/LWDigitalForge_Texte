import { supabase } from '@/lib/customSupabaseClient';

/**
 * Verifica se um usuário tem acesso a um produto (comprado ou teste ativo)
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @returns {Promise<{hasAccess: boolean, redirectUrl: string|null}>}
 */
export const checkUserProductAccess = async (userId, productId) => {
  try {
    // Verificar se o produto foi comprado
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('user_product_access')
      .select('registered_apps(vercel_deployment_url)')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('is_trial', false)
      .single();

    if (purchaseData && !purchaseError) {
      return { hasAccess: true, redirectUrl: purchaseData.registered_apps?.vercel_deployment_url };
    }

    // Verificar se há um teste ativo
    const { data: trialData, error: trialError } = await supabase
      .from('user_product_access')
      .select('trial_ends_at, status, registered_apps(vercel_deployment_url)')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('is_trial', true)
      .eq('status', 'active')
      .single();

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('Erro ao verificar teste ativo:', trialError);
      return { hasAccess: false, redirectUrl: null };
    }

    if (trialData && new Date(trialData.trial_ends_at) > new Date()) {
      return { hasAccess: true, redirectUrl: trialData.registered_apps?.vercel_deployment_url };
    }

    return { hasAccess: false, redirectUrl: null };
  } catch (error) {
    console.error('Erro ao verificar acesso do usuário:', error);
    return { hasAccess: false, redirectUrl: null };
  }
};

/**
 * Inicia um teste gratuito para um usuário
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @param {string} productName - Nome do produto
 * @param {number} trialPeriodDays - Período de teste em dias
 * @returns {Promise<{success: boolean, message: string, redirectUrl: string|null}>}
 */
export const startProductTrial = async (userId, productId, productName, trialPeriodDays) => {
  try {
    // Verificar se já existe um teste ou compra
    const { hasAccess } = await checkUserProductAccess(userId, productId);
    if (hasAccess) {
      return { success: false, message: 'Você já possui acesso a este produto.', redirectUrl: null };
    }

    // Verificar se já teve um teste anterior (mesmo que expirado)
    const { data: previousTrial, error: previousTrialError } = await supabase
      .from('user_product_access')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('is_trial', true)
      .single();

    if (previousTrial && !previousTrialError) {
      return { success: false, message: 'Você já utilizou o período de teste para este produto.', redirectUrl: null };
    }

    // Calcular data de expiração
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialPeriodDays);

    // Buscar URL do produto
    const { data: trialProduct, error: productError } = await supabase
      .from('registered_apps')
      .select('vercel_deployment_url')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('Erro ao buscar URL do produto para teste:', productError);
      return { success: false, message: 'Não foi possível obter a URL do produto.', redirectUrl: null };
    }

    // Criar registro de teste
    const { error } = await supabase.from('user_product_access').insert({
      user_id: userId,
      product_id: productId,
      product_name: productName,
      access_level: 'trial',
      is_trial: true,
      trial_started_at: new Date().toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      status: 'active',
    });

    if (error) {
      console.error('Erro ao iniciar teste:', error);
      return { success: false, message: error.message, redirectUrl: null };
    }

    return { 
      success: true, 
      message: `Seu teste de ${trialPeriodDays} dias para ${productName} foi iniciado!`, 
      redirectUrl: trialProduct?.vercel_deployment_url 
    };
  } catch (error) {
    console.error('Erro ao iniciar teste:', error);
    return { success: false, message: 'Erro inesperado ao iniciar teste.', redirectUrl: null };
  }
};

/**
 * Calcula o tempo restante de um teste
 * @param {string} expiresAt - Data de expiração no formato ISO
 * @returns {{total: number, days: number, hours: number, minutes: number}}
 */
export const calculateTimeLeft = (expiresAt) => {
  const expirationDate = new Date(expiresAt);
  const now = new Date();
  const total = expirationDate - now;

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));

  return { total, days, hours, minutes };
};
