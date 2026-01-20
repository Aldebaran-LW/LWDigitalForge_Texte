# 🔧 Corrigir Problemas Críticos - n8n, Portal e JornadaPro

## ❌ Problemas Identificados

### 1. ❌ Workflow n8n - URL Supabase Fixada
### 2. ❌ Portal - Botão "Acessar Produto" não verifica via n8n
### 3. ❌ JornadaPro - Variáveis de ambiente precisam ser verificadas

---

## ✅ Correção 1: Workflow n8n - URL Supabase

### Problema

**Node 3.5 (Carregar Variáveis de Ambiente):**
- URL do Supabase está fixada como `wwwwyuwighdehmvnolrl.supabase.co`
- Se o projeto atual for outro, o n8n está consultando base errada

### Solução

**No Render (n8n):**

1. Acesse o n8n no Render
2. Vá em **Settings** → **Environment Variables**
3. **Adicione:**
   - **`SUPABASE_URL`** = `https://wwwwyuwighdehmvnolrl.supabase.co` (ou o URL correto do seu projeto)
   - **`SUPABASE_SERVICE_ROLE_KEY`** = Sua chave de service role do Supabase

**Verificar se está correto:**
- O Node 3.5 usa: `process.env.SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co'`
- Se `SUPABASE_URL` estiver configurada no Render, usará ela
- Se não estiver, usará o fallback fixado

**Recomendação:**
- ✅ **Configure** `SUPABASE_URL` no Render (n8n)
- ✅ **Configure** `SUPABASE_SERVICE_ROLE_KEY` no Render (n8n)

---

## ✅ Correção 2: Portal - Botão "Acessar Produto"

### Problema

**`src/components/portal/ProductCard.jsx`:**
- Botão "Entrar no App" (linha 88-89) apenas abre link
- Não verifica acesso via n8n antes de abrir

### Solução Aplicada

✅ **Arquivo atualizado:** `src/components/portal/ProductCard.jsx`

**Antes:**
```javascript
onClick={() => {
  if (app.vercel_deployment_url) {
    window.open(app.vercel_deployment_url, '_blank');
  }
}}
```

**Depois:**
```javascript
onClick={async () => {
  // Verificar acesso via n8n antes de abrir
  const accessCheck = await checkAccessViaN8N(user.id, app.id);
  
  if (!accessCheck.hasAccess) {
    toast({ title: 'Acesso Negado', description: accessCheck.message });
    if (accessCheck.redirectUrl) navigate(accessCheck.redirectUrl);
    return;
  }

  // Se tem acesso, salvar app_product_id e abrir app
  sessionStorage.setItem('app_product_id', app.id);
  window.open(app.vercel_deployment_url, '_blank');
}}
```

### Problema em `PortalProdutos.jsx`

**Linha 380:** Botão que abre `vercel_deployment_url` diretamente

### Solução Aplicada

✅ **Arquivo atualizado:** `src/pages/portal/PortalProdutos.jsx`

**Agora:** Verifica acesso via n8n antes de abrir (similar ao ProductCard)

---

## ✅ Correção 3: JornadaPro - Variáveis de Ambiente

### Problema

**`components/Gatekeeper.jsx`:**
- O `appId` é obtido do `sessionStorage` (`app_product_id`)
- Fallback: `process.env.NEXT_PUBLIC_PRODUCT_ID`
- Se ambos falharem, acesso negado

### Solução

**Verificar no Vercel (JornadaPro):**

1. Acesse: https://vercel.com → Projeto **Ponto_Diario-1**
2. Vá em **Settings** → **Environment Variables**
3. **Verifique se estão configuradas:**

```
NEXT_PUBLIC_PRODUCT_ID=e8ff7872-dedb-405c-bf8a-f7901ac4b432
NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL=https://n8n-a8kh.onrender.com/webhook-test/verificar-acesso-jornadapro
```

**Valores esperados:**
- **`NEXT_PUBLIC_PRODUCT_ID`** = `e8ff7872-dedb-405c-bf8a-f7901ac4b432` (ID do JornadaPro em `registered_apps`)
- **`NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`** = URL do webhook n8n (teste ou produção)

---

## 🔍 Verificação do Status

### ✅ Arquivos Corrigidos

1. ✅ `src/components/portal/ProductCard.jsx` - Verifica acesso via n8n antes de abrir
2. ✅ `src/pages/portal/PortalProdutos.jsx` - Verifica acesso via n8n antes de abrir

### ⚠️ Configurações Necessárias

1. ⚠️ **Render (n8n):** Configurar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
2. ⚠️ **Vercel (JornadaPro):** Verificar `NEXT_PUBLIC_PRODUCT_ID` e `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`

---

## 📋 Checklist de Correção

### Portal (LWDigitalForge)
- [x] `ProductCard.jsx` atualizado (verifica n8n antes de abrir)
- [x] `PortalProdutos.jsx` atualizado (verifica n8n antes de abrir)
- [x] `PortalTestes.jsx` já estava correto
- [x] `PortalMeusProdutos.jsx` já estava correto
- [ ] Commit e push (aguardando)

### n8n (Render)
- [ ] Verificar `SUPABASE_URL` no Render (n8n)
- [ ] Verificar `SUPABASE_SERVICE_ROLE_KEY` no Render (n8n)
- [ ] Verificar se Node 4 busca `status=eq.APPROVED` (correto)
- [ ] Verificar se Node 11 retorna 403 com `redirectUrl` (correto)

### JornadaPro (Vercel)
- [ ] Verificar `NEXT_PUBLIC_PRODUCT_ID` = `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- [ ] Verificar `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL` = URL do n8n

---

## 🚀 Como Verificar

### 1. Verificar URL do Supabase no n8n

**No Render (n8n):**
1. Settings → Environment Variables
2. Verifique `SUPABASE_URL`
3. Se não existir, adicione com o URL correto do seu projeto Supabase

### 2. Verificar Variáveis do JornadaPro

**No Vercel:**
1. Settings → Environment Variables
2. Verifique `NEXT_PUBLIC_PRODUCT_ID`
3. Verifique `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`

### 3. Testar Botão "Acessar Produto"

1. Acesse `/portal/produtos`
2. Clique no botão com ícone `ExternalLink` em um produto
3. **Esperado:** Verifica acesso via n8n antes de abrir

---

## 📝 Notas Importantes

1. **URL do Supabase:**
   - O workflow n8n usa variável de ambiente `SUPABASE_URL`
   - Fallback fixo: `wwwwyuwighdehmvnolrl.supabase.co`
   - Se for outro projeto, configure a variável no Render

2. **Status APPROVED:**
   - Node 4 do n8n busca `status=eq.APPROVED`
   - AdminUsuarios.jsx já usa `status='APPROVED'` ✅
   - Está correto

3. **Erro 403:**
   - Node 11 retorna 403 com `redirectUrl` no JSON
   - `subscription-service.js` já trata 403 corretamente ✅

4. **PRODUCT_ID:**
   - JornadaPro lê do `sessionStorage` primeiro
   - Fallback: `NEXT_PUBLIC_PRODUCT_ID`
   - Se ambos falharem, nega acesso

---

## 🎯 Próximos Passos

1. ✅ **Arquivos corrigidos** no Portal
2. ⏳ **Commit e push** do Portal
3. ⚠️ **Verificar** variáveis no Render (n8n) e Vercel (JornadaPro)
4. 🧪 **Testar** botão "Acessar Produto" após deploy
