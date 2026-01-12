# 🔧 Solução: Admin Portal Não Funciona para Liberar Acesso

## ⚠️ Problema

Não consegue liberar acesso pelo Admin Portal.

---

## ✅ Solução: Liberar Diretamente via SQL

Como o Admin Portal não está funcionando, vamos liberar diretamente via SQL no Supabase.

---

## 🚀 Método Rápido: SQL Direto

### **PASSO 1: Executar SQL no Supabase**

1. Acesse **Supabase Dashboard → SQL Editor**
2. Abra o arquivo: `SQL_LIBERAR_ADMIN_LWDIGITALFORGE.sql`
3. Execute o **PASSO 2** (já tem o ID do usuário)

Ou execute diretamente este SQL:

```sql
-- Liberar acesso vitalício para lwdigitalforge@gmail.com
INSERT INTO user_purchases (
  user_id,
  app_id,
  purchase_type,
  status,
  payment_method,
  amount_paid,
  purchased_at,
  expires_at
) VALUES (
  '52c476c6-4edd-4f61-8f5e-599e067d6bc1',  -- ID do usuário lwdigitalforge@gmail.com
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);
```

---

### **PASSO 2: Verificar se Funcionou**

Execute no Supabase SQL Editor:

```sql
SELECT 
  up.id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '52c476c6-4edd-4f61-8f5e-599e067d6bc1'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

**Resultado esperado:** Deve mostrar `✅ VITALÍCIO`

---

## 📋 Informações do Usuário

- **Email:** `lwdigitalforge@gmail.com`
- **ID:** `52c476c6-4edd-4f61-8f5e-599e067d6bc1`
- **Role:** `ADMIN`
- **App ID:** `e8ff7872-dedb-405c-bf8a-f7901ac4b432` (JornadaPro)

---

## ✅ Após Liberar

1. ✅ **Acesso liberado** - Verificado via SQL
2. ⏭️ **Testar aplicação** - Acesse `https://jornadapro.lwdigitalforge.com`
3. ⏭️ **Login** - Use `lwdigitalforge@gmail.com` / `LW_Digital_Forge/123`
4. ⏭️ **Verificar** - Deve carregar sem bloqueio

---

## 🔍 Verificar Problema no Admin Portal (Opcional)

Se quiser investigar por que o Admin Portal não funciona:

1. Verificar se há erros no console (F12)
2. Verificar logs do Supabase
3. Verificar se o usuário tem role ADMIN:
   ```sql
   SELECT id, email, role FROM profiles WHERE email = 'lwdigitalforge@gmail.com';
   ```
4. Verificar RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_purchases';
   ```

---

## 💡 Arquivo Criado

Criei o arquivo `SQL_LIBERAR_ADMIN_LWDIGITALFORGE.sql` com o SQL pronto para executar.

**Execute o PASSO 2 no Supabase SQL Editor para liberar o acesso!**
