# 🔒 Solução: Tela "Assinatura Necessária" no JornadaPro

## ⚠️ Problema Identificado

Você está vendo a tela **"Assinatura Necessária"** ao tentar acessar o JornadaPro. Isso significa que o acesso ainda não foi liberado no Supabase.

---

## ✅ Solução: Liberar Acesso via SQL

Execute o SQL no **Supabase SQL Editor** para liberar seu acesso:

---

## 🚀 PASSO 1: Liberar Acesso (Execute Agora)

Copie e execute este SQL no **Supabase SQL Editor**:

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
)
SELECT 
  p.id,  -- ID do usuário lwdigitalforge@gmail.com
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
FROM profiles p
WHERE p.email = 'lwdigitalforge@gmail.com'
  AND NOT EXISTS (
    -- Evita duplicar se já existir
    SELECT 1 FROM user_purchases up
    WHERE up.user_id = p.id
      AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
      AND up.status = 'APPROVED'
      AND up.purchase_type = 'LIFETIME'
  );
```

**Resultado esperado:** `Success. No rows returned` (normal para INSERT)

---

## 🔍 PASSO 2: Verificar se Foi Liberado

Execute este SQL para verificar:

```sql
-- Verificar se tem acesso
SELECT 
  up.id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com')
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

**Resultado esperado:** Deve mostrar `✅ VITALÍCIO`

---

## 🔄 PASSO 3: Recarregar Aplicação

Após executar o SQL:

1. **Recarregue a página** no navegador (F5 ou Ctrl+R)
2. **Ou feche e abra novamente** a aplicação
3. **Ou faça logout e login novamente**

A tela "Assinatura Necessária" deve desaparecer e você terá acesso completo.

---

## 📋 Checklist de Resolução

- [ ] ✅ Executei o SQL no Supabase SQL Editor (PASSO 1)
- [ ] ✅ Verifiquei que o acesso foi liberado (PASSO 2 - deve mostrar ✅ VITALÍCIO)
- [ ] ✅ Recarreguei a aplicação (PASSO 3)
- [ ] ✅ A tela "Assinatura Necessária" desapareceu
- [ ] ✅ Posso acessar o JornadaPro normalmente

---

## 🔧 Se Ainda Não Funcionar

### **1. Verificar se o SQL foi executado corretamente**

Execute o PASSO 2 novamente. Se não mostrar `✅ VITALÍCIO`, o INSERT pode não ter funcionado.

### **2. Verificar RLS Policies**

Se houver erro de "Permission Denied", pode ser problema de RLS:

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'user_purchases';
```

### **3. Verificar se o usuário existe**

```sql
-- Verificar se o usuário existe
SELECT id, email, role FROM profiles WHERE email = 'lwdigitalforge@gmail.com';
```

### **4. Limpar cache e fazer logout/login**

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Faça logout
3. Feche o navegador
4. Abra novamente
5. Faça login
6. Acesse o JornadaPro

---

## 💡 Arquivos Disponíveis

1. **`SQL_LIBERAR_ADMIN_DIRETO.sql`** - SQL para liberar acesso (já tem tudo)
2. **`SQL_VERIFICAR_ACESSO_ADMIN.sql`** - SQL para verificar acesso
3. **`SOLUCAO_ASSINATURA_NECESSARIA.md`** - Este guia

---

## 🎯 Próximos Passos Após Liberar Acesso

1. ✅ **Acesso liberado** - Execute o SQL (PASSO 1)
2. ✅ **Verificado** - Confirme que foi liberado (PASSO 2)
3. ✅ **Recarregado** - Recarregue a aplicação (PASSO 3)
4. ⏭️ **Testar funcionalidades** - Teste todas as funcionalidades
5. ⏭️ **Preencher checklist** - Após testar tudo
6. ⏭️ **Confirmar migração MongoDB** - Se tudo OK
7. ⏭️ **Remover tabelas antigas** - Após confirmação

---

## ⚡ Resumo Rápido

1. **Abra Supabase SQL Editor**
2. **Execute o SQL do PASSO 1** (copie do arquivo `SQL_LIBERAR_ADMIN_DIRETO.sql`)
3. **Execute o SQL do PASSO 2** para verificar
4. **Recarregue a aplicação** (F5)
5. **Acesso liberado!** ✅

---

Execute o SQL agora e depois recarregue a aplicação!
