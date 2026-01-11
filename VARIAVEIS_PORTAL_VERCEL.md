# ⚙️ Variáveis de Ambiente: Portal Principal na Vercel

## 📋 Checklist: Verificar Variáveis na Vercel

### ⚠️ IMPORTANTE: Portal Principal vs Aplicações

**Portal Principal (LWDigitalForge_Texte):**
- Usa variáveis `VITE_*` (Vite/React)
- Projeto na Vercel: `lwdigitalforge` ou similar (portal principal)

**Aplicações (Ponto_Diario-1-2, etc.):**
- Usam variáveis `NEXT_PUBLIC_*` (Next.js)
- Projeto separado na Vercel (ex: `jornada-pro`)

---

## ✅ Variáveis Obrigatórias no Portal Principal

### 1. **Supabase (OBRIGATÓRIAS)**

```env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
```

**Status:** ✅ Já têm fallback hardcoded, mas é melhor ter nas variáveis

**Onde verificar:** Vercel → Projeto do Portal → Settings → Environment Variables

---

### 2. **Mercado Pago (SE usar checkout)**

```env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-a2044252-584b-4715-a558-bf11c837874a
```

**Status:** ⚠️ Verificar se está configurada

**Onde usar:** Checkout de pagamentos no portal

---

### 3. **Supabase Service Role (Para Edge Functions - Server-side)**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs
```

**Status:** ⚠️ Verificar se está configurada (usada nas Edge Functions)

**Onde usar:** Edge Functions do Supabase (server-side)

---

## ✅ Variáveis Opcionais

### Firebase (SE usar integração Firebase)

```env
VITE_FIREBASE_API_KEY=AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=469330532024
VITE_FIREBASE_APP_ID=1:469330532024:web:abc123
VITE_FIREBASE_OAUTH_CLIENT_ID=469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com
```

**Status:** ⚠️ Apenas se usar Firebase

---

## 🔍 Como Verificar na Vercel

### Passo a Passo:

1. **Acesse:** https://vercel.com/dashboard

2. **Selecione o projeto do PORTAL PRINCIPAL**
   - Nome: `lwdigitalforge`, `portal-lwdigitalforge`, etc.
   - ⚠️ **NÃO** o projeto das aplicações!

3. **Vá em:** **Settings** → **Environment Variables**

4. **Verifique se existem:**

   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
   - [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` (se usar MercadoPago)
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` (se usar Edge Functions)

5. **Se não existirem, adicione:**

   **Variável 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://wwwwyuwighdehmvnolrl.supabase.co`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

   **Variável 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

6. **Faça Redeploy** após adicionar variáveis

---

## ⚠️ Importante: Fallback Hardcoded

O código do portal tem **fallback hardcoded**:

```javascript
// src/lib/customSupabaseClient.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Isso significa:**
- ✅ Portal funciona **mesmo sem variáveis** (usa fallback)
- ✅ Mas é **melhor ter nas variáveis** para:
  - Facilidade de mudança
  - Boas práticas
  - Não depender de código hardcoded

---

## ✅ Resumo: O Que Verificar

### OBRIGATÓRIO (Recomendado):

- [ ] `VITE_SUPABASE_URL` - URL do Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` - Chave anon do Supabase

### OPCIONAL (Se usar):

- [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` - Se usar checkout MercadoPago
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Se usar Edge Functions server-side
- [ ] Variáveis Firebase - Se usar integração Firebase

---

## 🎯 Resposta Direta

### "Precisa atualizar alguma variável no portal?"

**Resposta:**

1. **Já funciona sem variáveis** (tem fallback hardcoded) ✅

2. **Mas é recomendado ter:**
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`

3. **Verificar se estão configuradas na Vercel:**
   - Acessar projeto do portal na Vercel
   - Settings → Environment Variables
   - Se não estiverem, adicionar

4. **Após adicionar:** Fazer redeploy

---

## 📊 Status Atual

**Portal Principal:**
- ✅ Código tem fallback → Funciona mesmo sem variáveis
- ⚠️ **Verificar** se variáveis estão na Vercel (recomendado)
- ⚠️ **Adicionar** se não estiverem (boa prática)

**Aplicações (Ponto_Diario, etc.):**
- ✅ Já documentado em `GUIA_PASSO_A_PASSO_VARIAVEIS.md`
- ✅ Precisam de `NEXT_PUBLIC_*` (diferente do portal!)

---

**Resumo: Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas no portal na Vercel. Se não estiverem, adicionar (opcional, mas recomendado).**
