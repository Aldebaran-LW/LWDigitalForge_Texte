# 🧪 Guia: Testar Aplicação JornadaPro com MongoDB

## ⚠️ Problema Identificado

Não consegue acessar a aplicação JornadaPro para testar.

---

## ✅ Solução: Verificar e Liberar Acesso

### **PASSO 1: Verificar se você tem acesso liberado**

Execute no Supabase SQL Editor:

```sql
-- Substitua [SEU_EMAIL] pelo seu email
SELECT 
  p.id,
  p.email,
  p.is_liberado,
  p.data_vencimento,
  up.id as purchase_id,
  up.app_id,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
         AND up.status = 'APPROVED' 
         AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN '✅ ASSINATURA_ATIVA'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM profiles p
LEFT JOIN user_purchases up ON up.user_id = p.id
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.status = 'APPROVED'
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE p.email = '[SEU_EMAIL]';
```

---

### **PASSO 2: Se não tiver acesso, liberar manualmente**

#### **Opção A: Via Admin Portal (Recomendado)**

1. Acesse `http://localhost:3000/admin/dashboard` (ou seu domínio)
2. Vá para **Gerenciar Usuários**
3. Encontre seu usuário
4. Clique em **Gerenciar**
5. Selecione **JornadaPro**
6. Escolha **Vitalício**
7. Clique em **Salvar Alterações**

#### **Opção B: Via SQL (Direto no Supabase)**

```sql
-- IMPORTANTE: Substitua [SEU_USER_ID] pelo seu ID de usuário
-- Para encontrar seu ID:
-- SELECT id, email FROM profiles WHERE email = '[SEU_EMAIL]';

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
  '[SEU_USER_ID]',  -- SUBSTITUIR
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

### **PASSO 3: Verificar se o acesso foi liberado**

Execute novamente a query do PASSO 1. Deve mostrar `✅ VITALÍCIO`.

---

## 🧪 Métodos de Teste (Sem Acesso Direto)

Se ainda não conseguir acessar, use estes métodos alternativos:

---

### **MÉTODO 1: Testar via Logs da Aplicação**

#### **1.1. Verificar logs do Vercel (se estiver deployado)**

1. Acesse **Vercel Dashboard**
2. Vá para o projeto JornadaPro
3. Clique em **Logs**
4. Verifique se há erros relacionados ao MongoDB

#### **1.2. Verificar logs locais (se estiver rodando localmente)**

```bash
# Se estiver rodando localmente, verifique os logs do terminal
# Procure por:
# - Erros de conexão MongoDB
# - Erros de queries
# - Erros de autenticação
```

---

### **MÉTODO 2: Testar Conexão MongoDB Diretamente**

Já testamos via script e funcionou! ✅

```bash
npm run verify:mongodb:jornadapro
```

**Resultado:** ✅ Conectado e dados verificados

---

### **MÉTODO 3: Verificar API Routes (Se existirem)**

Se a aplicação tiver API routes, teste diretamente:

```bash
# Exemplo (ajuste conforme necessário):
curl -X GET "https://jornadapro.lwdigitalforge.com/api/health"
```

---

### **MÉTODO 4: Testar com Usuário de Teste**

#### **4.1. Criar usuário de teste liberado**

Via SQL no Supabase:

```sql
-- 1. Criar usuário de teste no Supabase Auth (via Dashboard)
-- 2. Depois, liberar acesso:

-- Substitua [USER_ID_DO_TESTE] pelo ID do usuário de teste
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
  '[USER_ID_DO_TESTE]',
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);
```

#### **4.2. Testar com esse usuário**

1. Faça login com o usuário de teste
2. Acesse JornadaPro
3. Verifique se funciona

---

### **MÉTODO 5: Verificar Edge Function (Check-Subscription)**

Teste se a Edge Function está funcionando:

1. Acesse **Supabase Dashboard → Edge Functions → check-subscription → Invoke**
2. Use este JSON:

```json
{
  "userId": "[SEU_USER_ID]",
  "email": "[SEU_EMAIL]",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}
```

3. Verifique a resposta:
   - Deve retornar `hasAccess: true` (se tiver acesso)
   - Deve retornar `hasAccess: false` (se não tiver acesso)

---

## 📋 Checklist de Teste (Adaptado)

### **Verificações que podem ser feitas SEM acesso direto:**

- [x] ✅ MongoDB conectado e funcionando
- [x] ✅ Collections encontradas (tenants, employees, time_entries)
- [x] ✅ Dados migrados (13 documentos)
- [ ] ⏭️ Edge Function testada (via Supabase Dashboard)
- [ ] ⏭️ Acesso liberado no Supabase (via SQL ou Admin Portal)
- [ ] ⏭️ Aplicação testada (após liberar acesso)

---

## 🔧 Passo a Passo Completo

### **1. Liberar Seu Acesso**

**Via Admin Portal:**
1. Acesse: `http://localhost:3000/admin/dashboard`
2. Login como ADMIN
3. Vá para "Gerenciar Usuários"
4. Encontre seu usuário
5. Clique em "Gerenciar"
6. Selecione "JornadaPro"
7. Escolha "Vitalício"
8. Salvar

**Via SQL (se não conseguir via Admin):**
```sql
-- Ver seu ID primeiro:
SELECT id, email FROM profiles WHERE email = '[SEU_EMAIL]';

-- Depois liberar (substitua [SEU_USER_ID]):
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
  '[SEU_USER_ID]',
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);
```

### **2. Verificar Acesso Liberado**

```sql
-- Substitua [SEU_USER_ID]
SELECT 
  up.*,
  ra.name as app_name,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '[SEU_USER_ID]'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

### **3. Testar Aplicação**

1. Acesse: `https://jornadapro.lwdigitalforge.com` (ou localhost se rodando local)
2. Faça login
3. Verifique se carrega
4. Teste funcionalidades principais:
   - Ver empresas (tenants)
   - Ver funcionários (employees)
   - Ver apontamentos (time_entries)
   - Criar novos registros

---

## 💡 Alternativa: Teste Parcial

Se ainda não conseguir acessar, você pode confirmar que:

1. ✅ **MongoDB está funcionando** - Já testado
2. ✅ **Dados estão migrados** - Já verificado
3. ✅ **Estrutura está correta** - Já confirmado
4. ⏭️ **Aplicação precisa ser testada** - Requer acesso liberado

**Recomendação:** Libere seu acesso primeiro, depois teste a aplicação.

---

## 🎯 Próximos Passos

1. **Liberar seu acesso** (via Admin Portal ou SQL)
2. **Verificar acesso liberado** (via SQL)
3. **Testar aplicação** (acessar e usar)
4. **Preencher checklist** (após testar)
5. **Confirmar remoção** (após tudo OK)

---

## 📝 SQL Rápido para Liberar Acesso

```sql
-- PASSO 1: Ver seu ID
SELECT id, email FROM profiles WHERE email = 'lwdigitalforge@gmail.com';
-- (substitua pelo seu email)

-- PASSO 2: Liberar acesso (substitua [SEU_USER_ID] pelo ID do PASSO 1)
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
  '[SEU_USER_ID]',
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);
```

Depois de liberar, você consegue acessar e testar!
