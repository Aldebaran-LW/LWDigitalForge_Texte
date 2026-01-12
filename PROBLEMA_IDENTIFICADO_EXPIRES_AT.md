# 🐛 Problema Identificado: expires_at em Compras LIFETIME

## ❌ Problema Encontrado

As compras LIFETIME têm `expires_at` preenchido com uma data, quando deveria ser `NULL`.

**Compras encontradas:**
- ID 5: `expires_at = 2026-02-06` ❌
- ID 4: `expires_at = 2026-02-04` ❌

**O que deveria ser:**
- `expires_at = NULL` ✅ (LIFETIME nunca expira)

---

## 🔍 Por que isso causa problema?

A Edge Function `check-subscription` pode estar verificando `expires_at` mesmo para LIFETIME, ou a lógica pode estar confusa.

**Regra correta:**
- **LIFETIME:** `expires_at` deve ser `NULL` (nunca expira)
- **MONTHLY/ANNUAL:** `expires_at` deve ter uma data futura

---

## ✅ Solução

### **PASSO 1: Executar SQL de Correção**

Execute o arquivo `SQL_CORRIGIR_EXPIRES_AT_LIFETIME.sql` no Supabase SQL Editor.

**Ou execute diretamente:**

```sql
-- Corrigir todas as compras LIFETIME
UPDATE user_purchases
SET expires_at = NULL
WHERE purchase_type = 'LIFETIME'
  AND status = 'APPROVED'
  AND expires_at IS NOT NULL;
```

---

### **PASSO 2: Verificar se foi corrigido**

Execute esta query para verificar:

```sql
SELECT 
  id,
  user_id,
  app_id,
  purchase_type,
  status,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN '✅ CORRETO'
    ELSE '❌ AINDA INCORRETO'
  END AS status
FROM user_purchases
WHERE purchase_type = 'LIFETIME'
  AND status = 'APPROVED'
  AND user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0';
```

**Resultado esperado:** Todas devem mostrar `✅ CORRETO` com `expires_at = NULL`

---

### **PASSO 3: Testar novamente**

Após corrigir, teste novamente a liberação no JornadaPro.

---

## 🔧 Prevenir no Futuro

### **Corrigir o código do AdminUsuarios.jsx**

O código já está correto (linha 486: `expires_at: null`), mas vamos garantir que está sendo aplicado.

**Verificar se o código está assim:**

```javascript
const purchaseData = {
  user_id: selectedUser.id,
  app_id: selectedProduct,
  purchase_type: 'LIFETIME',
  status: 'APPROVED',
  payment_method: 'ADMIN_GRANT',
  amount_paid: 0,
  purchased_at: new Date().toISOString(),
  expires_at: null // ✅ CORRETO - deve ser NULL
};
```

---

## 📝 Nota sobre Compras Antigas

As compras antigas (ID 4 e 5) foram criadas antes da correção do código, por isso têm `expires_at` preenchido.

**Solução:** Execute o SQL de correção para atualizar todas as compras LIFETIME existentes.

---

## ✅ Checklist

- [ ] Executar SQL de correção
- [ ] Verificar se `expires_at` está NULL nas compras LIFETIME
- [ ] Testar liberação no JornadaPro novamente
- [ ] Verificar se funciona

---

## 🎯 Próximo Passo

**Execute o SQL de correção e me diga se funcionou!**

O arquivo `SQL_CORRIGIR_EXPIRES_AT_LIFETIME.sql` tem todas as queries necessárias.
