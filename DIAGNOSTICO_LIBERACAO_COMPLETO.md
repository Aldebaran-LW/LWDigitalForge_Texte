# 🔍 Diagnóstico Completo: Problema de Liberação

## 📋 Problema Reportado

A liberação manual (admin) ainda não está funcionando.

---

## 🔍 Checklist de Diagnóstico

Vamos verificar passo a passo onde pode estar o problema:

---

## 1️⃣ **Verificar se a Compra foi Criada**

### **SQL para Verificar:**

```sql
-- Substitua [USER_ID] pelo ID do usuário que você tentou liberar
SELECT 
  up.*,
  ra.name as app_name,
  ra.id as app_id
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '[USER_ID]'
ORDER BY up.purchased_at DESC;
```

### **O que verificar:**
- ✅ Existe um registro em `user_purchases`?
- ✅ `status = 'APPROVED'`?
- ✅ `purchase_type = 'LIFETIME'`?
- ✅ `app_id` está correto (deve ser o ID do JornadaPro: `e8ff7872-dedb-405c-bf8a-f7901ac4b432`)?
- ✅ `purchased_at` não é NULL?
- ✅ `expires_at` é NULL (para LIFETIME)?

---

## 2️⃣ **Verificar Políticas RLS**

### **SQL para Verificar:**

```sql
-- Verificar políticas RLS em user_purchases
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
ORDER BY policyname;
```

### **O que verificar:**
- ✅ Existe política para INSERT?
- ✅ A política permite INSERT para admins?
- ✅ A função `is_admin()` está funcionando?

### **Testar função is_admin():**

```sql
-- Verificar se o usuário atual é admin
SELECT public.is_admin();

-- Verificar role do usuário atual
SELECT id, email, role 
FROM profiles 
WHERE id = auth.uid();
```

---

## 3️⃣ **Verificar Edge Function check-subscription**

### **O que verificar:**

A Edge Function `check-subscription` deve estar verificando:

1. ✅ Se existe `user_purchases` com `status = 'APPROVED'`
2. ✅ Se `purchase_type = 'LIFETIME'` (não verifica expires_at)
3. ✅ Se `purchase_type IN ('MONTHLY', 'ANNUAL')` e `expires_at > NOW()`

### **SQL para Testar a Lógica:**

```sql
-- Testar se a Edge Function encontraria o acesso
-- Substitua [USER_ID] pelo ID do usuário
-- Substitua [APP_ID] pelo ID do JornadaPro (e8ff7872-dedb-405c-bf8a-f7901ac4b432)

SELECT 
  up.id,
  up.user_id,
  up.app_id,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN 'VITALÍCIO'
    WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
         AND up.status = 'APPROVED' 
         AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN 'ASSINATURA_ATIVA'
    ELSE 'SEM_ACESSO'
  END AS acesso_status
FROM user_purchases up
WHERE up.user_id = '[USER_ID]'
  AND up.app_id = '[APP_ID]'
  AND up.status = 'APPROVED'
ORDER BY up.purchased_at DESC;
```

---

## 4️⃣ **Verificar Código do AdminUsuarios.jsx**

### **O que verificar no código:**

1. ✅ O `app_id` está correto?
2. ✅ Todos os campos obrigatórios estão sendo enviados?
3. ✅ O `purchased_at` está sendo definido?
4. ✅ Há algum erro sendo retornado?
5. ✅ O toast/alert está mostrando sucesso?

### **Código Esperado:**

```javascript
const purchaseData = {
  user_id: selectedUser.id,
  app_id: selectedProduct, // ID do app (e8ff7872-dedb-405c-bf8a-f7901ac4b432)
  purchase_type: 'LIFETIME',
  status: 'APPROVED',
  payment_method: 'ADMIN_GRANT',
  amount_paid: 0,
  purchased_at: new Date().toISOString(), // OBRIGATÓRIO
  expires_at: null // LIFETIME não expira
};
```

---

## 5️⃣ **Verificar Logs do Supabase**

### **Onde verificar:**

1. **Supabase Dashboard → Edge Functions → check-subscription → Logs**
   - Ver se há erros
   - Ver se está recebendo os dados corretos
   - Ver se está retornando `hasAccess: true`

2. **Supabase Dashboard → Database → Logs**
   - Ver se há erros de RLS
   - Ver se há erros de INSERT

---

## 6️⃣ **Verificar se o Usuário está Logado Corretamente**

### **SQL para Verificar:**

```sql
-- Verificar usuário atual
SELECT 
  id,
  email,
  role,
  is_admin() as is_admin_function
FROM profiles
WHERE id = auth.uid();
```

---

## 7️⃣ **Testar a Edge Function Manualmente**

### **Via Supabase Dashboard:**

1. Acesse **Edge Functions → check-subscription → Invoke**
2. Use este JSON:

```json
{
  "userId": "[USER_ID]",
  "email": "[USER_EMAIL]",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "productId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}
```

3. Verifique a resposta:
   - Deve retornar `hasAccess: true`
   - Deve retornar `isSubscriber: true`
   - Deve retornar `isTrial: false`

---

## 8️⃣ **Verificar Console do Navegador**

### **O que verificar:**

1. Abra o **DevTools (F12) → Console**
2. Tente fazer a liberação manual
3. Verifique:
   - ✅ Há erros no console?
   - ✅ Há logs de sucesso?
   - ✅ A requisição foi enviada?
   - ✅ A resposta foi recebida?

---

## 🔧 Solução Passo a Passo

### **PASSO 1: Verificar se a Compra Existe**

Execute o SQL do passo 1 acima. Se NÃO existir:
- ❌ O INSERT não está funcionando
- ❌ Pode ser problema de RLS
- ❌ Pode ser problema no código frontend

### **PASSO 2: Se a Compra Existe, Verificar se a Edge Function Encontra**

Execute o SQL do passo 3 acima. Se retornar `SEM_ACESSO`:
- ❌ O problema está na lógica da Edge Function
- ❌ Os campos não estão corretos

### **PASSO 3: Verificar Logs**

Verifique os logs do Supabase (passo 5). Se houver erros:
- ❌ Corrija os erros encontrados

### **PASSO 4: Testar Edge Function Manualmente**

Teste a Edge Function manualmente (passo 7). Se não funcionar:
- ❌ O problema está na Edge Function
- ❌ Verifique o código da Edge Function

---

## 📝 Informações Necessárias para Debug

Para ajudar no diagnóstico, preciso saber:

1. **Há erro no console do navegador?**
   - Se sim, qual é a mensagem?

2. **A compra foi criada no banco?**
   - Execute o SQL do passo 1 e verifique

3. **Há erro nos logs do Supabase?**
   - Verifique Edge Functions → check-subscription → Logs

4. **O toast/alert mostra sucesso?**
   - Se sim, o INSERT funcionou, mas a Edge Function pode não estar encontrando

5. **Qual é o ID do usuário que você está tentando liberar?**
   - Execute o SQL do passo 1 com esse ID

---

## 🎯 Próximos Passos

1. Execute os SQLs de verificação acima
2. Verifique os logs do Supabase
3. Teste a Edge Function manualmente
4. Compartilhe os resultados para continuar o diagnóstico
