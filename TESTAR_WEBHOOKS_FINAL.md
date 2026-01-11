# 🧪 Testar Webhooks - Passos Finais

## ✅ Status Atual

- [x] Secret adicionado na Vercel ✅
- [x] Redeploy feito na Vercel ✅
- [x] Webhook user_purchases criado ✅
- [x] Webhook user_trials criado ✅
- [ ] Health check passou ⏳
- [ ] Teste real funcionou ⏳

---

## 🧪 Teste 1: Health Check (30 segundos)

### O que é?

Verificar se o endpoint do webhook está ativo e acessível.

### Como Testar:

**Opção 1: No Navegador (Mais Fácil)**

1. Abra o navegador
2. Acesse:
   ```
   https://jornadapro.lwdigitalforge.com/api/webhooks/subscription
   ```

**Resultado Esperado:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint ativo",
  "timestamp": "2026-01-10T..."
}
```

**✅ Se retornar isso = Health check PASSOU!**

**❌ Se der erro (404, 500, etc.) = Problema!**

---

## 🧪 Teste 2: Teste Real (2 minutos)

### O que é?

Fazer uma mudança real no banco e verificar se o webhook é chamado.

### Como Testar:

#### Passo 1: Atualizar um Registro

1. **Acesse:** https://supabase.com/dashboard
2. **SQL Editor**
3. **Execute:**

```sql
-- Atualizar um registro em user_purchases
UPDATE user_purchases
SET expires_at = expires_at + INTERVAL '1 day'
WHERE id = 3
RETURNING id, user_id, app_id, expires_at;
```

**Ou:**

```sql
-- Ver registros disponíveis para testar
SELECT id, user_id, app_id, purchased_at, expires_at
FROM user_purchases
ORDER BY id
LIMIT 5;

-- Atualizar o primeiro registro
UPDATE user_purchases
SET expires_at = expires_at + INTERVAL '1 day'
WHERE id = (SELECT MIN(id) FROM user_purchases)
RETURNING id, user_id, app_id;
```

#### Passo 2: Verificar Logs na Vercel

1. **Acesse:** https://vercel.com/dashboard
2. **Projeto:** `ponto-diario-1`
3. **Deployments** → Clique no deployment mais recente
4. **Logs** (aba no topo)

**O que procurar:**

**✅ Sucesso:**
```
🔔 [Webhook] Evento recebido: { type: 'UPDATE', table: 'user_purchases', ... }
✅ [Webhook] Cache atualizado para: { userId: '...', appId: '...' }
```

**❌ Erro:**
```
❌ [Webhook] Erro: ...
❌ [Webhook] Assinatura inválida
```

#### Passo 3: Verificar no Supabase Dashboard

1. **Database** → **Webhooks**
2. **Clique no webhook** `notify-apps-purchases`
3. **Veja "Recent deliveries"**

**✅ Sucesso:**
- Status: **200 OK**
- Response: `{"success": true, "message": "Cache atualizado", ...}`

**❌ Erro:**
- Status: **401 Unauthorized** (secret incorreto)
- Status: **500 Internal Server Error** (erro no código)
- Status: **404 Not Found** (URL incorreta)

---

## ✅ Resultado Esperado

### Se Tudo Estiver Funcionando:

**Health Check:**
```json
{
  "status": "ok",
  "message": "Webhook endpoint ativo",
  "timestamp": "2026-01-10T..."
}
```

**Logs da Vercel:**
```
🔔 [Webhook] Evento recebido: { type: 'UPDATE', table: 'user_purchases', userId: '...', appId: '...' }
✅ [Webhook] Cache atualizado para: { userId: '...', appId: '...' }
```

**Supabase Dashboard:**
- Recent deliveries: Status **200 OK**

---

## ❌ Problemas Comuns e Soluções

### Health Check falhou (404 ou erro):

**Problema:** URL incorreta ou endpoint não existe

**Solução:**
1. Verificar se URL está correta: `https://jornadapro.lwdigitalforge.com/api/webhooks/subscription`
2. Verificar se arquivo existe: `app/api/webhooks/subscription/route.js`
3. Verificar se deploy foi feito após criar o arquivo

### Teste Real falhou (401 Unauthorized):

**Problema:** Secret incorreto ou incompleto

**Solução:**
1. Verificar se secret na Vercel está correto: `21e38287-92bb-4260-940d-d543eec8ca17`
2. Verificar se secret no Supabase está correto (COMPLETO!): `21e38287-92bb-4260-940d-d543eec8ca17`
3. Verificar se redeploy foi feito após adicionar variável

### Teste Real falhou (500 Internal Server Error):

**Problema:** Erro no código do endpoint

**Solução:**
1. Verificar logs da Vercel (veja mensagem de erro completa)
2. Verificar se `SUPABASE_SERVICE_ROLE_KEY` está configurada (para verificação)
3. Verificar se código do endpoint está correto

### Webhook não aparece em "Recent deliveries":

**Problema:** Webhook não está sendo chamado

**Solução:**
1. Verificar se webhook está ativo no Supabase
2. Verificar se eventos estão marcados (INSERT, UPDATE, DELETE)
3. Verificar se a mudança no banco realmente aconteceu (verificar UPDATE funcionou)

---

## ✅ Checklist Final

### Health Check:
- [ ] Acessei URL no navegador
- [ ] Retornou `{"status": "ok"}` ✅
- [ ] OU retornou erro ❌ (ver problemas comuns)

### Teste Real:
- [ ] Executei UPDATE no banco
- [ ] Verifiquei logs da Vercel
- [ ] Vi mensagem `🔔 [Webhook] Evento recebido` ✅
- [ ] Verifiquei Supabase Dashboard
- [ ] Vi status 200 OK em "Recent deliveries" ✅
- [ ] OU vi erro ❌ (ver problemas comuns)

---

## 🎯 Próximos Passos

### Se Tudo Funcionou:

1. ✅ **Webhooks configurados e funcionando!**
2. ✅ **Cache será atualizado automaticamente quando houver mudanças**
3. ✅ **Sistema completo está pronto!**

### Se Houve Erros:

1. ⚠️ **Verificar problemas comuns acima**
2. ⚠️ **Corrigir conforme necessário**
3. ⚠️ **Testar novamente**

---

**Agora teste os 2 itens pendentes! Se funcionar, está tudo configurado!** ✅🧪
