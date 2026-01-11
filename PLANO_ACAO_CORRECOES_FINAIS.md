# 🎯 Plano de Ação - Correções Finais

## 📋 Análise Técnica Consolidada

### ✅ Status Atual dos Componentes

#### 1. **Portal Central (LWDigitalForge_Texte)**
- ✅ **AdminUsuarios.jsx**: Correto - usa `status: 'APPROVED'` e `purchased_at`
- ✅ **trialHelpers.js**: Correto - insere trials com todos os campos necessários
- ✅ **Edge Function**: Correta - verifica `status = 'APPROVED'` e aceita `appId` ou `productId`
- ⚠️ **RLS Policies**: Precisam ser verificadas/atualizadas

#### 2. **JornadaPro (Ponto_Diario-1)**
- ✅ **subscription-service.js**: Correto - detecta Product ID automaticamente
- ✅ **Edge Function URL**: Deve estar configurada na Vercel

---

## 🔧 Correções Necessárias

### **PASSO A: Corrigir Políticas RLS (Supabase SQL Editor)**

Execute o SQL em `SQL_RLS_FINAL_CORRIGIDO.sql` ou use o SQL abaixo:

```sql
-- ========================================
-- 🔒 CORREÇÃO RLS FINAL (Versão Otimizada)
-- ========================================

-- 1. Garantir que a função is_admin() existe (sem parâmetros)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'ADMIN'
  );
END;
$$;

-- 2. Política para Admins inserirem compras manuais
DROP POLICY IF EXISTS "Admins podem inserir compras manuais" ON public.user_purchases;
CREATE POLICY "Admins podem inserir compras manuais"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() = true
);

-- 3. Política para usuários criarem seu próprio trial
DROP POLICY IF EXISTS "Utilizadores podem criar o seu próprio trial" ON public.user_trials;
CREATE POLICY "Utilizadores podem criar o seu próprio trial"
ON public.user_trials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- 4. Política adicional: Admins podem gerenciar trials
DROP POLICY IF EXISTS "Admins podem gerenciar trials" ON public.user_trials;
CREATE POLICY "Admins podem gerenciar trials"
ON public.user_trials
FOR ALL
TO authenticated
USING (
  public.is_admin() = true
)
WITH CHECK (
  public.is_admin() = true
);

-- 5. Garantir que RLS está ativado
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;
```

### **PASSO B: Verificar Código do AdminUsuarios.jsx**

O código já está correto (linhas 478-487), mas confirme que está assim:

```javascript
const purchaseData = {
  user_id: selectedUser.id,
  app_id: selectedProduct, // ID exato do app
  purchase_type: 'LIFETIME',
  status: 'APPROVED', // OBRIGATÓRIO
  payment_method: 'ADMIN_GRANT',
  amount_paid: 0,
  purchased_at: new Date().toISOString(), // OBRIGATÓRIO
  expires_at: null // Nunca expira (LIFETIME)
};
```

### **PASSO C: Verificar subscription-service.js no JornadaPro**

O código já está correto e usa detecção automática de Product ID. Verifique apenas:

1. **Variável de Ambiente na Vercel:**
   - `NEXT_PUBLIC_EDGE_FUNCTION_URL`: URL da Edge Function do Supabase
   - Formato: `https://[PROJECT_REF].supabase.co/functions/v1/check-subscription`

2. **Product ID (Opcional):**
   - `NEXT_PUBLIC_PRODUCT_ID`: Pode ser omitido (detecção automática funciona)

### **PASSO D: Verificar Edge Function**

A Edge Function já está correta e aceita tanto `appId` quanto `productId`. Confirme apenas:

1. **Deploy da Edge Function:**
   ```bash
   npx supabase functions deploy check-subscription --project-ref [PROJECT_REF]
   ```

2. **Variáveis de Ambiente na Edge Function:**
   - `SUPABASE_URL`: URL do projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (não anon key!)

---

## 🧪 Testes de Validação

### **Teste 1: Liberação Manual (Admin)**

1. Acesse `/admin/usuarios`
2. Clique em "Gerenciar" em um usuário
3. Selecione um produto
4. Escolha "Vitalício"
5. Clique em "Salvar Alterações"
6. **Verificar no SQL Editor:**
   ```sql
   SELECT * FROM user_purchases 
   WHERE user_id = '[USER_ID]' 
   AND status = 'APPROVED' 
   AND purchase_type = 'LIFETIME';
   ```
