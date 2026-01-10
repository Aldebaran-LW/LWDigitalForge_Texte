# 🔐 Como Funciona a Lógica de Liberação

## 📋 Fluxo Atual (Como Funciona Agora)

### 1. **Usuário Clica em "Acessar" no Portal**

```
Usuário no Portal → Clica "Acessar" → Sistema verifica acesso → Abre app
```

### 2. **Verificação de Acesso (Portal)**

Quando o usuário clica em "Acessar", o sistema verifica 3 níveis (em ordem de prioridade):

1. ✅ **Assinatura Ativa** - Verifica se o usuário tem assinatura ativa PARA ESTE PRODUTO
2. ✅ **Compra Específica** - Verifica se comprou o produto específico
3. ✅ **Trial Ativo** - Verifica se tem trial ativo para o produto

### 3. **Se Tem Acesso**

- Sistema abre `vercel_deployment_url` em nova aba
- App web abre diretamente
- **Não há verificação adicional no app**

---

## 🔄 Fluxo Completo

```
1. Usuário está logado no Portal
   ↓
2. Usuário vê lista de produtos (Meus Produtos)
   ↓
3. Usuário clica em "Acessar" em um produto
   ↓
4. Sistema verifica acesso (checkUserProductAccess):
   - Verifica se tem assinatura ativa para o produto
   - Verifica se comprou o produto
   - Verifica se tem trial ativo
   ↓
5. Se TEM acesso:
   - window.open(vercel_deployment_url, '_blank')
   - App abre em nova aba
   ↓
6. Se NÃO TEM acesso:
   - Mostra mensagem de erro
   - Não abre o app
```

---

## 📝 Onde a Verificação Acontece

### 1. **Portal (Frontend)**

**Arquivo:** `src/utils/trialHelpers.js`

**Função:** `checkUserProductAccess(userId, productId)`

**O que faz:**
1. Verifica assinatura ativa para o produto (em `user_purchases`)
2. Verifica compra específica (em `user_purchases`)
3. Verifica trial ativo (em `user_trials`)
4. Retorna `{ hasAccess: true/false, redirectUrl: 'url' }`

**Onde é usado:**
- `src/pages/portal/PortalMeusProdutos.jsx` - Ao clicar "Acessar"
- `src/pages/ProductDetailPage.jsx` - Ao iniciar trial
- `src/pages/portal/PortalTestes.jsx` - Ao acessar produto em trial

### 2. **Aplicações Web (Apps)**

**Atualmente:** Não há verificação

**O que acontece:**
- App abre diretamente quando a URL é acessada
- Não verifica se o usuário tem acesso
- Funciona porque a verificação já foi feita no portal

---

## ❓ Precisa Adicionar Verificação nos Apps?

### ✅ **Resposta Curta: NÃO é obrigatório, mas é recomendado para produção**

### 📊 Comparação

| Aspecto | Sem Verificação nos Apps | Com Verificação nos Apps |
|---------|-------------------------|--------------------------|
| **Complexidade** | Simples | Mais complexo |
| **Segurança** | Básica | Alta |
| **Proteção** | Apenas no portal | Portal + App |
| **URL Descoberta** | Pode acessar direto | Bloqueado no app |
| **Manutenção** | Fácil | Requer código em cada app |

### 🎯 Recomendação

1. **Para começar:** NÃO precisa adicionar nada nos apps
   - Verificação no portal é suficiente
   - Apps funcionam imediatamente
   - Mais simples de manter

2. **Para produção:** SIM, adicione verificação
   - Segurança adicional
   - Proteção mesmo se URL for descoberta
   - Controle total de acesso

---

## 🛠️ Como Adicionar Verificação nos Apps (Opcional)

### Passo 1: Configurar Variável de Ambiente

No app web, adicione no `.env`:

```env
VITE_PRODUCT_ID=uuid-do-produto-aqui
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### Passo 2: Criar Função de Verificação

Crie `src/utils/verifyAccess.js` no app:

```javascript
import { supabase } from './lib/supabase'; // Configure seu Supabase

const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID;

export async function verifyAccess(userId) {
  try {
    // Verificar assinatura/compra para este produto
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', PRODUCT_ID)
      .eq('status', 'APPROVED')
      .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
      .single();

    if (purchase) {
      // Verificar se não expirou (para MONTHLY/ANNUAL)
      if (purchase.purchase_type === 'LIFETIME' || 
          (purchase.expires_at && new Date(purchase.expires_at) > new Date())) {
        return true;
      }
    }

    // Verificar compra específica
    const { data: specificPurchase } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', PRODUCT_ID)
      .eq('status', 'APPROVED')
      .neq('purchase_type', 'MONTHLY')
      .neq('purchase_type', 'ANNUAL')
      .neq('purchase_type', 'LIFETIME')
      .single();

    if (specificPurchase) return true;

    // Verificar trial ativo
    const { data: trial } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', PRODUCT_ID)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    return !!trial;
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return false;
  }
}
```

### Passo 3: Usar no App

No componente principal do app:

```javascript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { verifyAccess } from './utils/verifyAccess';

function App() {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAccess(session.user.id);
      } else {
        setLoading(false);
        setHasAccess(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          checkAccess(session.user.id);
        } else {
          setUser(null);
          setHasAccess(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAccess = async (userId) => {
    setLoading(true);
    const access = await verifyAccess(userId);
    setHasAccess(access);
    setLoading(false);
  };

  if (loading) {
    return <div>Verificando acesso...</div>;
  }

  if (!hasAccess) {
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você não tem acesso a este aplicativo.</p>
      </div>
    );
  }

  // App normal
  return <div>Seu app aqui</div>;
}
```

---

## 📊 Resumo: Onde Cada Parte Está

### ✅ **Portal (já implementado)**

1. **Verificação de acesso:**
   - Arquivo: `src/utils/trialHelpers.js`
   - Função: `checkUserProductAccess()`
   - Onde é usado: Portal Meus Produtos, Product Detail Page

2. **Abertura do app:**
   - Arquivo: `src/pages/portal/PortalMeusProdutos.jsx`
   - Função: `handleAccess()`
   - O que faz: `window.open(vercel_deployment_url, '_blank')`

### ⚠️ **Apps Web (opcional - não implementado)**

1. **Verificação de acesso:**
   - ❌ Não existe (opcional)
   - Se quiser: Criar função `verifyAccess()` em cada app

2. **Tela de "Acesso Negado":**
   - ❌ Não existe (opcional)
   - Se quiser: Criar componente que verifica e bloqueia

---

## ✅ Conclusão

### **Resposta Direta:**

**NÃO, você NÃO precisa adicionar nada nas aplicações web para começar.**

A verificação já acontece no portal antes de abrir o app. O app abre diretamente sem verificação adicional.

### **Recomendação:**

1. **Para começar:** Não precisa adicionar nada nos apps
   - Funciona imediatamente
   - Simples de manter
   - Segurança suficiente para começar

2. **Para produção:** Adicione verificação nos apps (opcional)
   - Segurança adicional
   - Proteção se URL for descoberta
   - Controle total de acesso

### **Arquivos Relevantes:**

- ✅ `src/utils/trialHelpers.js` - Lógica de verificação (portal)
- ✅ `src/pages/portal/PortalMeusProdutos.jsx` - Onde o acesso é verificado
- ⚠️ `VERIFICACAO_NOS_APPS_WEB.md` - Guia se quiser adicionar verificação nos apps
- ⚠️ `EXEMPLO_VERIFICACAO_APP.jsx` - Exemplo de código para apps










