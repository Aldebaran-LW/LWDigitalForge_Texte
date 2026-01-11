# ✅ URLs Corretas dos Webhooks

## 🎯 URL Esperada

### Aplicação Ponto_Diario-1-2 (JornadaPro)

**URL da aplicação:** `https://jornadapro.lwdigitalforge.com`

**Endpoint de webhook:** `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`

---

## ✅ URL Correta

```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

---

## ❌ URLs Incorretas (NÃO usar)

- ❌ `https://jornada-pro.vercel.app/api/webhooks/subscription`
- ❌ `https://portal-lwdigitalforge.vercel.app/api/webhooks/subscription`
- ❌ URL do portal principal
- ❌ URL genérica do Vercel

---

## 🔍 Como Verificar no Supabase

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Database** → **Webhooks**
4. **Verifique cada webhook:**

### Webhook 1: user_purchases

**Nome esperado:** `notify-apps-purchases` (ou similar)

**URL esperada:**
```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

**Verificar:**
- [ ] URL está correta: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Método: `POST`
- [ ] HTTP Version: `1.1`
- [ ] Header: `x-supabase-signature: 21e38287-92bb-4260-940d-d543eec8ca17`

### Webhook 2: user_trials

**Nome esperado:** `notify-apps-trials` (ou similar)

**URL esperada:**
```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

**Verificar:**
- [ ] URL está correta: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Método: `POST`
- [ ] HTTP Version: `1.1`
- [ ] Header: `x-supabase-signature: 21e38287-92bb-4260-940d-d543eec8ca17`

---

## 🔧 Como Corrigir (Se Necessário)

### Se a URL estiver errada:

1. **Acesse:** https://supabase.com/dashboard
2. **Database** → **Webhooks**
3. **Clique no webhook** que precisa ser corrigido
4. **Edite a URL:**
   - **URL:** `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
5. **Save**
6. **Teste o webhook** usando o botão "Test webhook"

---

## ✅ Checklist Completo

- [ ] Webhook `user_purchases` existe
- [ ] Webhook `user_purchases` URL: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Webhook `user_trials` existe
- [ ] Webhook `user_trials` URL: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
- [ ] Header `x-supabase-signature` configurado: `21e38287-92bb-4260-940d-d543eec8ca17`
- [ ] Método HTTP: `POST`
- [ ] HTTP Version: `1.1`
- [ ] Events: `INSERT`, `UPDATE`, `DELETE` (ambos os webhooks)

---

## 📋 Nota Importante

**⚠️ Lembre-se:** Webhooks são OPCIONAIS!

A aplicação funciona perfeitamente SEM webhooks. Webhooks só são necessários se você precisar de atualização instantânea (<1 segundo).

**Ver:** `SOLUCAO_SIMPLIFICADA_SEM_WEBHOOK.md` para detalhes.

---

## 🧪 Testar Webhook

### 1. Health Check

Acesse no navegador:
```
https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Webhook endpoint ativo"
}
```

### 2. Testar no Supabase

1. No Dashboard do Supabase, vá em **Database** → **Webhooks**
2. Clique no webhook criado
3. Clique em **"Test webhook"**
4. Verifique os logs na Vercel

---

**VERIFICAR URLs NO SUPABASE E CORRIGIR SE NECESSÁRIO!** 🔍
