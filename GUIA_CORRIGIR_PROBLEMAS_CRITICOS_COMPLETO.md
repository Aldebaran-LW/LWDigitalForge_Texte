# 🔧 Guia Completo: Corrigir Problemas Críticos - n8n, Portal e JornadaPro

## ❌ Problemas Identificados

### 1. ❌ **Workflow n8n** - URL Supabase Fixada
### 2. ❌ **Portal** - Botão "Acessar Produto" não verifica via n8n
### 3. ❌ **JornadaPro** - Variáveis de ambiente precisam ser verificadas

---

## ✅ Correção 1: Workflow n8n - URL Supabase

### ❌ Problema

**Node 3.5 (Carregar Variáveis de Ambiente):**
- URL do Supabase está fixada como `wwwwyuwighdehmvnolrl.supabase.co`
- Se o projeto atual for outro, o n8n está consultando base errada

### ✅ Solução

**No Render (n8n) - Configurar Variáveis de Ambiente:**

1. Acesse o n8n no Render
2. Vá em **Settings** → **Environment Variables**
3. **Adicione as variáveis:**

**`SUPABASE_URL`**
- **Valor:** `https://wwwwyuwighdehmvnolrl.supabase.co`
- **Ou** o URL correto do seu projeto Supabase

**`SUPABASE_SERVICE_ROLE_KEY`**
- **Valor:** Sua chave de service role do Supabase
- **Onde encontrar:** Supabase → Settings → API → service_role (secret)

**Como funciona:**
- O Node 3.5 usa: `process.env.SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co'`
- Se `SUPABASE_URL` estiver configurada no Render, usará ela
- Se não estiver, usará o fallback fixado

**Recomendação:**
- ✅ **Configure** `SUPABASE_URL` no Render (para garantir que está correto)
- ✅ **Configure** `SUPABASE_SERVICE_ROLE_KEY` no Render (OBRIGATÓRIO)

---

## ✅ Correção 2: Portal - Botão "Acessar Produto"

### ❌ Problema 1: `ProductCard.jsx`

**Linha 88-89:** Botão "Entrar no App" apenas abre link sem verificar acesso

### ✅ Solução Aplicada

✅ **Arquivo atualizado:** `src/components/portal/ProductCard.jsx`

**Mudanças:**
1. Importado `checkAccessViaN8N` e `createAccessDeniedNotification`
2. Adicionado estado `checkingAccess`
3. Botão agora verifica acesso via n8n **antes** de abrir app
4. Se `hasAccess: false` → Mostra toast e redireciona

### ❌ Problema 2: `PortalProdutos.jsx`

**Linha 380:** Botão `ExternalLink` abre `vercel_deployment_url` diretamente

### ✅ Solução Aplicada

✅ **Arquivo atualizado:** `src/pages/portal/PortalProdutos.jsx`

**Mudanças:**
1. Botão `ExternalLink` agora só aparece se `hasAccess: true`
2. Quando clica, verifica acesso via n8n antes de abrir
3. Se `hasAccess: false` → Mostra toast e redireciona

---

## ✅ Correção 3: JornadaPro - Variáveis de Ambiente

### ❌ Problema

**`components/Gatekeeper.jsx`:**
- O `appId` é obtido do `sessionStorage` (`app_product_id`)
- Fallback: `process.env.NEXT_PUBLIC_PRODUCT_ID`
- Se ambos falharem, acesso negado

### ✅ Solução

**Verificar no Vercel (JornadaPro):**

1. Acesse: https://vercel.com → Projeto **Ponto_Diario-1**
2. Vá em **Settings** → **Environment Variables**
3. **Verifique se estão configuradas:**

#### Variável 1: `NEXT_PUBLIC_PRODUCT_ID`

**Nome:** `NEXT_PUBLIC_PRODUCT_ID`  
**Valor:** `e8ff7872-dedb-405c-bf8a-f7901ac4b432`  
**Onde encontrar:** Supabase → Table Editor → `registered_apps` → coluna **id** do JornadaPro

**Ambientes:**
- ✅ Production
- ✅ Preview
- ✅ Development

#### Variável 2: `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`

**Nome:** `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`  
**Valor:** `https://n8n-a8kh.onrender.com/webhook-test/verificar-acesso-jornadapro`  
**Ou produção:** `https://n8n-a8kh.onrender.com/webhook/verificar-acesso-jornadapro`

**Ambientes:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🔍 Verificação das Correções

### ✅ Arquivos Corrigidos

