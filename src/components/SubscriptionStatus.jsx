import React, { useEffect } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscription';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Componente para exibir o status de assinatura do usuário
 * 
 * @param {string} appId - ID do app/produto (opcional, tenta ler do sessionStorage se não fornecido)
 * 
 * @example
 * <SubscriptionStatus appId="app-id-here" />
 * // ou
 * <SubscriptionStatus /> // Tenta ler do sessionStorage
 */
export function SubscriptionStatus({ appId: propAppId = null }) {
  // Tentar ler appId do sessionStorage se não foi fornecido como prop
  const [appId, setAppId] = React.useState(() => {
    if (propAppId) return propAppId;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('app_product_id');
    }
    return null;
  });
  
  const { hasAccess, subscriptionData, loading, error, refresh } = useSubscriptionAccess(appId);

  useEffect(() => {
    if (appId) {
      refresh();
    }
  }, [refresh, appId]);
  
  // Se não tem appId, mostrar aviso
  if (!appId) {
    return (
      <div className="p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center text-yellow-800 dark:text-yellow-200">
          <XCircle className="h-5 w-5 mr-2" />
          <span>App ID não encontrado. Certifique-se de acessar a aplicação através do portal.</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Verificando assinatura...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <XCircle className="h-5 w-5 mr-2" />
          <span>Erro ao verificar assinatura: {error}</span>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const { isSubscriber, isTrial, subscriptionStatus, expiresAt, trialExpiresAt, daysRemaining } = subscriptionData;

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
          Status da Assinatura
          {hasAccess ? (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Acesso Ativo
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center">
              <XCircle className="h-4 w-4 mr-1" />
              Sem Acesso
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Informações sobre sua assinatura e período de teste
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              subscriptionStatus === 'active' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : subscriptionStatus === 'trial'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {subscriptionStatus === 'active' && 'Ativa'}
              {subscriptionStatus === 'trial' && 'Período de Teste'}
              {subscriptionStatus === 'none' && 'Sem Assinatura'}
            </span>
          </div>
        </div>

        {isSubscriber && expiresAt && (
          <div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>Expira em: {new Date(expiresAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        )}

        {isTrial && trialExpiresAt && (
          <div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Período de teste expira em: {new Date(trialExpiresAt).toLocaleDateString('pt-BR')}
                {daysRemaining !== null && daysRemaining !== undefined && (
                  <span className="ml-2 font-semibold">({daysRemaining} dias restantes)</span>
                )}
              </span>
            </div>
          </div>
        )}

        {!hasAccess && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você não possui uma assinatura ativa ou período de teste. 
              Entre em contato para mais informações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

