# 🔐 Verificação de Acesso nos Apps Web

## 📋 Situação Atual

### Como funciona hoje:

1. **Portal verifica acesso** → `checkUserProductAccess()` verifica se o usuário tem:
   - Assinatura ativa para o produto
   - Compra específica do produto
   - Trial ativo para o produto

2. **Se tem acesso** → Abre `vercel_deployment_url` em nova aba
3. **App web abre diretamente** → Sem verificação adicional

## ❓ Precisa adicionar verificação nos apps?

### Opção 1: **NÃO precisa** (Recomendado para começar)

**Vantagens:**
- ✅ Mais simples
- ✅ Verificação já feita no portal
- ✅ Apps funcionam imediatamente

**Desvantagens:**
- ⚠️ Se alguém souber a URL do app, pode acessar diretamente (sem passar pelo portal)
- ⚠️ Não há proteção no próprio app

**Quando usar:**
- Apps internos/privados
- Quando a URL não é pública
- Quando a segurança no portal é suficiente

---

### Opção 2: **SIM, precisa** (Recomendado para produção)

**Vantagens:**
- ✅ Segurança adicional
- ✅ Proteção mesmo se URL for descoberta
- ✅ Controle de acesso no próprio app

**Desvantagens:**
- ⚠️ Requer código adicional em cada app
- ⚠️ Mais complexo de manter

**Quando usar:**
- Apps públicos/expostos
- Quando a segurança é crítica
- Quando quer controle total de acesso

---

## 🛠️ Como Implementar Verificação nos Apps

### Passo 1: Criar componente de verificação

Crie um arquivo em cada app web:

```javascript
// src/utils/verifyAccess.js (ou similar)

/**
 * Verifica se o usuário tem acesso ao app
 * @param {string} userId - ID do usuário (do Supabase Auth)
 * @param {string} productId - ID do produto/app
 * @returns {Promise<{hasAccess: boolean, accessType: string|null}>}
 */
export async function verifyAppAccess(userId, productId) {
  try {
    // Opção A: Chamar API check-subscription
    const response = await fetch(
      'https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          email: user.email // precisa do email também
        }),
      }
    );

    const subscriptionData = await response.json();
    
    // Se tem assinatura ativa, verificar se é para este produto
    if (subscriptionData.hasAccess) {
      // Verificar se o produto está na assinatura
      const { data: purchase } = await supabase
        .from('user_purchases')
        .select('app_id')
        .eq('user_id', userId)
        .eq('app_id', productId)
        .eq('status', 'APPROVED')
        .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
        .single();

      if (purchase) {
        return { hasAccess: true, accessType: 'subscription' };
      }
    }

    // Verificar compra específica
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .single();

    if (purchase) {
      return { hasAccess: true, accessType: 'purchase' };
    }

    // Verificar trial ativo
    const { data: trial } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (trial) {
      return { hasAccess: true, accessType: 'trial' };
    }

    return { hasAccess: false, accessType: null };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return { hasAccess: false, accessType: null };
  }
}
```

### Passo 2: Usar no App

```javascript
// src/App.jsx (ou componente principal do app)

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext'; // ou seu contexto de auth
import { verifyAppAccess } from '@/utils/verifyAccess';
import { useParams } from 'react-router-dom'; // se tiver productId na URL

function App() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // ID do produto - pode vir de:
  // 1. Variável de ambiente: import.meta.env.VITE_PRODUCT_ID
  // 2. URL/parâmetro
  // 3. Configuração do app
  const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID || 'product-id-aqui';

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const { hasAccess: access } = await verifyAppAccess(user.id, PRODUCT_ID);
      
      if (access) {
        setHasAccess(true);
      } else {
        setAccessDenied(true);
      }
      
      setLoading(false);
    };

    checkAccess();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem acesso a este aplicativo. Por favor, verifique sua assinatura ou entre em contato com o suporte.
          </p>
          <a
            href="https://seu-portal.com/portal/assinaturas"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ver Assinaturas
          </a>
        </div>
      </div>
    );
  }

  // App normal
  return (
    <div>
      {/* Seu app aqui */}
    </div>
  );
}
```

### Passo 3: Configurar variável de ambiente

No app web, adicione no `.env`:

```env
VITE_PRODUCT_ID=uuid-do-produto-aqui
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

---

## 🎯 Opção Mais Simples: Passar Token na URL

### No Portal (ao abrir o app):

```javascript
// src/pages/portal/PortalMeusProdutos.jsx

const handleAccess = async (product) => {
  if (!user) return;

  // Verificar acesso primeiro
  const access = await checkUserProductAccess(user.id, product.id, user.email);
  
  if (!access.hasAccess) {
    toast({
      variant: 'destructive',
      title: 'Acesso Negado',
      description: 'Você não tem acesso a este produto.',
    });
    return;
  }

  // Gerar token temporário (opcional)
  const token = await generateAccessToken(user.id, product.id);
  
  // Abrir app com token na URL
  const url = `${product.vercel_deployment_url}?token=${token}&userId=${user.id}&productId=${product.id}`;
  window.open(url, '_blank');
};
```

### No App Web:

```javascript
// Verificar token na URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const userId = urlParams.get('userId');
const productId = urlParams.get('productId');

if (!token || !userId || !productId) {
  // Redirecionar ou mostrar erro
  window.location.href = 'https://seu-portal.com/portal/assinaturas';
}
```

---

## 📝 Resumo

### ✅ **Recomendação:**

1. **Para começar:** NÃO precisa adicionar verificação nos apps
   - A verificação no portal é suficiente
   - Apps funcionam imediatamente

2. **Para produção:** SIM, adicione verificação
   - Use a Opção 2 (verificação no app)
   - Ou use tokens temporários na URL

3. **Implementação mínima:**
   - Adicione `verifyAppAccess()` em cada app
   - Verifique no `useEffect` do componente principal
   - Mostre tela de "Acesso Negado" se não tiver acesso

---

## 🔧 Exemplo Completo Simplificado

Crie um arquivo reutilizável que pode ser copiado para cada app:

```javascript
// verifyAccess.js - Copie para cada app web

import { supabase } from './lib/supabase'; // Configure seu Supabase

export async function verifyAccess(userId, productId) {
  // Verificar assinatura/compra/trial
  const { data: purchase } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', productId)
    .eq('status', 'APPROVED')
    .single();

  if (purchase) return true;

  const { data: trial } = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', productId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();

  return !!trial;
}
```

**Uso no app:**

```javascript
useEffect(() => {
  if (user) {
    verifyAccess(user.id, PRODUCT_ID).then(hasAccess => {
      if (!hasAccess) {
        // Redirecionar ou mostrar erro
      }
    });
  }
}, [user]);
```

---

## ✅ Conclusão

**Resposta curta:** Não é obrigatório, mas é recomendado para produção.

**Para começar:** Não precisa adicionar nada nos apps.

**Para produção:** Adicione verificação básica usando o exemplo acima.