#### Portal (LWDigitalForge)
1. ✅ `src/components/portal/ProductCard.jsx` - Verifica acesso via n8n antes de abrir
2. ✅ `src/pages/portal/PortalProdutos.jsx` - Verifica acesso via n8n antes de abrir
3. ✅ `src/pages/portal/PortalTestes.jsx` - Já estava correto
4. ✅ `src/pages/portal/PortalMeusProdutos.jsx` - Já estava correto

### ⚠️ Configurações Necessárias

#### n8n (Render)
- [ ] **Verificar** `SUPABASE_URL` no Render (n8n)
- [ ] **Verificar** `SUPABASE_SERVICE_ROLE_KEY` no Render (n8n)

#### JornadaPro (Vercel)
- [ ] **Verificar** `NEXT_PUBLIC_PRODUCT_ID` = `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- [ ] **Verificar** `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL` = URL do n8n

---

## 🧪 Como Testar

### Teste 1: Portal → ProductCard

1. Acesse `/portal/produtos`
2. Clique em "Entrar no App" em um produto (se tiver acesso)
3. **Esperado:** Verifica acesso via n8n antes de abrir

### Teste 2: Portal → PortalProdutos

1. Acesse `/portal/produtos`
2. Clique no botão `ExternalLink` em um produto (se tiver acesso)
3. **Esperado:** Verifica acesso via n8n antes de abrir

### Teste 3: JornadaPro → Acesso Direto

1. Acesse `https://jornadapro.lwdigitalforge.com` diretamente
2. **Esperado:** 
   - Se tem acesso: Mostra aplicação
   - Se não tem acesso: Redireciona para `redirectUrl` do n8n

---

## 📝 Notas Importantes

### 1. Workflow n8n - Status APPROVED

**Node 4 do n8n busca:** `status=eq.APPROVED`

**Código do Portal usa:** `status='APPROVED'` ✅

**Status:** ✅ **CORRETO** - Não precisa mudar

### 2. Workflow n8n - Erro 403

**Node 11 retorna:** HTTP 403 com JSON `{ hasAccess: false, redirectUrl: "..." }`

**Código do JornadaPro trata:** 
- 403 → Lê `redirectUrl` do JSON e redireciona ✅

**Status:** ✅ **CORRETO** - Não precisa mudar

### 3. JornadaPro - PRODUCT_ID

**Código atual:**
```javascript
appId = sessionStorage.getItem('app_product_id') || process.env.NEXT_PUBLIC_PRODUCT_ID
```

**Funcionamento:**
- ✅ Lê do `sessionStorage` primeiro (salvo pelo Portal quando clica "Acessar")
- ✅ Fallback para `NEXT_PUBLIC_PRODUCT_ID` (para acesso direto)
- ✅ Se ambos falharem, nega acesso (fail-safe)

**Status:** ✅ **CORRETO** - Apenas verificar se `NEXT_PUBLIC_PRODUCT_ID` está configurado no Vercel

---

## 🚀 Próximos Passos

1. ✅ **Arquivos corrigidos** no Portal (ProductCard e PortalProdutos)
2. ⏳ **Commit e push** do Portal
3. ⚠️ **Verificar** variáveis no Render (n8n) e Vercel (JornadaPro)
4. 🧪 **Testar** após deploy

---

## 📋 Checklist Final

### Portal (LWDigitalForge)
- [x] `ProductCard.jsx` atualizado (verifica n8n antes de abrir)
- [x] `PortalProdutos.jsx` atualizado (verifica n8n antes de abrir)
- [ ] Commit e push

### n8n (Render)
- [ ] Verificar `SUPABASE_URL` configurada
- [ ] Verificar `SUPABASE_SERVICE_ROLE_KEY` configurada

### JornadaPro (Vercel)
- [ ] Verificar `NEXT_PUBLIC_PRODUCT_ID` = `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- [ ] Verificar `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL` = URL do n8n

---

## 🎯 Resumo

### ✅ O Que Foi Corrigido

1. **ProductCard.jsx** - Agora verifica acesso via n8n antes de abrir
2. **PortalProdutos.jsx** - Agora verifica acesso via n8n antes de abrir

### ⚠️ O Que Precisa Ser Verificado

1. **Render (n8n)** - Variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
2. **Vercel (JornadaPro)** - Variáveis `NEXT_PUBLIC_PRODUCT_ID` e `NEXT_PUBLIC_CHECK_SUBSCRIPTION_URL`

### ✅ O Que Já Estava Correto

1. **Workflow n8n** - Node 4 busca `status=APPROVED` ✅
2. **Workflow n8n** - Node 11 retorna 403 com `redirectUrl` ✅
3. **JornadaPro** - Código lê `app_product_id` do sessionStorage ✅
