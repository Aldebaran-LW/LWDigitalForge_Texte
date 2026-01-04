import { supabase } from '@/lib/customSupabaseClient';

/**
 * Verifica se um usuário tem assinatura ativa para um produto específico
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @returns {Promise<{hasAccess: boolean, accessType: string|null}>}
 */
const checkUserSubscriptionForProduct = async (userId, productId) => {
  try {
    const now = new Date().toISOString();
    
    // Verificar se o usuário tem assinatura ativa para este produto específico
    // Buscar compras aprovadas do tipo MONTHLY, ANNUAL ou LIFETIME para este produto
    const { data: subscriptionPurchases, error: subscriptionError } = await supabase
      .from('user_purchases')
      .select('*, registered_apps:app_id(vercel_deployment_url)')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME']);

    if (subscriptionError) {
      console.error('Erro ao verificar assinatura do produto:', subscriptionError);
      return { hasAccess: false, accessType: null };
    }

    if (!subscriptionPurchases || subscriptionPurchases.length === 0) {
      return { hasAccess: false, accessType: null };
    }

    // Verificar se alguma assinatura está ativa
    for (const purchase of subscriptionPurchases) {
      // LIFETIME sempre é ativo se aprovado
      if (purchase.purchase_type === 'LIFETIME') {
        return {
          hasAccess: true,
          accessType: 'subscription_lifetime',
          redirectUrl: purchase.registered_apps?.vercel_deployment_url || null,
        };
      }
      
      // MONTHLY e ANNUAL precisam verificar expires_at
      if (purchase.expires_at && new Date(purchase.expires_at) > new Date(now)) {
        return {
          hasAccess: true,
          accessType: purchase.purchase_type === 'MONTHLY' ? 'subscription_monthly' : 'subscription_annual',
          redirectUrl: purchase.registered_apps?.vercel_deployment_url || null,
        };
      }
    }

    return { hasAccess: false, accessType: null };
  } catch (error) {
    console.error('Erro ao verificar assinatura do produto:', error);
    return { hasAccess: false, accessType: null };
  }
};

/**
 * Verifica se um usuário tem acesso a um produto (comprado, teste ativo ou assinatura ativa para o produto)
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @param {string} userEmail - Email do usuário (opcional, não usado mais mas mantido para compatibilidade)
 * @returns {Promise<{hasAccess: boolean, redirectUrl: string|null, accessType: string}>}
 */
export const checkUserProductAccess = async (userId, productId, userEmail = null) => {
  try {
    // 1. PRIMEIRO: Verificar se o usuário tem assinatura ativa PARA ESTE PRODUTO ESPECÍFICO
    const subscriptionCheck = await checkUserSubscriptionForProduct(userId, productId);
    if (subscriptionCheck.hasAccess) {
      return {
        hasAccess: true,
        redirectUrl: subscriptionCheck.redirectUrl || null,
        accessType: subscriptionCheck.accessType,
      };
    }

    // 2. Verificar se o produto foi comprado especificamente (user_purchases)
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('registered_apps:app_id(vercel_deployment_url)')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .single();

    if (purchaseData && !purchaseError) {
      return {
        hasAccess: true,
        redirectUrl: purchaseData.registered_apps?.vercel_deployment_url,
        accessType: 'purchase'
      };
    }

    // 3. Verificar se há um teste ativo para este produto específico (user_trials)
    const { data: trialData, error: trialError } = await supabase
      .from('user_trials')
      .select('expires_at, is_active, registered_apps:app_id(vercel_deployment_url)')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .single();

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('Erro ao verificar teste ativo:', trialError);
      return { hasAccess: false, redirectUrl: null };
    }

    if (trialData && new Date(trialData.expires_at) > new Date() && trialData.is_active) {
      return {
        hasAccess: true,
        redirectUrl: trialData.registered_apps?.vercel_deployment_url,
        accessType: 'trial'
      };
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
 * @param {string} userEmail - Email do usuário (opcional, mas recomendado para verificar assinatura)
 * @returns {Promise<{success: boolean, message: string, redirectUrl: string|null}>}
 */
export const startProductTrial = async (userId, productId, productName, trialPeriodDays, userEmail = null) => {
  try {
    // Verificar se já existe um teste, compra ou assinatura ativa
    const { hasAccess, accessType } = await checkUserProductAccess(userId, productId, userEmail);
    if (hasAccess) {
      // Se tem acesso via assinatura, não precisa de trial
      if (accessType === 'subscription' || accessType === 'subscription_trial') {
        return { 
          success: false, 
          message: 'Você já possui acesso a todos os produtos através da sua assinatura ativa.', 
          redirectUrl: null 
        };
      }
      return { success: false, message: 'Você já possui acesso a este produto.', redirectUrl: null };
    }

    // Verificar se já teve um teste anterior (mesmo que expirado ou inativo)
    const { data: previousTrial, error: previousTrialError } = await supabase
      .from('user_trials')
      .select('id')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .single();

    if (previousTrial && !previousTrialError) {
      return { success: false, message: 'Você já utilizou o período de teste para este produto.', redirectUrl: null };
    }

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + trialPeriodDays);

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

    // Criar registro de teste na tabela user_trials
    const { error } = await supabase.from('user_trials').insert({
      user_id: userId,
      app_id: productId,
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
    });

    if (error) {
      console.error('Erro ao iniciar teste:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = error.message;
      
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        errorMessage = 'Você não tem permissão para criar um teste. Verifique se está logado corretamente.';
      } else if (error.code === '23505' || error.message.includes('unique')) {
        errorMessage = 'Você já possui um teste ativo para este produto.';
      } else if (error.code === '23503' || error.message.includes('foreign key')) {
        errorMessage = 'Produto não encontrado. Por favor, tente novamente.';
      }
      
      return { success: false, message: errorMessage, redirectUrl: null };
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
