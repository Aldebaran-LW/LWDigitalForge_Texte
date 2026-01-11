# 🚀 Deploy Manual via Dashboard (RECOMENDADO)

## ⚠️ Problema com CLI

O Supabase CLI está tendo problemas com o arquivo `.env`. 

**Solução:** Usar o Dashboard do Supabase (mais rápido e direto!)

---

## ✅ Passo a Passo - Deploy via Dashboard

### 1. Acessar o Dashboard

1. **Acesse:** https://app.supabase.com/
2. **Selecione seu projeto:** `LW_Digital_Forge` (wwwwyuwighdehmvnolrl)

### 2. Acessar Edge Functions

1. No menu lateral, clique em **"Edge Functions"** (ou **"Functions"**)
2. Procure por **"check-subscription"**
3. Se a função já existir, clique nela para editar
4. Se não existir, clique em **"Create a new function"** e nomeie como `check-subscription`

### 3. Copiar e Colar o Código

1. **Abra o arquivo:** `supabase/functions/check-subscription/index.ts` no seu editor
2. **Selecione TODO o conteúdo** (Ctrl+A)
3. **Copie** (Ctrl+C)
4. **Cole no editor do Dashboard** (Ctrl+V)

### 4. Salvar/Deploy

1. Clique em **"Deploy"** ou **"Save"**
2. O deploy será automático!

---

## 📋 Verificar Deploy

### 1. Verificar Código

- Certifique-se de que o código foi salvo corretamente
- Verifique se os logs de debug estão presentes:
  - `console.log("🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO:", ...)`
  - `console.log("🔍 [Edge Function] targetAppId extraído:", ...)`

### 2. Verificar Logs

1. **Functions** → **check-subscription** → **Logs**
2. Faça uma requisição de teste (se necessário)
3. Procure por: `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO`

---

## ✅ Checklist

- [ ] Dashboard acessado
- [ ] Função `check-subscription` encontrada/criada
- [ ] Código copiado de `supabase/functions/check-subscription/index.ts`
- [ ] Código colado no editor do Dashboard
- [ ] Deploy/Save realizado
- [ ] Código verificado (logs presentes)
- [ ] Logs verificados

---

**Esta é a forma mais rápida e confiável!** ✅
