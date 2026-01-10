# 🔍 Diagnóstico: Problema de Login no Ponto_Diario-1

## 📋 Resumo do Problema

A aplicação web **Ponto_Diario-1** não está respondendo ao sistema de liberação. Usuários assinalados estão tentando fazer login e não conseguem acessar a aplicação.

## 🔎 Análise do Código

### 1. **Sistema de Verificação de Acesso**

A aplicação `Ponto_Diario-1` implementa verificação de acesso através do arquivo `lib/subscription-service.js`:

```6:36:temp_ponto_diario/lib/subscription-service.js
const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || ''

export async function verifyAccess(userId) {
  try {
    console.log('verifyAccess called with userId:', userId)
    console.log('PRODUCT_ID:', PRODUCT_ID)
    
    if (!userId) {
      console.warn('verifyAccess: userId is missing')
      return {
        hasAccess: false,
        isSubscriber: false,
        isTrial: false,
      }
    }

    if (!PRODUCT_ID) {
      console.warn('NEXT_PUBLIC_PRODUCT_ID não configurado')
      console.warn('verifyAccess: PRODUCT_ID is missing, denying access')
      return {
        hasAccess: false,
        isSubscriber: false,
        isTrial: false,
      }
    }
```

**Problema Identificado:** Se `NEXT_PUBLIC_PRODUCT_ID` não estiver configurado ou estiver vazio, o sistema **nega acesso automaticamente**.

### 2. **Fluxo de Login**

O login é processado em `app/login/page.js`:

```63:124:temp_ponto_diario/app/login/page.js
  async function checkSubscriptionAndRedirect(user) {
    try {
      console.log('Checking subscription for user:', user.id, user.email)
      
      if (BYPASS_SUBSCRIPTION) {
        console.log('BYPASS_SUBSCRIPTION ativo: pulando verificação de assinatura')
        // Verificar se tem empresa e redirecionar para a aplicação
        const { empresaService } = await import('@/lib/supabase')
        const empresa = await empresaService.getByOwnerId(user.id)
        
        console.log('Empresa encontrada:', empresa ? 'Sim' : 'Não')
        
        if (empresa) {
          console.log('Redirecting to /apontamentos')
          // Usar URL absoluto para não cair no domínio de marketing
          window.location.href = `${APP_URL}/apontamentos`
        } else {
          console.log('Redirecting to /onboarding')
          window.location.href = `${APP_URL}/onboarding`
        }
        return
      }
      
      // Verificar acesso consultando diretamente o Supabase
      const { verifyAccess } = await import('@/lib/subscription-service.js')
      const access = await verifyAccess(user.id)
      
      console.log('Access verification result:', access)

      if (access.hasAccess) {
        // Verificar se tem empresa e redirecionar para a aplicação
        const { empresaService } = await import('@/lib/supabase')
        const empresa = await empresaService.getByOwnerId(user.id)
        
        console.log('Empresa encontrada:', empresa ? 'Sim' : 'Não')
        
        if (empresa) {
          // Usuário tem empresa, ir para apontamentos (página principal)
          console.log('Redirecting to /apontamentos')
          window.location.href = `${APP_URL}/apontamentos`
        } else {
          // Usuário não tem empresa, ir para onboarding
          console.log('Redirecting to /onboarding')
          window.location.href = `${APP_URL}/onboarding`
        }
      } else {
        console.log('No access, redirecting to /assinatura-necessaria')
        // Redirecionar para página de assinatura necessária
        window.location.href = `${APP_URL}/assinatura-necessaria`
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      // Em caso de erro, redirecionar para página de assinatura
      setCheckingSession(false)
      window.location.href = `${APP_URL}/assinatura-necessaria`
    }
  }
```

**Problema:** Se `verifyAccess` retornar `hasAccess: false` (por falta de `PRODUCT_ID` ou por não encontrar registro nas tabelas), o usuário é redirecionado para `/assinatura-necessaria`.

## 🎯 Causas Prováveis

### 1. **NEXT_PUBLIC_PRODUCT_ID não configurado**

A variável de ambiente `NEXT_PUBLIC_PRODUCT_ID` pode não estar configurada na Vercel ou no ambiente local.

**Como verificar:**
- Acesse o console do navegador (F12) após tentar fazer login
- Procure por logs: `PRODUCT_ID: ...`
- Se aparecer vazio ou `undefined`, a variável não está configurada

### 2. **PRODUCT_ID incorreto**

O `PRODUCT_ID` pode estar configurado, mas com um valor incorreto (ex: Project ID do Vercel em vez do UUID do produto).

**Como verificar:**
- O `PRODUCT_ID` deve ser um UUID (ex: `550e8400-e29b-41d4-a716-446655440000`)
- Não deve ser um Project ID do Vercel (ex: `prj_8y11ZBIpidLj9vdA9kGacAR2vaYY`)

### 3. **Registro não encontrado nas tabelas**

Mesmo com `PRODUCT_ID` correto, se não houver registro nas tabelas `user_purchases` ou `user_trials` para o usuário e produto, o acesso será negado.

**Tabelas verificadas:**
- `user_purchases`: Compras e assinaturas
- `user_trials`: Testes gratuitos

## ✅ Soluções

### **Solução 1: Configurar NEXT_PUBLIC_PRODUCT_ID na Vercel**

1. **Obter o Product ID correto:**
   - Acesse o Supabase Dashboard
   - Vá em **Table Editor** → Tabela `registered_apps`
   - Encontre o produto "Ponto Diário" ou "JornadaPro"
   - Copie o valor da coluna `id` (UUID)

