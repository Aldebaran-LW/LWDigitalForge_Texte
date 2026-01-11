# ✅ Checklist: Variáveis do Portal Principal na Vercel

## 🎯 Resposta Rápida

### **Funciona sem atualizar?** ✅ SIM!

O portal tem **fallback hardcoded**, então funciona mesmo sem variáveis configuradas na Vercel.

### **É recomendado atualizar?** ⚠️ SIM (Boa Prática)

Ter variáveis configuradas é melhor que depender de código hardcoded.

---

## 📋 Variáveis que o Portal Usa

### 1. **Supabase (Recomendado Adicionar)**

```env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
```

**Status:** 
- ✅ Funciona sem (tem fallback no código)
- ⚠️ **Recomendado adicionar** na Vercel

---

### 2. **Mercado Pago (Se usar checkout)**

```env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-a2044252-584b-4715-a558-bf11c837874a
```

**Status:** ⚠️ **Verificar** se está configurada (se usar checkout)

**Onde verificar:** `src/components/ShoppingCart.jsx` e `src/pages/PaginaCarrinho.jsx`

---

### 3. **Edge Functions (Opcional)**

```env
VITE_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
```

**Status:** ⚠️ **Opcional** (construído automaticamente se não estiver)

**Código:**
```javascript
const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
  `${import.meta.env.VITE_SUPABASE_URL || '...'}/functions/v1/check-subscription`;
```

---

## 🔍 Como Verificar na Vercel

### Passo a Passo:

1. **Acesse:** https://vercel.com/dashboard

2. **Selecione o projeto do PORTAL PRINCIPAL**
   - Procure por: `lwdigitalforge`, `portal-lwdigitalforge`, etc.
   - ⚠️ **NÃO** o projeto das aplicações!

3. **Vá em:** **Settings** → **Environment Variables**

4. **Verifique se existem:**
   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
   - [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` (se usar checkout)

5. **Se não existirem, adicione:**

   **Variável 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://wwwwyuwighdehmvnolrl.supabase.co`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - **Save**

   **Variável 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - **Save**

6. **Faça Redeploy:**
   - Vá em **Deployments**
   - Clique nos **3 pontos** (⋯) no deployment mais recente
   - **Redeploy**

---

## ⚠️ Diferença: Portal vs Aplicações

### Portal Principal (Vite/React):
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Aplicações (Next.js):
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_PRODUCT_ID=... (ÚNICO por app!)
```

**⚠️ IMPORTANTE:** Portal usa `VITE_*`, aplicações usam `NEXT_PUBLIC_*`!

---

## ✅ Checklist Final

### Portal Principal na Vercel:

- [ ] Identifiquei o projeto correto (portal, não aplicações)
- [ ] Verifiquei se `VITE_SUPABASE_URL` existe
- [ ] Verifiquei se `VITE_SUPABASE_ANON_KEY` existe
- [ ] Adicionei variáveis se não existirem
- [ ] Marquei para Production, Preview e Development
- [ ] Fiz redeploy após adicionar
- [ ] Testei o portal após redeploy

---

## 🎯 Resposta Final

### "Precisa atualizar alguma variável no portal?"

**Resposta:**

1. **Não é obrigatório** - Portal funciona sem (tem fallback) ✅

2. **Mas é recomendado adicionar:**
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`

3. **Para verificar:**
   - Acessar Vercel → Projeto do Portal
   - Settings → Environment Variables
   - Ver se as variáveis existem
   - Adicionar se não existirem

4. **Não precisa:**
   - ❌ `NEXT_PUBLIC_*` (isso é para aplicações!)
   - ❌ `NEXT_PUBLIC_PRODUCT_ID` (isso é para aplicações!)
   - ❌ `SUPABASE_SERVICE_ROLE_KEY` no portal (a menos que use Edge Functions server-side)

---

## 📊 Status Atual

**Portal Principal:**
- ✅ Código tem fallback → Funciona mesmo sem variáveis
- ⚠️ **Verificar** se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão na Vercel
- ✅ Se não estiverem, adicionar (opcional, mas recomendado)

**Aplicações (Ponto_Diario, etc.):**
- ✅ Já documentado separadamente
- ✅ Usam `NEXT_PUBLIC_*` (diferente!)
- ✅ Cada uma tem seu próprio `NEXT_PUBLIC_PRODUCT_ID`

---

**Conclusão: Verificar se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas no portal na Vercel. Se não estiverem, adicionar (não obrigatório, mas recomendado).**
