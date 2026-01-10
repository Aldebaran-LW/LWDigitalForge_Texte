# 🔍 Onde a Aplicação Web Deve Verificar Acesso?

## 📋 Resposta Rápida

**Atualmente:** A aplicação web **NÃO verifica** acesso. A verificação é feita **apenas no portal** antes de abrir o app.

**Se quiser adicionar verificação no app (opcional):** O app deve verificar nas tabelas **`user_purchases`** e **`user_trials`** do Supabase.

---

## 🔄 Fluxo Atual (Sem Verificação no App)

```
1. Usuário logado no Portal
   ↓
2. Clica em "Acessar" produto
   ↓
3. Portal verifica acesso (user_purchases + user_trials)
   ↓
4. Se TEM acesso:
   - Abre URL do app em nova aba
   - App carrega normalmente
   - NÃO há verificação adicional
   ↓
5. Se NÃO TEM acesso:
   - Mostra mensagem de erro
   - Não abre o app
```

**Verificação:** Apenas no portal ✅  
**Verificação no app:** Não existe ❌

---

## 📊 Onde Verificar Acesso (Se Quiser Adicionar no App)

### **Tabelas do Supabase**

#### 1. **`user_purchases`** - Assinaturas e Compras

**O que verificar:**
```sql
SELECT * FROM user_purchases
WHERE user_id = 'id-do-usuario'
  AND app_id = 'id-do-produto'
  AND status = 'APPROVED'
  AND (
    purchase_type = 'LIFETIME'  -- Vitalício (nunca expira)
    OR (
      purchase_type IN ('MONTHLY', 'ANNUAL')  -- Assinatura
      AND expires_at > NOW()  -- Não expirou
    )
  );
```

**Campos importantes:**
- `user_id` - ID do usuário (UUID)
- `app_id` - ID do produto (UUID)
- `purchase_type` - Tipo: `LIFETIME`, `MONTHLY`, `ANNUAL`, ou outros
- `status` - Status: `APPROVED` (pago), `PENDING` (pendente), `CANCELLED` (cancelado)
- `expires_at` - Data de expiração (null para LIFETIME)

**Exemplo de registro:**
```javascript
{
  user_id: "abc123...",
  app_id: "produto-uuid...",
  purchase_type: "LIFETIME",
  status: "APPROVED",
  expires_at: null  // Nunca expira
}
```

---

#### 2. **`user_trials`** - Testes Gratuitos

**O que verificar:**
```sql
SELECT * FROM user_trials
WHERE user_id = 'id-do-usuario'
  AND app_id = 'id-do-produto'
  AND is_active = true
  AND expires_at > NOW();  -- Não expirou
```

**Campos importantes:**
- `user_id` - ID do usuário (UUID)
- `app_id` - ID do produto (UUID)
- `is_active` - Se o trial está ativo (true/false)
- `expires_at` - Data de expiração do trial

**Exemplo de registro:**
```javascript
{
  user_id: "abc123...",
  app_id: "produto-uuid...",
  is_active: true,
  expires_at: "2024-02-15T10:00:00Z"  // Expira em 15/02/2024
}
```

---

## 🎯 Lógica de Verificação (Ordem de Prioridade)

```javascript
async function verificarAcesso(userId, productId) {
  // 1. VERIFICAR ASSINATURA/VITALÍCIO (user_purchases)
  const { data: purchase } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', productId)
    .eq('status', 'APPROVED')
    .in('purchase_type', ['LIFETIME', 'MONTHLY', 'ANNUAL'])
    .single();

  if (purchase) {
    // Se é LIFETIME, sempre tem acesso
    if (purchase.purchase_type === 'LIFETIME') {
      return { hasAccess: true, type: 'lifetime' };
    }
    
    // Se é MONTHLY ou ANNUAL, verificar se não expirou
    if (purchase.expires_at && new Date(purchase.expires_at) > new Date()) {
      return { hasAccess: true, type: purchase.purchase_type.toLowerCase() };
    }
  }

  // 2. VERIFICAR COMPRA ESPECÍFICA (user_purchases)
  const { data: specificPurchase } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', productId)
    .eq('status', 'APPROVED')
    .single();

  if (specificPurchase) {
    return { hasAccess: true, type: 'purchase' };
  }

  // 3. VERIFICAR TRIAL (user_trials)
  const { data: trial } = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', productId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (trial) {
    return { hasAccess: true, type: 'trial' };
  }

  // SEM ACESSO
  return { hasAccess: false, type: null };
}
```

---

## 💡 Como Obter o Product ID no App?

