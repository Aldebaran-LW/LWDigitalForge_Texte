import { supabase } from '@/lib/customSupabaseClient';

/**
 * Verifica se um usuário tem acesso a um produto (comprado ou teste ativo)
 * @param {string} userId - ID do usuário
 * @param {string} productId - ID do produto
 * @returns {Promise<{hasAccess: boolean, accessType: 'purchase'|'trial'|null, redirectUrl: string|null}>}
 */
export const checkUserProductAccess = async (userId, productId) => {
  try {
    const nowIso = new Date().toISOString();

    // 1) Compras aprovadas (lifetime ou assinatura ainda válida)
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('user_purchases')
      .select(
        `
        id,
        purchase_type,
        status,
        expires_at,
        registered_apps ( vercel_deployment_url )
      `
      )
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(1);

    if (purchaseError) {
      console.error('Erro ao verificar compra:', purchaseError);
    } else if (purchaseData && purchaseData.length > 0) {
      const purchase = purchaseData[0];
      const isValid =
        !purchase.expires_at || new Date(purchase.expires_at).toISOString() > nowIso;
      if (isValid) {
        return {
          hasAccess: true,
          accessType: 'purchase',
          redirectUrl: purchase.registered_apps?.vercel_deployment_url || null,
        };
      }
    }

    // 2) Trial ativo (user_trials)
    const { data: trialData, error: trialError } = await supabase
      .from('user_trials')
      .select(
        `
        expires_at,
        is_active,
        registered_apps ( vercel_deployment_url )
      `
      )
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .limit(1);

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('Erro ao verificar trial:', trialError);
      return { hasAccess: false, accessType: null, redirectUrl: null };
    }

    if (trialData && trialData.length > 0) {
      const trial = trialData[0];
      if (trial?.expires_at && new Date(trial.expires_at).toISOString() > nowIso) {
        return {
          hasAccess: true,
          accessType: 'trial',
          redirectUrl: trial.registered_apps?.vercel_deployment_url || null,
        };
      }
    }

    return { hasAccess: false, accessType: null, redirectUrl: null };
  } catch (error) {
    console.error('Erro ao verificar acesso do usuário:', error);
    return { hasAccess: false, accessType: null, redirectUrl: null };
  }
};

/**
 * Inicia um teste gratuito para um usuário
 * Suporta duas assinaturas:
 * - startProductTrial(userId, product)
 * - startProductTrial(userId, productId, productName, trialPeriodDays)
 * @returns {Promise<{success: boolean, redirectUrl: string|null, error?: string}>}
 */
export const startProductTrial = async (userId, productOrId, productName, trialPeriodDays) => {
  try {
    const product =
      productOrId && typeof productOrId === 'object'
        ? productOrId
        : {
            id: productOrId,
            name: productName,
            trial_period_days: trialPeriodDays,
          };

    const resolvedProductId = product?.id;
    const resolvedProductName = product?.name || productName || 'Produto';
    const resolvedTrialDays = Number(product?.trial_period_days ?? trialPeriodDays ?? 0);

    if (!resolvedProductId) {
      return { success: false, error: 'Produto inválido para iniciar teste.', redirectUrl: null };
    }

    if (!resolvedTrialDays || resolvedTrialDays <= 0) {
      return { success: false, error: 'Este produto não possui teste grátis.', redirectUrl: null };
    }

    // Verificar se já existe um teste ou compra
    const { hasAccess, redirectUrl } = await checkUserProductAccess(userId, resolvedProductId);
    if (hasAccess) {
      return { success: false, error: 'Você já possui acesso a este produto.', redirectUrl };
    }

    // Verificar se já teve um teste anterior (mesmo que expirado)
    const { data: previousTrial, error: previousTrialError } = await supabase
      .from('user_trials')
      .select('id')
      .eq('user_id', userId)
      .eq('app_id', resolvedProductId)
      .limit(1);

    if (previousTrialError && previousTrialError.code !== 'PGRST116') {
      console.error('Erro ao verificar trial anterior:', previousTrialError);
      return { success: false, error: previousTrialError.message, redirectUrl: null };
    }

    if (previousTrial && Array.isArray(previousTrial) && previousTrial.length > 0) {
      return {
        success: false,
        error: 'Você já utilizou o período de teste para este produto.',
        redirectUrl: null,
      };
    }

    // Calcular data de expiração
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + resolvedTrialDays);

    // Buscar URL do produto
    const { data: trialProduct, error: productError } = await supabase
      .from('registered_apps')
      .select('vercel_deployment_url')
      .eq('id', resolvedProductId)
      .single();

    if (productError) {
      console.error('Erro ao buscar URL do produto para teste:', productError);
      return { success: false, error: 'Não foi possível obter a URL do produto.', redirectUrl: null };
    }

    // Criar registro de teste
    const { error } = await supabase.from('user_trials').insert({
      user_id: userId,
      app_id: resolvedProductId,
      started_at: new Date().toISOString(),
      expires_at: trialEndsAt.toISOString(),
      is_active: true,
    });

    if (error) {
      console.error('Erro ao iniciar teste:', error);
      return { success: false, error: error.message, redirectUrl: null };
    }

    return { 
      success: true, 
      redirectUrl: trialProduct?.vercel_deployment_url 
    };
  } catch (error) {
    console.error('Erro ao iniciar teste:', error);
    return { success: false, error: 'Erro inesperado ao iniciar teste.', redirectUrl: null };
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
