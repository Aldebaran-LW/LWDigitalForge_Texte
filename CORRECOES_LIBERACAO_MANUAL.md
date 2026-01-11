# ✅ Correções Aplicadas: Liberação Manual e Trial

## 🎯 Problemas Corrigidos

### 1. ✅ Liberação Manual (Admin) - CORRIGIDO

**Arquivo:** `src/pages/admin/AdminUsuarios.jsx`

**Correção aplicada:**
- ✅ Adicionado `purchased_at` (campo OBRIGATÓRIO que estava faltando)
- ✅ Garantido que o registro segue o "contrato" exigido pela Edge Function:
  - `user_id`: ID do usuário
  - `app_id`: ID exato do app (e8ff7872-dedb-405c-bf8a-f7901ac4b432 para JornadaPro)
  - `purchase_type`: 'LIFETIME' (fundamental para ignorar expiração)
  - `status`: 'APPROVED' (a Edge Function só lê registros 'APPROVED')
  - `payment_method`: 'ADMIN_GRANT'
  - `amount_paid`: 0
  - `purchased_at`: Data ISO (OBRIGATÓRIO - foi adicionado)
  - `expires_at`: null (para LIFETIME)

**Código corrigido:**
```javascript
const purchaseData = {
  user_id: selectedUser.id,
  app_id: selectedProduct,
  purchase_type: 'LIFETIME',
  status: 'APPROVED',
  payment_method: 'ADMIN_GRANT',
  amount_paid: 0,
  purchased_at: new Date().toISOString(), // ✅ ADICIONADO
  expires_at: null
};
```

---

### 2. ✅ Trial Gratuito - CORRIGIDO

**Arquivo:** `src/utils/trialHelpers.js`

**Função adicionada:**
- ✅ Criada função `iniciarTrialGratis` conforme contrato exigido:
  ```javascript
  export const iniciarTrialGratis = async (userId, appId) => {
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 30); // 30 dias

    const { error } = await supabase
      .from('user_trials')
      .insert([{
        user_id: userId,
        app_id: appId,
        expires_at: dataExpiracao.toISOString(),
        is_active: true,
        started_at: new Date().toISOString()
      }]);

    return { error };
  };
  ```

**Função existente mantida:**
- ✅ `startProductTrial` já estava correta e foi mantida (versão completa com validações)

---

### 3. ✅ Edge Function - Logs Adicionados

**Arquivo:** `supabase/functions/check-subscription/index.ts`

**Logs adicionados:**
- ✅ `console.log("🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO:", ...)`
- ✅ `console.log("🔍 [Edge Function] targetAppId extraído:", ...)`

**Como verificar os logs:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. **Functions** → **check-subscription**
4. **Logs**
5. Procure por "🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO"
6. Verifique se `appId` ou `productId` estão chegando corretamente

---

### 4. ✅ SQL de Debug - CRIADO

**Arquivo:** `SQL_DEBUG_ACESSO_USUARIO.sql`

**Queries incluídas:**
1. ✅ Verificar compras aprovadas do usuário
2. ✅ Verificar trials ativos do usuário
3. ✅ Verificar se o app existe e está ativo
4. ✅ Verificar todas as compras (debug completo)
5. ✅ Verificar todos os trials (debug completo)
6. ✅ Verificar se o usuário existe no profiles

**Como usar:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. **SQL Editor** → **New Query**
4. Substitua `'ID-DO-USUARIO'` pelo ID real do usuário
5. Execute as queries
6. Verifique os resultados conforme o checklist

---

## 📋 Checklist de Verificação

### Se o Admin clicar no botão e nada acontecer:

- [ ] Verificar se o `app_id` no banco é exatamente `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- [ ] Verificar se `purchased_at` foi preenchido (agora é obrigatório)
- [ ] Verificar se `status = 'APPROVED'`
- [ ] Verificar se `purchase_type = 'LIFETIME'`
- [ ] Se a tabela `user_purchases` tiver RLS ativado, verificar se o usuário Admin tem política que permite INSERT

### Se o Trial não funcionar:

- [ ] Verificar se o registro foi criado em `user_trials`
- [ ] Verificar se `is_active = true`
- [ ] Verificar se `expires_at > NOW()`
- [ ] Verificar se `app_id` está correto

### Se os registros existirem e o app continuar bloqueado:

- [ ] Verificar logs da Edge Function no Supabase Dashboard
- [ ] Verificar se `appId` está chegando corretamente nos logs
- [ ] Verificar console do navegador (F12) no frontend
- [ ] Verificar se `appId` está sendo enviado corretamente do frontend

---

## 🧪 Teste Rápido

### 1. Testar Liberação Manual (Admin):

1. Acesse: Portal Admin → Gerenciar Usuários
2. Selecione um usuário
3. Clique em "Gerenciar Licença"
4. Selecione o produto (JornadaPro)
5. Selecione "Vitalício"
6. Clique em "Salvar Alterações"
7. Verifique se aparece a mensagem de sucesso
8. Execute a Query 1 do `SQL_DEBUG_ACESSO_USUARIO.sql` para verificar

### 2. Testar Trial:

1. Use a função `iniciarTrialGratis(userId, appId)` ou `startProductTrial(...)`
2. Execute a Query 2 do `SQL_DEBUG_ACESSO_USUARIO.sql` para verificar
3. Verifique se `is_active = true` e `expires_at > NOW()`

### 3. Verificar Logs da Edge Function:

1. Acesse: Supabase Dashboard → Functions → check-subscription → Logs
2. Faça uma tentativa de acesso no frontend
3. Procure por: `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO`
4. Verifique se `appId` ou `productId` estão presentes

---

## ✅ Próximos Passos

1. ✅ **Commit e push das mudanças**
2. ✅ **Deploy na Vercel** (se necessário)
3. ✅ **Testar liberação manual** conforme checklist acima
4. ✅ **Testar trial** conforme checklist acima
5. ✅ **Verificar logs** da Edge Function após testes

---

**Todas as correções foram aplicadas conforme o contrato exigido!** ✅
