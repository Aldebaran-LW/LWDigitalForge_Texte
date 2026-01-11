# ✅ Edge Function Deploy - Sucesso!

## 🎉 Status: FUNÇÃO DEPLOYADA COM SUCESSO!

### ✅ Deploy Realizado

**Função:** `check-subscription`  
**URL:** `https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription`  
**Última atualização:** 11 de Janeiro de 2026 3:19 PM  
**Deployments:** 4

---

## 📋 Informações da Função

### Endpoint URL
```
https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
```

### Como Testar (cURL)
```bash
curl -L -X POST 'https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription' \
-H 'Authorization: Bearer SUPABASE_PUBLISHABLE_DEFAULT_KEY' \
-H 'apikey: SUPABASE_PUBLISHABLE_DEFAULT_KEY' \
-H 'Content-Type: application/json' \
--data '{
  "userId": "uuid-do-usuario",
  "email": "email@exemplo.com",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}'
```

---

## 🔐 Secrets (Segredos)

### Google OAuth Client Secret

**Nome:** `920640282558-6caa28fe9q5gjta4ekohi78eq1itcc5o.apps.googleusercontent.com`  
**Valor:** `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`

**Como adicionar no Dashboard:**
1. Acesse: https://app.supabase.com/
2. Edge Functions → Secrets
3. Adicione o secret com:
   - **Nome:** `920640282558-6caa28fe9q5gjta4ekohi78eq1itcc5o.apps.googleusercontent.com`
   - **Valor:** `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`
4. Clique em "Save"

---

## 📊 Secrets Existentes

Os seguintes secrets já estão configurados:

- ✅ `MERCADOPAGO_ACCESS_TOKEN_TESTE`
- ✅ `MERCADOPAGO_ACCESS_TOKEN`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`

---

## 🔍 Logs de Debug

A função inclui os seguintes logs de debug:

- `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO:`
- `🔍 [Edge Function] targetAppId extraído:`

**Como verificar logs:**
1. Acesse: https://app.supabase.com/
2. Edge Functions → check-subscription → Logs
3. Procure pelos logs acima

---

## ✅ Checklist

- [x] Função deployada com sucesso
- [x] URL da função disponível
- [x] Logs de debug incluídos
- [ ] Secret do Google OAuth adicionado (se necessário)
- [ ] Função testada com requisição real
- [ ] Logs verificados após teste

---

## 🎯 Próximos Passos

1. ✅ **Função deployada** - CONCLUÍDO
2. **Adicionar secret do Google OAuth** (se necessário para a função)
3. **Testar a função** usando o endpoint
4. **Verificar logs** após teste

---

**Função pronta para uso!** ✅🚀
