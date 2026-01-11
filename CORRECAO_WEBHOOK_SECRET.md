# ⚠️ Correção: Secret do Webhook Incompleto

## ❌ Problema Identificado

O header `x-supabase-signature` está **INCOMPLETO**!

### ❌ O que está configurado:
```
bb-4260-940d-d543eec8ca17
```

### ✅ O que DEVE estar configurado:
```
21e38287-92bb-4260-940d-d543eec8ca17
```

**Está faltando:** `21e38287-92` no início!

---

## ✅ Correção Imediata

### No Supabase Dashboard:

1. **Vá em:** Database → Webhooks
2. **Clique no webhook criado**
3. **Edite o header `x-supabase-signature`**
4. **Cole o secret COMPLETO:**
   ```
   21e38287-92bb-4260-940d-d543eec8ca17
   ```
5. **Save**

---

## ✅ Configuração Correta Completa

### HTTP Request:
- **Method:** `POST` ✅ (correto)
- **URL:** `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription` ✅ (correto)
- **Timeout:** `5000` ✅ (ok)

### HTTP Headers:
- **Content-type:** `application/json` ✅ (correto)
- **x-supabase-signature:** `21e38287-92bb-4260-940d-d543eec8ca17` ⚠️ **CORRIGIR!**

### HTTP Parameters:
- Vazio ✅ (ok, não é necessário)

---

## ⚠️ Por que é Importante?

Se o secret estiver incompleto:
- ❌ Webhook vai falhar autenticação
- ❌ Endpoint vai retornar 401 (Unauthorized)
- ❌ Cache não será atualizado
- ❌ Webhooks não funcionarão

**O secret DEVE ser EXATAMENTE IGUAL na Vercel e no Supabase!**

---

## ✅ Checklist Corrigido

- [ ] Secret na Vercel: `21e38287-92bb-4260-940d-d543eec8ca17` ✅
- [ ] Secret no Supabase: `21e38287-92bb-4260-940d-d543eec8ca17` ⚠️ **CORRIGIR!**
- [ ] URL: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription` ✅
- [ ] Method: `POST` ✅

---

**Corrija o secret no Supabase para o valor COMPLETO!** ⚠️✅