7. **Resultado esperado:** Registro com `status = 'APPROVED'` e `expires_at = null`

### **Teste 2: Trial Gratuito (Usuário)**

1. Acesse `/portal/produtos`
2. Clique em "Testar Grátis" em um produto
3. **Verificar no SQL Editor:**
   ```sql
   SELECT * FROM user_trials 
   WHERE user_id = '[USER_ID]' 
   AND is_active = true 
   AND expires_at > NOW();
   ```
4. **Resultado esperado:** Registro com `is_active = true` e `expires_at` 30 dias no futuro

### **Teste 3: Verificação de Acesso (JornadaPro)**

1. Faça login no JornadaPro
2. Verifique o console do navegador
3. **Resultado esperado:** 
   - `hasAccess: true` se tiver acesso
   - `hasAccess: false` se não tiver acesso
   - Logs mostrando o `appId` detectado

---

## 🔍 Diagnóstico de Problemas

### **Problema: "Permission Denied" ao conceder acesso manual**

**Causa:** Política RLS não permite INSERT para admins

**Solução:**
1. Execute o SQL do PASSO A
2. Verifique se a função `is_admin()` existe e retorna `true` para seu usuário:
   ```sql
   SELECT public.is_admin();
   ```
3. Se retornar `false`, verifique seu role:
   ```sql
   SELECT id, email, role FROM profiles WHERE id = auth.uid();
   ```

### **Problema: Trial não é criado**

**Causa 1:** Constraint UNIQUE impede duplicação
- **Solução:** Verifique se já existe um trial para este usuário e produto

**Causa 2:** Política RLS não permite INSERT para usuários
- **Solução:** Execute o SQL do PASSO A (política #3)

**Causa 3:** Data de expiração no passado
- **Solução:** Verifique o código de `iniciarTrialGratis` - deve usar `new Date()` + 30 dias

### **Problema: Edge Function retorna "App não encontrado"**

**Causa:** `appId` enviado não corresponde ao ID em `registered_apps`

**Solução:**
1. Verifique o ID do app em `registered_apps`:
   ```sql
   SELECT id, name FROM registered_apps WHERE is_active = true;
   ```
2. Confirme que o `appId` enviado pelo JornadaPro corresponde exatamente
3. Verifique os logs da Edge Function no Supabase Dashboard

### **Problema: Acesso negado mesmo com registro correto**

**Causa 1:** Status não é 'APPROVED'
- **Solução:** Verifique que `status = 'APPROVED'` no registro

**Causa 2:** `expires_at` no passado (para não-LIFETIME)
- **Solução:** Verifique que `expires_at > NOW()` ou é `null` (LIFETIME)

**Causa 3:** `app_id` não corresponde
- **Solução:** Verifique que o `app_id` no registro corresponde ao `appId` enviado

---

## ✅ Checklist Final

- [ ] SQL RLS executado no Supabase SQL Editor
- [ ] Função `is_admin()` existe e funciona
- [ ] AdminUsuarios.jsx usa `status: 'APPROVED'` e `purchased_at`
- [ ] trialHelpers.js insere trials com `is_active: true` e `expires_at` correto
- [ ] Edge Function deployada e funcionando
- [ ] Variáveis de ambiente configuradas na Vercel (JornadaPro)
- [ ] Teste de liberação manual realizado com sucesso
- [ ] Teste de trial gratuito realizado com sucesso
- [ ] Teste de acesso no JornadaPro realizado com sucesso

---

## 📝 Notas Importantes

1. **Status 'APPROVED' é OBRIGATÓRIO**: A Edge Function só lê registros com `status = 'APPROVED'`
2. **LIFETIME nunca expira**: Para `purchase_type = 'LIFETIME'`, `expires_at` deve ser `null`
3. **UUIDs devem corresponder**: O `app_id` em `user_purchases`/`user_trials` deve corresponder exatamente ao ID em `registered_apps`
4. **RLS é crítico**: Sem as políticas RLS corretas, nem admins nem usuários conseguem inserir dados
5. **Edge Function usa Service Role Key**: Não use a anon key, use a service role key para bypass de RLS

---

## 🚀 Próximos Passos

1. Execute o SQL do PASSO A no Supabase SQL Editor
2. Teste a liberação manual (PASSO B)
3. Teste o trial gratuito (PASSO C)
4. Verifique os logs da Edge Function se houver problemas
5. Documente qualquer problema encontrado para ajustes finais
