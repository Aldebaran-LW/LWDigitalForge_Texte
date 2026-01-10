import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Hook para verificar status de assinatura do usuário
 * 
 * @returns {Object} Objeto com função checkSubscription e estado de loading/error
 * 
 * @example
 * const { checkSubscription, loading, error } = useSubscription();
 * 
 * const result = await checkSubscription();
 * if (result?.hasAccess) {
 *   // Usuário tem acesso
 * }
 */
export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Verifica o status de assinatura do usuário atual
   * 
   * @param {Object} options - Opções opcionais
   * @param {string} options.userId - ID do usuário (padrão: usuário logado)
   * @param {string} options.email - Email do usuário (padrão: email do usuário logado)
   * @param {string} options.appId - ID do app/produto (obrigatório para verificar acesso específico)
   * @param {string} options.productId - ID do produto (alias para appId, para compatibilidade)
   * @returns {Promise<Object|null>} Dados da assinatura ou null em caso de erro
   */
  const checkSubscription = useCallback(async (options = {}) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    const userId = options.userId || user.id;
    const email = options.email || user.email;
    const appId = options.appId || options.productId;

    if (!userId || !email) {
      setError('userId e email são obrigatórios');
      return null;
    }

    if (!appId) {
      setError('appId ou productId é obrigatório para verificar acesso ao app específico');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // URL da Edge Function
      const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
        `${import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co'}/functions/v1/check-subscription`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          appId,
          productId: appId, // Enviar ambos para compatibilidade
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao verificar assinatura';
      setError(errorMessage);
      console.error('Erro ao verificar assinatura:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    checkSubscription,
    loading,
    error,
  };
}

/**
 * Hook para verificar se o usuário tem acesso (assinatura ou trial ativo)
 * 
 * @param {string} appId - ID do app/produto (obrigatório)
 * @returns {Object} Objeto com hasAccess, loading, error e função refresh
 * 
 * @example
 * const { hasAccess, loading, refresh } = useSubscriptionAccess('app-id-here');
 * 
 * if (hasAccess) {
 *   // Mostrar conteúdo premium
 * }
 */
export function useSubscriptionAccess(appId = null) {
  const { checkSubscription, loading, error } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const refresh = useCallback(async () => {
    if (!appId) {
      console.error('useSubscriptionAccess: appId é obrigatório');
      setHasAccess(false);
      setSubscriptionData(null);
      return;
    }
    
    const data = await checkSubscription({ appId });
    if (data) {
      setHasAccess(data.hasAccess || false);
      setSubscriptionData(data);
    } else {
      setHasAccess(false);
      setSubscriptionData(null);
    }
  }, [checkSubscription, appId]);

  return {
    hasAccess,
    subscriptionData,
    loading,
    error,
    refresh,
  };
}

