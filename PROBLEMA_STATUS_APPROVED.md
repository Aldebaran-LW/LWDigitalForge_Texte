# ⚠️ Problema Crítico: Status 'APPROVED' vs 'active'

## 🔍 Problema Identificado

A aplicação JornadaPro está verificando:

```javascript
.eq('status', 'APPROVED')
```

**MAS** os registros no banco podem estar com `status = 'active'`!

Isso explica por que o usuário não consegue acessar mesmo tendo registro em `user_purchases`!

---

## 🔍 Verificar Status Real no Banco

Execute no SQL Editor do Supabase:

```sql
-- Verificar status dos registros
SELECT 
    id,
    user_id,
    app_id,
    status,
    purchase_type,
    expires_at,
    CASE 
        WHEN status = 'APPROVED' THEN '✅ APPROVED'
        WHEN status = 'active' THEN '⚠️ active (DIFERENTE!)'
        ELSE '❌ ' || status
    END as status_check
FROM user_purchases
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY purchased_at DESC;
```

---

## ✅ Solução 1: Corrigir Código (Recomendado)

Modificar `app/api/verify-subscription/route.js` para aceitar ambos os status:

**Localização:** `C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2\app\api\verify-subscription\route.js`

**Linha ~103:** Substituir:

```javascript
.eq('status', 'APPROVED')
```

**Por:**

```javascript
.in('status', ['APPROVED', 'active'])
```

**Ou remover o filtro de status completamente:**

```javascript
// Remover .eq('status', 'APPROVED')
// Aceitar qualquer status, verificar apenas expires_at
```

---

## ✅ Solução 2: Corrigir Banco (Se necessário)

Se quiser padronizar, atualizar todos os registros:

```sql
-- Atualizar status de 'active' para 'APPROVED'
UPDATE user_purchases
SET status = 'APPROVED'
WHERE status = 'active'
  AND user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

---

## 🔍 Verificar Código da Aplicação

**Arquivo:** `C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2\app\api\verify-subscription\route.js`

**Linha ~98-104:**

```javascript
const { data: subscriptions, error: subError } = await supabase
  .from('user_purchases')
  .select('*')
  .eq('user_id', userId)
  .eq('app_id', appId)
  .eq('status', 'APPROVED')  // ⚠️ PROBLEMA AQUI!
  .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
```

**Corrigir para:**

```javascript
const { data: subscriptions, error: subError } = await supabase
  .from('user_purchases')
  .select('*')
  .eq('user_id', userId)
  .eq('app_id', appId)
  .in('status', ['APPROVED', 'active'])  // ✅ Aceita ambos
  .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
```

---

## 🔍 Verificar Também hasPurchase

**Linha ~130-136:**

```javascript
const { data: purchase, error: purchaseError } = await supabase
  .from('user_purchases')
  .select('*')
  .eq('user_id', userId)
  .eq('app_id', appId)
  .eq('status', 'APPROVED')  // ⚠️ MESMO PROBLEMA AQUI!
  .single()
```

**Corrigir para:**

```javascript
const { data: purchase, error: purchaseError } = await supabase
  .from('user_purchases')
  .select('*')
  .eq('user_id', userId)
  .eq('app_id', appId)
  .in('status', ['APPROVED', 'active'])  // ✅ Aceita ambos
  .single()
```

---

## ✅ Checklist

- [ ] Execute SQL para verificar status real
- [ ] Se status for 'active', aplicar Solução 1 (código)
- [ ] Se quiser padronizar, aplicar Solução 2 (banco)
- [ ] Testar API route após correção
- [ ] Verificar se usuário consegue acessar

---

**Este é provavelmente o problema principal!** ⚠️
