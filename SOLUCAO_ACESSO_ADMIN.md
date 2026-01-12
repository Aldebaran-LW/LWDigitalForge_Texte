# ✅ Solução: Acesso ADMIN ao JornadaPro

## 📋 Credenciais

- **Email:** `lwdigitalforge@gmail.com`
- **Role:** `ADMIN`
- **Aplicação:** JornadaPro

---

## 🔍 PASSO 1: Verificar Acesso Atual

Execute no **Supabase SQL Editor**:

```sql
-- Verificar se o usuário tem acesso
SELECT 
  p.id,
  p.email,
  p.role,
  p.is_liberado,
  p.data_vencimento,
  up.id as purchase_id,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM profiles p
LEFT JOIN user_purchases up ON up.user_id = p.id
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.status = 'APPROVED'
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE p.email = 'lwdigitalforge@gmail.com';
```

**Resultado esperado:**
- Se mostrar `✅ VITALÍCIO` → Já tem acesso
- Se mostrar `❌ SEM_ACESSO` ou `NULL` → Precisa liberar

---

## 🔧 PASSO 2: Liberar Acesso (Se Necessário)

### **Opção A: Via Admin Portal (Mais Fácil)**

1. Acesse: `http://localhost:3000/admin/dashboard`
2. Faça login com:
   - Email: `lwdigitalforge@gmail.com`
   - Senha: `LW_Digital_Forge/123`
3. Vá para **"Gerenciar Usuários"**
4. Procure seu usuário (`lwdigitalforge@gmail.com`)
5. Clique em **"Gerenciar"**
6. Selecione **"JornadaPro"**
7. Escolha **"Vitalício"**
8. Clique em **"Salvar Alterações"**

---

### **Opção B: Via SQL (Direto no Supabase)**

#### **2.1. Pegar o ID do usuário**

Execute primeiro o PASSO 1 e anote o `id` retornado.

#### **2.2. Liberar acesso**

```sql
-- IMPORTANTE: Substitua [USER_ID] pelo ID retornado no PASSO 1
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
  '[USER_ID]',  -- SUBSTITUIR pelo ID do PASSO 1
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

## ✅ PASSO 3: Verificar Acesso Liberado

Execute novamente o PASSO 1.

**Resultado esperado:** Deve mostrar `✅ VITALÍCIO`

---

## 🧪 PASSO 4: Testar Aplicação

Após liberar o acesso:

1. Acesse: `https://jornadapro.lwdigitalforge.com` (ou localhost se rodando local)
2. Faça login com:
   - Email: `lwdigitalforge@gmail.com`
   - Senha: `LW_Digital_Forge/123`
3. Verifique se carrega sem bloqueio
4. Teste funcionalidades principais:
   - Ver empresas (tenants)
   - Ver funcionários (employees)
   - Ver apontamentos (time_entries)
   - Criar novos registros

---

## 📋 Checklist de Teste

Após liberar acesso:

- [ ] ✅ Acesso liberado no Supabase
- [ ] ✅ Login funciona
- [ ] ✅ Aplicação carrega sem bloqueio
- [ ] ✅ Ver empresas funciona
- [ ] ✅ Ver funcionários funciona
- [ ] ✅ Ver apontamentos funciona
- [ ] ✅ Criar novos registros funciona
- [ ] ✅ MongoDB conectado e funcionando

---

## 💡 Arquivo Criado

Criei o arquivo `SQL_VERIFICAR_LIBERAR_ADMIN.sql` com todas as queries necessárias.

---

## 🎯 Próximos Passos

1. ⏭️ **Verificar acesso atual** (PASSO 1)
2. ⏭️ **Liberar acesso** (PASSO 2 - se necessário)
3. ⏭️ **Testar aplicação** (PASSO 4)
4. ⏭️ **Preencher checklist** (após testar)
5. ⏭️ **Confirmar remoção** (após tudo OK)

---

## ⚡ Método Rápido (Admin Portal)

**Recomendado:** Use o Admin Portal para liberar acesso:

1. `http://localhost:3000/admin/dashboard`
2. Login com `lwdigitalforge@gmail.com`
3. Gerenciar Usuários → Seu usuário → Gerenciar → JornadaPro → Vitalício

**Mais rápido e fácil!** ✅
