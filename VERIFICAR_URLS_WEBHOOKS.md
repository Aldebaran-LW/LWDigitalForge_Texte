# 🔍 Verificar URLs dos Webhooks

## 🎯 Objetivo

Verificar se as URLs dos webhooks configurados no Supabase estão corretas.

---

## 📋 URLs Esperadas

### Aplicação Ponto_Diario-1-2 (JornadaPro)

**URL da aplicação:** `https://jornadapro.lwdigitalforge.com`

**Endpoint de webhook:** `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`

---

## 🔍 Verificar no Supabase

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Database** → **Webhooks**
4. **Verifique os webhooks criados:**

### Webhook 1: user_purchases

**Name:** `notify-apps-purchases` (ou similar)

**URL esperada:**
```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

**⚠️ NÃO deve ser:**
- ❌ `https://jornada-pro.vercel.app/api/webhooks/subscription`
- ❌ `https://portal-lwdigitalforge.vercel.app/api/webhooks/subscription`
- ❌ URL do portal principal

**✅ Deve ser:**
- ✅ `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`

### Webhook 2: user_trials

**Name:** `notify-apps-trials` (ou similar)

**URL esperada:**
```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

**⚠️ NÃO deve ser:**
- ❌ `https://jornada-pro.vercel.app/api/webhooks/subscription`
- ❌ `https://portal-lwdigitalforge.vercel.app/api/webhooks/subscription`
- ❌ URL do portal principal

**✅ Deve ser:**
- ✅ `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`

---

## ✅ Checklist

- [ ] Webhook `user_purchases` existe
- [ ] Webhook `user_purchases` URL: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Webhook `user_trials` existe
- [ ] Webhook `user_trials` URL: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Header `x-supabase-signature` configurado corretamente
- [ ] Método HTTP: `POST`
- [ ] HTTP Version: `1.1`

---

## 🔧 Como Corrigir

### Se a URL estiver errada:

1. **Acesse:** https://supabase.com/dashboard
2. **Database** → **Webhooks**
3. **Clique no webhook** que precisa ser corrigido
4. **Edite a URL:**
   - **URL:** `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
5. **Save**
6. **Teste o webhook** usando o botão "Test webhook"

---

## 📋 Nota Importante

**⚠️ Lembre-se:** Webhooks são OPCIONAIS!

A aplicação funciona perfeitamente SEM webhooks. Webhooks só são necessários se você precisar de atualização instantânea (<1 segundo).

**Ver:** `SOLUCAO_SIMPLIFICADA_SEM_WEBHOOK.md` para detalhes.

---

**VERIFICAR URLs NO SUPABASE E CORRIGIR SE NECESSÁRIO!** 🔍