### **Opção 1: Passar na URL (Recomendado)**

**No Portal (ao abrir app):**
```javascript
// src/pages/portal/PortalMeusProdutos.jsx
const handleAccess = (product) => {
  if (product.vercel_deployment_url) {
    // Passar productId e userId na URL
    const url = `${product.vercel_deployment_url}?productId=${product.id}&userId=${user.id}`;
    window.open(url, '_blank');
  }
};
```

**No App (ler da URL):**
```javascript
// No app web
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const userId = urlParams.get('userId');

// Usar para verificar acesso
const { hasAccess } = await verificarAcesso(userId, productId);
```

**Vantagens:**
- ✅ Automático (não precisa configurar variável de ambiente)
- ✅ Funciona imediatamente
- ✅ Não precisa configurar nada no app

---

### **Opção 2: Variável de Ambiente (Mais Seguro)**

**No App (configurar `.env`):**
```env
VITE_PRODUCT_ID=uuid-do-produto-aqui
```

**No App (usar no código):**
```javascript
const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID;

// Obter usuário autenticado
const { data: { user } } = await supabase.auth.getUser();

// Verificar acesso
const { hasAccess } = await verificarAcesso(user.id, PRODUCT_ID);
```

**Vantagens:**
- ✅ Mais seguro (Product ID não visível na URL)
- ✅ Melhor para produção

**Desvantagens:**
- ⚠️ Precisa configurar variável de ambiente em cada app
- ⚠️ Precisa rebuild/redeploy ao mudar

---

## 📝 Exemplo Completo de Verificação no App

### **Arquivo: `src/utils/verifyAccess.js`**

```javascript
import { supabase } from './lib/supabase';

export async function verifyAccess(userId, productId) {
  try {
    // 1. Verificar assinatura/vitalício
    const { data: subscription } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .in('purchase_type', ['LIFETIME', 'MONTHLY', 'ANNUAL'])
      .single();

    if (subscription) {
      if (subscription.purchase_type === 'LIFETIME') {
        return { hasAccess: true, type: 'lifetime' };
      }
      if (subscription.expires_at && new Date(subscription.expires_at) > new Date()) {
        return { hasAccess: true, type: subscription.purchase_type.toLowerCase() };
      }
    }

    // 2. Verificar compra específica
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .single();

    if (purchase) {
      return { hasAccess: true, type: 'purchase' };
    }

    // 3. Verificar trial
    const { data: trial } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (trial) {
      return { hasAccess: true, type: 'trial', expiresAt: trial.expires_at };
    }

    return { hasAccess: false, type: null };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return { hasAccess: false, type: null };
  }
}
```

### **Arquivo: `src/App.jsx` (Componente Principal)**

```javascript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { verifyAccess } from './utils/verifyAccess';

function App() {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      // 1. Verificar se usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // 2. Obter Product ID (da URL ou variável de ambiente)
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('productId') || import.meta.env.VITE_PRODUCT_ID;

      if (!productId) {
        console.error('Product ID não fornecido');
        setLoading(false);
        return;
      }

      // 3. Verificar acesso
      const result = await verifyAccess(user.id, productId);
      setHasAccess(result.hasAccess);
      setAccessType(result.type);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Verificando acesso...</div>;
  }

  if (!user) {
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você precisa estar logado.</p>
        <a href="https://www.lwdigitalforge.com/login">Fazer Login</a>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você não tem acesso a este aplicativo.</p>
        <a href="https://www.lwdigitalforge.com/portal/produtos">Ver Produtos</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Bem-vindo ao App!</h1>
      <p>Tipo de acesso: {accessType}</p>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

export default App;
```

---

## 📊 Resumo

### **Onde verificar:**
- Tabela: `user_purchases` (assinaturas e compras)
- Tabela: `user_trials` (testes gratuitos)

### **O que verificar:**
1. Assinatura ativa (LIFETIME, MONTHLY, ANNUAL)
2. Compra específica aprovada
3. Trial ativo e não expirado

### **Como obter Product ID:**
- **Opção 1:** Passar na URL (mais fácil)
- **Opção 2:** Variável de ambiente (mais seguro)

### **É obrigatório?**
- ❌ Não (verificação no portal já funciona)
- ⚠️ Recomendado para produção (segurança extra)

---

## ✅ Conclusão

**Resposta:** A aplicação web deve verificar nas tabelas **`user_purchases`** e **`user_trials`** do Supabase.

**Mas é obrigatório?** Não, a verificação no portal já funciona.

**Quando adicionar verificação no app?** Para segurança extra em produção.










