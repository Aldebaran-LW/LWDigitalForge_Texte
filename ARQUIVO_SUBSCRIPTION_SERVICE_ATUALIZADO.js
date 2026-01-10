import { supabase } from './supabase'

/**
 * Detecta o Product ID automaticamente pelo domínio atual
 * Exemplo: jornadapro.lwdigitalforge.com → encontra produto correspondente
 */
async function detectProductIdByDomain() {
  if (typeof window === 'undefined') return null;
  
  const currentDomain = window.location.hostname;
  console.log('🔍 Detectando Product ID para domínio:', currentDomain);
  
  try {
    const { data: products, error } = await supabase
      .from('registered_apps')
      .select('id, name, vercel_deployment_url')
      .not('vercel_deployment_url', 'is', null);
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return null;
    }
    
    // Encontrar produto que corresponde ao domínio atual
    const product = products?.find(p => {
      if (!p.vercel_deployment_url) return false;
      try {
        const url = new URL(p.vercel_deployment_url);
        // Comparar hostname (ex: jornadapro.lwdigitalforge.com)
        return url.hostname === currentDomain;
      } catch {
        return false;
      }
    });
    
    if (product) {
      console.log('✅ Product ID detectado automaticamente:', product.id, product.name);
      return product.id;
    }
    
    console.warn('⚠️ Nenhum produto encontrado para o domínio:', currentDomain);
    return null;
  } catch (error) {
    console.error('❌ Erro ao detectar Product ID:', error);
    return null;
  }
}

/**
 * Obtém Product ID de várias fontes (em ordem de prioridade)
 */
async function getProductId() {
  // 1. SessionStorage (prioridade - se veio do portal)
  if (typeof window !== 'undefined') {
    const fromStorage = sessionStorage.getItem('app_product_id');
    if (fromStorage) {
      console.log('✅ Product ID obtido do sessionStorage:', fromStorage);
      sessionStorage.removeItem('app_product_id');
      sessionStorage.removeItem('app_product_name');
      return fromStorage;
    }
  }
  
  // 2. Variável de ambiente (fallback)
  if (process.env.NEXT_PUBLIC_PRODUCT_ID) {
    console.log('✅ Product ID obtido da variável de ambiente');
    return process.env.NEXT_PUBLIC_PRODUCT_ID;
  }
  
  // 3. Detecção automática pelo domínio (RECOMENDADO)
  const detected = await detectProductIdByDomain();
  if (detected) {
    return detected;
  }
  
  // 4. Fallback: retornar null (vai permitir acesso por padrão)
  console.warn('⚠️ Product ID não encontrado. Acesso será permitido por padrão (fallback seguro).');
  return null;
}

/**
 * Verifica se o usuário tem acesso ao aplicativo
 * Consulta diretamente as tabelas user_purchases e user_trials no Supabase
 * @param {string} userId - ID do usuário autenticado
 * @returns {Promise<{hasAccess: boolean, isSubscriber: boolean, isTrial: boolean}>}
 */
export async function verifyAccess(userId) {
  try {
    console.log('🔍 Verificando acesso para usuário:', userId);
    
    if (!userId) {
      console.warn('⚠️ userId não fornecido');
      return {
        hasAccess: false,
        isSubscriber: false,
        isTrial: false,
      };
    }

    // Obter Product ID (automático - não precisa configurar!)
    const productId = await getProductId();
    
    if (!productId) {
      // Se não conseguir detectar Product ID, permitir acesso (fallback seguro)
      // Isso evita bloquear usuários legítimos se houver problema na detecção
      console.warn('⚠️ Product ID não encontrado. Acesso permitido por padrão (fallback seguro).');
      return {
        hasAccess: true,
        isSubscriber: false,
        isTrial: false,
      };
    }

    console.log('🔍 Verificando acesso para Product ID:', productId);

    // 1. Verificar assinatura/compra (MONTHLY, ANNUAL, LIFETIME)
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
      .maybeSingle();

    if (purchaseError && purchaseError.code !== 'PGRST116') {
      // PGRST116 = nenhum resultado encontrado (não é erro)
      console.error('❌ Erro ao verificar compra:', purchaseError);
    }

    if (purchase) {
      // Verificar se não expirou (para MONTHLY/ANNUAL)
      const isLifetime = purchase.purchase_type === 'LIFETIME';
      const isExpired = purchase.expires_at && new Date(purchase.expires_at) <= new Date();

      if (isLifetime || !isExpired) {
        console.log('✅ Acesso permitido: Assinatura/Compra ativa');
        return {
          hasAccess: true,
          isSubscriber: true,
          isTrial: false,
        };
      }
    }

    // 2. Verificar compra específica (não assinatura) - qualquer outro purchase_type
    const { data: allPurchases, error: allPurchasesError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED');

    if (allPurchasesError) {
      console.error('❌ Erro ao verificar todas as compras:', allPurchasesError);
    }

    if (allPurchases && allPurchases.length > 0) {
      // Filtrar compras que não são assinaturas (não são MONTHLY, ANNUAL, LIFETIME)
      const specificPurchases = allPurchases.filter(
        p => !['MONTHLY', 'ANNUAL', 'LIFETIME'].includes(p.purchase_type)
      );

      if (specificPurchases.length > 0) {
        // Verificar se alguma compra não expirou
        const activePurchase = specificPurchases.find(p => {
          if (!p.expires_at) return true;
          return new Date(p.expires_at) > new Date();
        });

        if (activePurchase) {
          console.log('✅ Acesso permitido: Compra específica ativa');
          return {
            hasAccess: true,
            isSubscriber: true,
            isTrial: false,
          };
        }
      }
    }

    // 3. Verificar trial ativo
    const { data: trial, error: trialError } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar trial:', trialError);
    }

    if (trial) {
      console.log('✅ Acesso permitido: Trial ativo');
      return {
        hasAccess: true,
        isSubscriber: false,
        isTrial: true,
      };
    }

    // SEM ACESSO
    console.log('❌ Acesso negado: Usuário não tem compra, assinatura ou trial ativo');
    return {
      hasAccess: false,
      isSubscriber: false,
      isTrial: false,
    };
  } catch (error) {
    console.error('❌ Erro ao verificar acesso:', error);
    // Em caso de erro, negar acesso por segurança
    return {
      hasAccess: false,
      isSubscriber: false,
      isTrial: false,
    };
  }
}
