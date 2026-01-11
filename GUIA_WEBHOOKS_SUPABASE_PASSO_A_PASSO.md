# 🔔 Guia Passo a Passo: Configurar Webhooks no Supabase

## 🎯 Objetivo

Configurar webhooks para notificar a aplicação quando houver mudanças em `user_purchases` ou `user_trials`.

---

## ✅ Pré-requisitos

1. ✅ Endpoint `/api/webhooks/subscription` existe na aplicação
2. ✅ Aplicação está deployada na Vercel
3. ✅ Você tem acesso ao Supabase Dashboard

---

## 🔧 Passo 1: Gerar Secret para Webhook

### Opção 1: Gerar Online

Acesse: https://www.uuidgenerator.net/

Ou gere um UUID forte:
- Exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### Opção 2: Gerar no Terminal

```bash
# Windows PowerShell
[guid]::NewGuid().ToString()

# Linux/Mac
uuidgen
```

**Guarde este secret! Você vai usar no Supabase E na Vercel.**

---

## 🔧 Passo 2: Adicionar Secret na Vercel

1. **Acesse:** https://vercel.com/dashboard

2. **Selecione o projeto da APLICAÇÃO** (ex: `jornada-pro`)

3. **Settings** → **Environment Variables**

4. **Add New**:
   - **Key**: `SUPABASE_WEBHOOK_SECRET`
   - **Value**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (o secret que você gerou)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

5. **Save**

6. **⚠️ IMPORTANTE:** Faça **Redeploy** após adicionar!

---

## 🔧 Passo 3: Configurar Webhook no Supabase (user_purchases)

1. **Acesse:** https://supabase.com/dashboard

2. **Selecione seu projeto**

3. **Database** → **Webhooks**

4. **Create a new webhook**

5. **Preencha:**

   **Name:**
   ```
   notify-apps-purchases
   ```

   **Table:**
   ```
   user_purchases
   ```

   **Events:**
   - ✅ **INSERT**
   - ✅ **UPDATE**
   - ✅ **DELETE**

   **HTTP Request:**
   - **URL**: `https://jornada-pro.vercel.app/api/webhooks/subscription`
     - ⚠️ **Substitua** pela URL real da sua aplicação!
     - ⚠️ **NÃO** use a URL do portal principal!
   - **Method**: `POST`
   - **HTTP Version**: `1.1`
   
   **Headers:**
   ```
   x-supabase-signature: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
   - ⚠️ Use o **mesmo secret** que você configurou na Vercel!

   **Body (opcional, mas recomendado):**
   ```json
   {
     "type": "{{event_type}}",
     "table": "{{table}}",
     "record": "{{record}}",
     "old_record": "{{old_record}}"
   }
   ```

6. **Save**

---

## 🔧 Passo 4: Configurar Webhook no Supabase (user_trials)

1. **Create a new webhook** novamente

2. **Preencha:**

   **Name:**
   ```
   notify-apps-trials
   ```

   **Table:**
   ```
   user_trials
   ```

   **Events:**
   - ✅ **INSERT**
   - ✅ **UPDATE**
   - ✅ **DELETE**

   **HTTP Request:**
   - **URL**: `https://jornada-pro.vercel.app/api/webhooks/subscription`
     - ⚠️ Mesma URL do webhook anterior!
   - **Method**: `POST`
   - **HTTP Version**: `1.1`
   
   **Headers:**
   ```
   x-supabase-signature: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
   - ⚠️ Mesmo secret!

   **Body:**
   ```json
   {
     "type": "{{event_type}}",
     "table": "{{table}}",
     "record": "{{record}}",
     "old_record": "{{old_record}}"
   }
   ```

3. **Save**

---

## 🧪 Passo 5: Testar Webhook

### Teste 1: Health Check

Acesse no navegador:
```
https://jornada-pro.vercel.app/api/webhooks/subscription
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Webhook endpoint ativo",
  "timestamp": "2026-01-10T..."
}
```

### Teste 2: Teste Manual no Supabase

1. No Supabase Dashboard, vá em **Database** → **Webhooks**
2. Clique no webhook criado
3. Clique em **"Test webhook"**
4. Verifique os logs da aplicação na Vercel

### Teste 3: Teste Real

1. **Atualize um registro** em `user_purchases`:
   ```sql
   UPDATE user_purchases
   SET expires_at = expires_at + INTERVAL '1 day'
   WHERE id = 3;
   ```

2. **Verifique os logs** da aplicação na Vercel:
   - Deve aparecer: `🔔 [Webhook] Evento recebido`
   - Deve aparecer: `✅ [Webhook] Cache atualizado`

3. **Verifique no Supabase Dashboard**:
   - Vá em **Database** → **Webhooks**
   - Clique no webhook
   - Veja **"Recent deliveries"**
   - Deve mostrar status **200 OK**

---

## ✅ Checklist Final

- [ ] Secret gerado e guardado
- [ ] `SUPABASE_WEBHOOK_SECRET` configurado na Vercel
- [ ] Redeploy feito após adicionar variável
- [ ] Webhook para `user_purchases` criado
- [ ] Webhook para `user_trials` criado
- [ ] URLs dos webhooks estão corretas (aplicação, não portal!)
- [ ] Headers com `x-supabase-signature` configurados
- [ ] Teste de health check passou
- [ ] Teste real funcionando
- [ ] Logs mostrando eventos recebidos

---

## 🚨 Problemas Comuns

### Webhook não está sendo chamado

**Solução:**
1. ✅ Verificar se URL está correta (aplicação, não portal!)
2. ✅ Verificar se aplicação está online
3. ✅ Verificar se webhook está ativo no Supabase
4. ✅ Verificar logs do Supabase Dashboard

### Erro 401 (Unauthorized)

**Solução:**
1. ✅ Verificar se `SUPABASE_WEBHOOK_SECRET` está configurado na Vercel
2. ✅ Verificar se header `x-supabase-signature` está correto
3. ✅ Verificar se secret no Supabase é o mesmo da Vercel
4. ✅ Fazer redeploy após adicionar variável

### Webhook recebido mas cache não atualiza

**Solução:**
1. ✅ Verificar logs: `🗑️ [Cache] Cache invalidado`
2. ✅ Verificar se `userId` e `appId` estão presentes no payload
3. ✅ Verificar se endpoint está processando corretamente

---

## 📊 Monitoramento

### No Supabase Dashboard

1. **Database** → **Webhooks**
2. Clique no webhook
3. Veja **"Recent deliveries"**:
   - Status: 200 OK = Funcionando ✅
   - Status: 4xx/5xx = Erro ❌

### Nos Logs da Aplicação (Vercel)

Procure por:
- `🔔 [Webhook] Evento recebido` - Webhook funcionando ✅
- `✅ [Webhook] Cache atualizado` - Cache atualizado ✅
- `❌ [Webhook] Erro` - Erro ao processar ❌

---

**Agora os webhooks estão configurados! Mudanças em user_purchases/user_trials serão notificadas em tempo real!** 🎉
