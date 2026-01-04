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
   * @returns {Promise<Object|null>} Dados da assinatura ou null em caso de erro
   */
  const checkSubscription = useCallback(async (options = {}) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    const userId = options.userId || user.id;
    const email = options.email || user.email;

    if (!userId || !email) {
      setError('userId e email são obrigatórios');
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
 * @returns {Object} Objeto com hasAccess, loading, error e função refresh
 * 
 * @example
 * const { hasAccess, loading, refresh } = useSubscriptionAccess();
 * 
 * if (hasAccess) {
 *   // Mostrar conteúdo premium
 * }
 */
export function useSubscriptionAccess() {
  const { checkSubscription, loading, error } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const refresh = useCallback(async () => {
    const data = await checkSubscription();
    if (data) {
      setHasAccess(data.hasAccess || false);
      setSubscriptionData(data);
    } else {
      setHasAccess(false);
      setSubscriptionData(null);
    }
  }, [checkSubscription]);

  return {
    hasAccess,
    subscriptionData,
    loading,
    error,
    refresh,
  };
}