2. **Configurar na Vercel:**
   - Acesse: https://vercel.com/dashboard
   - Selecione o projeto **Ponto_Diario-1** ou **JornadaPro**
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     - **Key:** `NEXT_PUBLIC_PRODUCT_ID`
     - **Value:** `[UUID do produto]`
     - **Ambientes:** ✅ Production, ✅ Preview, ✅ Development
   - Clique em **Save**

3. **Fazer novo deploy:**
   - Vá em **Deployments**
   - Clique em **Redeploy** no último deployment
   - Ou faça um novo commit para trigger automático

### **Solução 2: Verificar se o usuário tem acesso no banco**

Execute no Supabase SQL Editor:

```sql
-- Verificar se o usuário tem compra/assinatura
SELECT 
  up.*,
  ra.name as product_name
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = 'ID_DO_USUARIO_AQUI'
  AND up.app_id = 'PRODUCT_ID_AQUI'
  AND up.status = 'APPROVED';

-- Verificar se o usuário tem trial ativo
SELECT 
  ut.*,
  ra.name as product_name
FROM user_trials ut
LEFT JOIN registered_apps ra ON ra.id = ut.app_id
WHERE ut.user_id = 'ID_DO_USUARIO_AQUI'
  AND ut.app_id = 'PRODUCT_ID_AQUI'
  AND ut.is_active = true
  AND ut.expires_at > NOW();
```

**Substitua:**
- `ID_DO_USUARIO_AQUI`: ID do usuário que está tentando fazer login
- `PRODUCT_ID_AQUI`: UUID do produto Ponto Diário

### **Solução 3: Passar Product ID via URL (Alternativa)**

Se não quiser usar variável de ambiente, pode passar o `productId` via URL:

**No Portal (`src/pages/portal/PortalMeusProdutos.jsx`):**

```javascript
const handleAccess = (product) => {
  if (product.vercel_deployment_url) {
    // Passar productId na URL
    const url = `${product.vercel_deployment_url}?productId=${product.id}&userId=${user.id}`;
    window.open(url, '_blank');
  }
};
```

**No Ponto_Diario-1 (`app/login/page.js` ou `lib/subscription-service.js`):**

```javascript
// Ler da URL
const urlParams = new URLSearchParams(window.location.search);
const productIdFromUrl = urlParams.get('productId');

// Usar productId da URL ou variável de ambiente
const PRODUCT_ID = productIdFromUrl || process.env.NEXT_PUBLIC_PRODUCT_ID || '';
```

### **Solução 4: Verificar RLS (Row Level Security)**

Certifique-se de que as políticas RLS nas tabelas `user_purchases` e `user_trials` permitem que usuários autenticados consultem seus próprios registros.

**Verificar políticas:**

```sql
-- Ver políticas em user_purchases
SELECT * FROM pg_policies WHERE tablename = 'user_purchases';

-- Ver políticas em user_trials
SELECT * FROM pg_policies WHERE tablename = 'user_trials';
```

**Política esperada (exemplo):**

```sql
-- Permitir que usuários vejam suas próprias compras
CREATE POLICY "Users can view their own purchases"
ON user_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Permitir que usuários vejam seus próprios trials
CREATE POLICY "Users can view their own trials"
ON user_trials
FOR SELECT
USING (auth.uid() = user_id);
```

## 🔧 Passos para Resolver

### **Passo 1: Identificar o Product ID**

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → `registered_apps`
3. Encontre o produto "Ponto Diário" ou "JornadaPro"
4. Copie o `id` (UUID)

### **Passo 2: Verificar no Console do Navegador**

1. Abra a aplicação Ponto_Diario-1
2. Abra o Console (F12)
3. Tente fazer login
4. Procure por logs:
   - `PRODUCT_ID: ...`
   - `verifyAccess called with userId: ...`
   - `Access verification result: ...`

### **Passo 3: Configurar Variável de Ambiente**

1. Configure `NEXT_PUBLIC_PRODUCT_ID` na Vercel
2. Faça um novo deploy
3. Teste novamente

### **Passo 4: Verificar Dados no Banco**

1. Execute as queries SQL acima
2. Verifique se o usuário tem registro nas tabelas
3. Se não tiver, crie um registro de teste ou assinatura

## 📝 Checklist de Verificação

- [ ] `NEXT_PUBLIC_PRODUCT_ID` está configurado na Vercel?
- [ ] `NEXT_PUBLIC_PRODUCT_ID` é um UUID válido (não Project ID do Vercel)?
- [ ] O usuário tem registro em `user_purchases` ou `user_trials`?
- [ ] O `app_id` no registro corresponde ao `PRODUCT_ID`?
- [ ] O `status` em `user_purchases` é `'APPROVED'`?
- [ ] O `is_active` em `user_trials` é `true`?
- [ ] O `expires_at` não expirou (se aplicável)?
- [ ] As políticas RLS estão configuradas corretamente?
- [ ] O deploy na Vercel foi feito após configurar a variável?

## 🚨 Debug Rápido

Adicione logs temporários em `lib/subscription-service.js`:

```javascript
export async function verifyAccess(userId) {
  console.log('=== DEBUG VERIFY ACCESS ===');
  console.log('userId:', userId);
  console.log('PRODUCT_ID:', PRODUCT_ID);
  console.log('PRODUCT_ID type:', typeof PRODUCT_ID);
  console.log('PRODUCT_ID length:', PRODUCT_ID?.length);
  
  // ... resto do código
}
```

## 📞 Próximos Passos

1. **Imediato:** Verificar se `NEXT_PUBLIC_PRODUCT_ID` está configurado na Vercel
2. **Verificar:** Consultar o banco para confirmar que o usuário tem acesso
3. **Testar:** Fazer login novamente após configurar a variável
4. **Monitorar:** Verificar logs no console do navegador

---

**Data da Análise:** 2025-01-27  
**Repositório Analisado:** https://github.com/Aldebaran-LW/Ponto_Diario-1









