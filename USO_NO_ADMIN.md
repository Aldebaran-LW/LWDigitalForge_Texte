# 🔧 Como Usar no Portal Admin

## 🎯 Casos de Uso no Admin

### 1. **Admin Dashboard** - Estatísticas de Assinaturas

Adicionar card mostrando:
- Total de assinantes ativos
- Total de usuários em trial
- Receita de assinaturas

### 2. **Admin Usuários** - Verificar Assinatura de Usuário Específico

Ao visualizar um usuário, mostrar:
- Status da assinatura dele
- Se está em trial
- Data de expiração

### 3. **Admin Vendas** - Filtrar por Assinaturas

Mostrar apenas vendas de assinaturas (não lifetime)

---

## 📝 Exemplo 1: Adicionar ao Admin Dashboard

**Arquivo:** `src/pages/admin/AdminDashboard.jsx`

```jsx
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/customSupabaseClient';

function AdminDashboard() {
  const { checkSubscription } = useSubscription();
  const [subscriptionStats, setSubscriptionStats] = useState({
    activeSubscribers: 0,
    activeTrials: 0,
  });

  useEffect(() => {
    const fetchSubscriptionStats = async () => {
      // Buscar todos os usuários
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email')
        .limit(100); // ou todos

      let activeSubscribers = 0;
      let activeTrials = 0;

      // Verificar assinatura de cada usuário
      for (const user of users || []) {
        const result = await checkSubscription({
          userId: user.id,
          email: user.email
        });

        if (result) {
          if (result.isSubscriber) activeSubscribers++;
          if (result.isTrial) activeTrials++;
        }
      }

      setSubscriptionStats({
        activeSubscribers,
        activeTrials,
      });
    };

    fetchSubscriptionStats();
  }, [checkSubscription]);

  // Adicionar aos stats existentes
  const stats = [
    // ... stats existentes ...
    { 
      title: 'Assinantes Ativos', 
      value: subscriptionStats.activeSubscribers.toString(), 
      icon: UserCheck, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-500/10' 
    },
    { 
      title: 'Usuários em Trial', 
      value: subscriptionStats.activeTrials.toString(), 
      icon: TestTube2, 
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-500/10' 
    },
  ];
}
```

---

## 📝 Exemplo 2: Verificar Assinatura de Usuário Específico

**Arquivo:** `src/pages/admin/AdminUsuarios.jsx`

```jsx
import { useSubscription } from '@/hooks/useSubscription';

function AdminUsuarios() {
  const { checkSubscription } = useSubscription();
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(null);

  // Quando selecionar um usuário
  const handleViewUserSubscription = async (userId, email) => {
    const result = await checkSubscription({ userId, email });
    setUserSubscriptionStatus(result);
  };

  return (
    <div>
      {/* No modal de detalhes do usuário */}
      {userSubscriptionStatus && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4>Status de Assinatura</h4>
          <p>Acesso: {userSubscriptionStatus.hasAccess ? '✅ Sim' : '❌ Não'}</p>
          <p>Tipo: {userSubscriptionStatus.subscriptionStatus}</p>
          {userSubscriptionStatus.expiresAt && (
            <p>Expira: {new Date(userSubscriptionStatus.expiresAt).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Exemplo 3: Componente Admin para Verificar Qualquer Usuário

**Arquivo:** `src/components/admin/AdminCheckSubscription.jsx` (criar novo)

```jsx
import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export function AdminCheckSubscription() {
  const { checkSubscription, loading } = useSubscription();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    const data = await checkSubscription({ userId, email });
    setResult(data);
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Verificar Assinatura de Usuário</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">User ID</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="UUID do usuário"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        
        <Button onClick={handleCheck} disabled={loading || !userId || !email}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar Assinatura'
          )}
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2">Resultado:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

**Usar no Admin Dashboard:**

```jsx
import { AdminCheckSubscription } from '@/components/admin/AdminCheckSubscription';

function AdminDashboard() {
  return (
    <div>
      {/* Cards de estatísticas existentes... */}
      
      {/* Adicionar componente de verificação */}
      <AdminCheckSubscription />
    </div>
  );
}
```

---

## 📝 Exemplo 4: Adicionar Estatística de Assinaturas no Dashboard

**Modificação simples no AdminDashboard.jsx:**

```jsx
// Adicionar import
import { CreditCard } from 'lucide-react';

// Adicionar busca de assinaturas ativas
useEffect(() => {
  const fetchStats = async () => {
    // ... código existente ...
    
    // Buscar assinaturas ativas
    const { data: activePurchases } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('status', 'APPROVED')
      .in('purchase_type', ['MONTHLY', 'ANNUAL'])
      .gt('expires_at', new Date().toISOString());

    // Buscar trials ativos
    const { data: activeTrials } = await supabase
      .from('user_trials')
      .select('id')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    setStats([
      // ... stats existentes ...
      { 
        title: 'Assinaturas Ativas', 
        value: formatNumber(activePurchases?.length || 0), 
        icon: CreditCard, 
        color: 'text-purple-500', 
        bgColor: 'bg-purple-500/10' 
      },
      { 
        title: 'Trials Ativos', 
        value: formatNumber(activeTrials?.length || 0), 
        icon: TestTube2, 
        color: 'text-yellow-500', 
        bgColor: 'bg-yellow-500/10' 
      },
    ]);
  };
  
  fetchStats();
}, []);
```

---

## 🎯 Resumo: Onde Usar no Admin

| Página | O que fazer |
|--------|-------------|
| **Admin Dashboard** | Adicionar cards de estatísticas de assinaturas |
| **Admin Usuários** | Mostrar status de assinatura ao visualizar usuário |
| **Admin Vendas** | Filtrar vendas de assinaturas |
| **Qualquer página** | Componente para verificar assinatura de qualquer usuário |

---

## ✅ Recomendação

**Para Admin Dashboard:** Adicionar cards de estatísticas (mais útil)

**Para Admin Usuários:** Mostrar status ao visualizar detalhes do usuário

**Para uso geral:** Criar componente `AdminCheckSubscription` para verificar qualquer usuário

