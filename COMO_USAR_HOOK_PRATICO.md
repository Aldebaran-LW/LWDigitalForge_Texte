# 🎯 Como Usar o Hook - Exemplos Práticos

## 📍 Onde Usar no Seu Projeto

### 1. **Portal Dashboard** - Mostrar Status de Assinatura

**Arquivo:** `src/pages/portal/PortalDashboard.jsx`

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';
import { SubscriptionStatus } from '@/components/SubscriptionStatus';

function PortalDashboard() {
  const { hasAccess, subscriptionData } = useSubscriptionAccess();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Mostrar status de assinatura */}
      <SubscriptionStatus />
      
      {/* Ou usar os dados diretamente */}
      {hasAccess ? (
        <div className="bg-green-100 p-4 rounded">
          ✅ Você tem acesso ativo!
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          ⚠️ Você não tem assinatura ativa
        </div>
      )}
    </div>
  );
}
```

---

### 2. **Portal Assinaturas** - Verificar Acesso Antes de Mostrar

**Arquivo:** `src/pages/portal/PortalAssinaturas.jsx`

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function PortalAssinaturas() {
  const { hasAccess, subscriptionData, loading } = useSubscriptionAccess();
  
  // Se não tem acesso, mostrar mensagem
  if (!loading && !hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2>Nenhuma Assinatura Ativa</h2>
        <p>Você não possui assinaturas ativas no momento.</p>
        <p className="text-sm text-gray-600 mt-2">
          Status: {subscriptionData?.subscriptionStatus || 'none'}
        </p>
      </div>
    );
  }
  
  // Resto do código...
}
```

---

### 3. **Página de Produto** - Bloquear Download sem Assinatura

**Arquivo:** `src/pages/ProductDetailPage.jsx`

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function ProductDetailPage() {
  const { hasAccess, loading, subscriptionData } = useSubscriptionAccess();
  
  const handleDownload = () => {
    if (!hasAccess) {
      toast({
        title: "Assinatura Necessária",
        description: "Você precisa de uma assinatura ativa para baixar este produto.",
      });
      return;
    }
    
    // Fazer download...
  };
  
  return (
    <div>
      <button 
        onClick={handleDownload}
        disabled={!hasAccess || loading}
      >
        {loading ? 'Verificando...' : hasAccess ? 'Baixar' : 'Assine para Baixar'}
      </button>
      
      {subscriptionData?.isTrial && (
        <p className="text-sm text-yellow-600">
          ⚠️ Você está em período de teste. {subscriptionData.daysRemaining} dias restantes.
        </p>
      )}
    </div>
  );
}
```

---

### 4. **Portal Meus Produtos** - Mostrar Badge de Status

**Arquivo:** `src/pages/portal/PortalMeusProdutos.jsx`

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function PortalMeusProdutos() {
  const { hasAccess, subscriptionData } = useSubscriptionAccess();
  
  return (
    <div>
      <div className="mb-4">
        {hasAccess && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✅ Você tem acesso ativo
              {subscriptionData?.isTrial && ` (Período de teste: ${subscriptionData.daysRemaining} dias)`}
            </p>
          </div>
        )}
      </div>
      
      {/* Resto do código... */}
    </div>
  );
}
```

---

### 5. **Proteção de Rota** - Bloquear Página Inteira

**Arquivo:** `src/components/ProtectedSubscriptionRoute.jsx` (criar novo)

```jsx
import { Navigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

function ProtectedSubscriptionRoute({ children }) {
  const { hasAccess, loading } = useSubscriptionAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verificando acesso...</span>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/portal/assinaturas" replace />;
  }

  return children;
}

export default ProtectedSubscriptionRoute;
```

**Usar no App.jsx:**

```jsx
import ProtectedSubscriptionRoute from '@/components/ProtectedSubscriptionRoute';

<Route 
  path="/conteudo-premium" 
  element={
    <ProtectedSubscriptionRoute>
      <ConteudoPremium />
    </ProtectedSubscriptionRoute>
  } 
/>
```

---

### 6. **Botão Condicional** - Mostrar/Ocultar Funcionalidades

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function MeuComponente() {
  const { hasAccess, subscriptionData } = useSubscriptionAccess();
  
  return (
    <div>
      {/* Botão só aparece se tiver acesso */}
      {hasAccess && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Funcionalidade Premium
        </button>
      )}
      
      {/* Mostrar aviso se não tiver acesso */}
      {!hasAccess && (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Esta funcionalidade requer assinatura ativa.</p>
          <Link to="/portal/assinaturas">Ver Assinaturas</Link>
        </div>
      )}
      
      {/* Mostrar info do trial */}
      {subscriptionData?.isTrial && (
        <div className="bg-blue-50 p-3 rounded text-sm">
          ⏰ Período de teste: {subscriptionData.daysRemaining} dias restantes
        </div>
      )}
    </div>
  );
}
```

---

### 7. **Verificação Manual** - Quando Precisar Verificar em Ação Específica

```jsx
import { useSubscription } from '@/hooks/useSubscription';

function MeuComponente() {
  const { checkSubscription, loading } = useSubscription();
  
  const handleAcaoEspecial = async () => {
    // Verificar antes de executar ação
    const result = await checkSubscription();
    
    if (!result || !result.hasAccess) {
      alert('Você precisa de uma assinatura ativa!');
      return;
    }
    
    // Executar ação...
    console.log('Ação executada!', result);
  };
  
  return (
    <button onClick={handleAcaoEspecial} disabled={loading}>
      {loading ? 'Verificando...' : 'Executar Ação'}
    </button>
  );
}
```

---

## 🎨 Exemplo Completo: Adicionar ao Portal Dashboard

Vou criar um exemplo completo para você adicionar:

```jsx
// src/pages/portal/PortalDashboard.jsx
import { SubscriptionStatus } from '@/components/SubscriptionStatus';
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function PortalDashboard() {
  const { hasAccess, subscriptionData, loading } = useSubscriptionAccess();
  
  return (
    <div>
      {/* Adicionar no topo da página */}
      <div className="mb-6">
        <SubscriptionStatus />
      </div>
      
      {/* Resto do código existente... */}
    </div>
  );
}
```

---

## 📝 Resumo: Quando Usar Cada Hook

| Hook | Quando Usar |
|------|------------|
| `useSubscriptionAccess()` | **Mais comum** - Quando precisa verificar automaticamente e mostrar/ocultar conteúdo |
| `useSubscription()` | Quando precisa verificar manualmente em ações específicas (botões, formulários) |
| `<SubscriptionStatus />` | Quando quer mostrar um card completo com todas as informações |

---

## ✅ Próximo Passo Recomendado

**Adicione o componente `SubscriptionStatus` no Portal Dashboard:**

1. Abra: `src/pages/portal/PortalDashboard.jsx`
2. Adicione no topo:
   ```jsx
   import { SubscriptionStatus } from '@/components/SubscriptionStatus';
   
   // Dentro do return:
   <SubscriptionStatus />
   ```

Pronto! O usuário verá o status da assinatura automaticamente! 🎉

