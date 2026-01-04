# 💻 Exemplos de Uso no Frontend

## 📋 Hooks Disponíveis

### 1. `useSubscription` - Verificação Manual

Hook básico para verificar assinatura quando necessário.

```jsx
import { useSubscription } from '@/hooks/useSubscription';

function MeuComponente() {
  const { checkSubscription, loading, error } = useSubscription();

  const handleCheck = async () => {
    const result = await checkSubscription();
    
    if (result) {
      console.log('Tem acesso:', result.hasAccess);
      console.log('É assinante:', result.isSubscriber);
      console.log('Está em trial:', result.isTrial);
      console.log('Status:', result.subscriptionStatus);
    }
  };

  return (
    <button onClick={handleCheck} disabled={loading}>
      {loading ? 'Verificando...' : 'Verificar Assinatura'}
    </button>
  );
}
```

### 2. `useSubscriptionAccess` - Verificação Automática

Hook que verifica automaticamente e mantém o estado atualizado.

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function ConteudoPremium() {
  const { hasAccess, loading, subscriptionData, refresh } = useSubscriptionAccess();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!hasAccess) {
    return <div>Você precisa de uma assinatura para acessar este conteúdo.</div>;
  }

  return (
    <div>
      <h1>Conteúdo Premium</h1>
      <p>Bem-vindo ao conteúdo exclusivo!</p>
      
      {subscriptionData?.isTrial && (
        <p>Você está em período de teste. {subscriptionData.daysRemaining} dias restantes.</p>
      )}
    </div>
  );
}
```

### 3. Componente `SubscriptionStatus`

Componente pronto para exibir o status da assinatura.

```jsx
import { SubscriptionStatus } from '@/components/SubscriptionStatus';

function MinhaPagina() {
  return (
    <div>
      <h1>Minha Conta</h1>
      <SubscriptionStatus />
    </div>
  );
}
```

## 🔒 Proteção de Rotas

### Exemplo: Rota Protegida

```jsx
import { Navigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function ProtectedRoute({ children }) {
  const { hasAccess, loading } = useSubscriptionAccess();

  if (loading) {
    return <div>Verificando acesso...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/assinatura" replace />;
  }

  return children;
}

// Uso
<Route 
  path="/conteudo-premium" 
  element={
    <ProtectedRoute>
      <ConteudoPremium />
    </ProtectedRoute>
  } 
/>
```

## 🎯 Exemplos Práticos

### Exemplo 1: Botão Condicional

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function BotaoDownload() {
  const { hasAccess, loading } = useSubscriptionAccess();

  if (loading) {
    return <button disabled>Verificando...</button>;
  }

  return (
    <button disabled={!hasAccess}>
      {hasAccess ? 'Baixar' : 'Assine para Baixar'}
    </button>
  );
}
```

### Exemplo 2: Badge de Status

```jsx
import { useSubscriptionAccess } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';

function StatusBadge() {
  const { hasAccess, subscriptionData } = useSubscriptionAccess();

  if (!subscriptionData) return null;

  if (subscriptionData.isSubscriber) {
    return <Badge>Assinante</Badge>;
  }

  if (subscriptionData.isTrial) {
    return <Badge variant="secondary">Teste ({subscriptionData.daysRemaining} dias)</Badge>;
  }

  return <Badge variant="outline">Sem Assinatura</Badge>;
}
```

### Exemplo 3: Verificação em useEffect

```jsx
import { useEffect, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

function MeuComponente() {
  const { checkSubscription } = useSubscription();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const verifyAccess = async () => {
      const result = await checkSubscription();
      setSubscriptionInfo(result);
    };

    verifyAccess();
  }, [checkSubscription]);

  if (!subscriptionInfo) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {subscriptionInfo.hasAccess ? (
        <p>Você tem acesso!</p>
      ) : (
        <p>Você não tem acesso.</p>
      )}
    </div>
  );
}
```

## 🔗 URLs Disponíveis

A função está disponível em duas URLs:

1. **Direta (Edge Function):**
   ```
   https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
   ```

2. **Via Proxy (se configurado no Vercel):**
   ```
   /api/check-subscription
   ```

O hook `useSubscription` usa automaticamente a URL configurada em `VITE_SUPABASE_FUNCTIONS_URL` ou a URL padrão.

## 📝 Variáveis de Ambiente

Adicione ao seu `.env` (opcional):

```env
VITE_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1
```

Ou use o proxy:

```env
VITE_SUPABASE_FUNCTIONS_URL=/api
```

## 🎨 Estilização

Os componentes usam os componentes UI do projeto (`@/components/ui/*`), então seguem automaticamente o tema dark/light configurado.

## ⚠️ Tratamento de Erros

Todos os hooks tratam erros automaticamente e expõem o estado `error`:

```jsx
const { checkSubscription, error } = useSubscription();

if (error) {
  console.error('Erro:', error);
  // Mostrar mensagem de erro ao usuário
}
```

