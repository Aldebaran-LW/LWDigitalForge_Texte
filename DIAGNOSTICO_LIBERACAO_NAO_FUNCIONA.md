# 🔍 Diagnóstico: Por que a Liberação Não Está Funcionando?

## ⚠️ Problema Identificado

Analisando as imagens que você compartilhou, vejo um **problema crítico**:

### ❌ `expires_at` está NULL em todas as compras!

Nas imagens, todos os registros em `user_purchases` têm:
- ✅ `purchased_at`: Preenchido
- ❌ `expires_at`: **NULL**
- ❌ `preference_id`: NULL

**Isso faz com que a verificação de assinatura FALHE!**

---

## 🔍 Como a Verificação Funciona

O código verifica:

```javascript
// Se expires_at for NULL, a assinatura é considerada INVÁLIDA!
if (subscription.expires_at && subscription.expires_at > now) {
  hasAccess = true
} else {
  hasAccess = false // expires_at NULL = SEM ACESSO!
}
```

**Se `expires_at` for NULL, o usuário SEMPRE será negado!**

---

## ✅ Solução: Preencher `expires_at`

### Opção 1: Atualizar Registros Existentes (SQL)

```sql
-- Atualizar compras existentes sem expires_at
-- Assumindo período de 1 mês a partir de purchased_at

UPDATE user_purchases
SET expires_at = purchased_at + INTERVAL '1 month'
WHERE expires_at IS NULL
  AND purchased_at IS NOT NULL;

-- OU para compras anuais:
UPDATE user_purchases
SET expires_at = purchased_at + INTERVAL '1 year'
WHERE expires_at IS NULL
  AND purchased_at IS NOT NULL;

-- OU para compras vitalícias (muito longe no futuro):
UPDATE user_purchases
SET expires_at = purchased_at + INTERVAL '100 years'
WHERE expires_at IS NULL
  AND purchased_at IS NOT NULL;
```

### Opção 2: Atualizar no Código (Futuro)

Garantir que quando uma compra é criada, `expires_at` seja preenchido:

```javascript
// Ao criar compra, definir expires_at baseado no tipo
const expiresAt = calculateExpirationDate(purchaseType, purchasedAt)
```

---

## 🔧 Configurar Webhooks (Recomendado)

Mesmo com `expires_at` preenchido, webhooks garantem atualização em tempo real.

### Passo 1: Configurar no Supabase

1. **Acesse:** https://supabase.com/dashboard
2. **Seu projeto** → **Database** → **Webhooks**
3. **Create a new webhook**

**Webhook 1: `user_purchases`**
- **Name**: `notify-apps-purchases`
- **Table**: `user_purchases`
- **Events**: ✅ INSERT, ✅ UPDATE, ✅ DELETE
- **URL**: `https://jornada-pro.vercel.app/api/webhooks/subscription`
  - ⚠️ Use a URL da **APLICAÇÃO**, não do portal!
- **Method**: `POST`
- **HTTP Version**: `1.1`
- **Headers**:
  ```
  x-supabase-signature: seu-secret-forte-aqui
  ```
- **Body**:
  ```json
  {
    "type": "{{event_type}}",
    "table": "{{table}}",
    "record": "{{record}}",
    "old_record": "{{old_record}}"
  }
  ```

**Webhook 2: `user_trials`**
- **Name**: `notify-apps-trials`
- **Table**: `user_trials`
- **Events**: ✅ INSERT, ✅ UPDATE, ✅ DELETE
- **URL**: Mesma do webhook 1
- **Method**: `POST`
- **Headers**: Mesmo
- **Body**: Mesmo

### Passo 2: Configurar Secret

Na Vercel da aplicação:

1. **Settings** → **Environment Variables**
2. **Add New**:
   - **Key**: `SUPABASE_WEBHOOK_SECRET`
   - **Value**: `seu-secret-forte-aqui` (mesmo do header!)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
3. **Save**
4. **Redeploy**

### Passo 3: Testar

1. **Criar/atualizar registro** em `user_purchases`
2. **Verificar logs** da aplicação na Vercel
3. **Deve aparecer**: `🔔 [Webhook] Evento recebido`

---

## 🎯 Ação Imediata Necessária

### 1. Preencher `expires_at` nos registros existentes

Execute no SQL Editor do Supabase:

```sql
-- Ver registros sem expires_at
SELECT id, user_id, purchased_at, expires_at, app_id
FROM user_purchases
WHERE expires_at IS NULL;

-- Atualizar para 1 mês a partir de purchased_at
UPDATE user_purchases
SET expires_at = purchased_at + INTERVAL '1 month'
WHERE expires_at IS NULL
  AND purchased_at IS NOT NULL;

-- Verificar resultado
SELECT id, user_id, purchased_at, expires_at, app_id
FROM user_purchases
WHERE expires_at IS NOT NULL;
```

### 2. Configurar webhooks (opcional, mas recomendado)

Seguir passo a passo acima.

### 3. Testar novamente

Após preencher `expires_at`, a verificação deve funcionar!

---

## 📊 Checklist de Diagnóstico

- [ ] `expires_at` está NULL nos registros? → **PROBLEMA!**
- [ ] Webhooks configurados? → Opcional, mas recomendado
- [ ] `SUPABASE_WEBHOOK_SECRET` configurado? → Se usar webhooks
- [ ] Endpoint `/api/webhooks/subscription` existe? → ✅ Já existe!
- [ ] Endpoint `/api/verify-subscription` funciona? → ✅ Já existe!

---

## ✅ Solução Completa

1. **Imediato**: Preencher `expires_at` nos registros existentes (SQL)
2. **Opcional**: Configurar webhooks para atualização em tempo real
3. **Futuro**: Garantir que código preencha `expires_at` ao criar compras

---

**Problema principal: `expires_at` NULL! Resolva isso primeiro!**
