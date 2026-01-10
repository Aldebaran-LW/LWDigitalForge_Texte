// ========================================
// EXEMPLO: Como adicionar ao Portal Dashboard
// ========================================
// 
// 1. Abra: src/pages/portal/PortalDashboard.jsx
// 2. Adicione o import no topo:
// ========================================

import { SubscriptionStatus } from '@/components/SubscriptionStatus';
// OU
import { useSubscriptionAccess } from '@/hooks/useSubscription';

// ========================================
// 3. Dentro do componente, adicione:
// ========================================

function PortalDashboard() {
  // Se usar o componente pronto:
  return (
    <div>
      {/* Adicione isso no topo da página */}
      <SubscriptionStatus />
      
      {/* Resto do código existente... */}
    </div>
  );
}

// ========================================
// OU use o hook diretamente:
// ========================================

function PortalDashboard() {
  const { hasAccess, subscriptionData, loading } = useSubscriptionAccess();
  
  return (
    <div>
      {loading ? (
        <div>Verificando assinatura...</div>
      ) : hasAccess ? (
        <div className="bg-green-100 p-4 rounded">
          ✅ Você tem acesso ativo!
          {subscriptionData?.isTrial && (
            <p>Período de teste: {subscriptionData.daysRemaining} dias restantes</p>
          )}
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          ⚠️ Você não tem assinatura ativa
        </div>
      )}
      
      {/* Resto do código existente... */}
    </div>
  );
}










