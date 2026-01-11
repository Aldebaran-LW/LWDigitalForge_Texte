# ✅ Checklist de Finalização

## Status dos Itens

### [ ] 1. Corrigiu as políticas RLS (INSERT)?

**Status:** ⚠️ **SQL criado, mas NÃO executado ainda**

**Arquivos criados:**
- ✅ `SQL_RLS_CONSOLIDADO_FINAL.sql` - SQL completo para RLS
- ✅ `SQL_RLS_USER_TRIALS_FINAL.sql` - SQL específico para user_trials

**Ação necessária:**
1. Abra o **Supabase Dashboard** → **SQL Editor**
2. Abra o arquivo `SQL_RLS_CONSOLIDADO_FINAL.sql` ou `SQL_RLS_USER_TRIALS_FINAL.sql`
3. Copie e cole o conteúdo
4. Clique em **Run**
5. Verifique se não há erros

**Verificação:**
```sql
-- Verificar se as políticas foram criadas
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename IN ('user_purchases', 'user_trials') 
AND cmd = 'INSERT';
```

---

### [ ] 2. Executou o SQL da função get_user_apps_status?

**Status:** ⚠️ **SQL criado, mas NÃO executado ainda**

**Arquivos criados:**
- ✅ `supabase/migrations/20250112000000_create_get_user_apps_status_function.sql` (para CLI)
- ✅ `SQL_FUNCAO_GET_USER_APPS_STATUS.sql` (para SQL Editor)

**Ação necessária:**
1. Abra o **Supabase Dashboard** → **SQL Editor**
2. Abra o arquivo `SQL_FUNCAO_GET_USER_APPS_STATUS.sql`
3. Copie e cole o conteúdo
4. Clique em **Run**
5. Verifique se não há erros

**Verificação:**
```sql
-- Verificar se a função foi criada
SELECT proname FROM pg_proc WHERE proname = 'get_user_apps_status';

-- Testar a função (substitua [USER_ID] pelo ID de um usuário)
SELECT * FROM get_user_apps_status('[USER_ID]'::UUID);
```

---

### [ ] 3. Atualizou o PortalDashboard.jsx?

**Status:** ✅ **Arquivo atualizado**

**Arquivo:**
- ✅ `src/pages/portal/PortalDashboard.jsx` - Atualizado para usar função RPC

**Mudanças realizadas:**
- ✅ Substituída lógica de múltiplas queries por chamada única à função RPC
- ✅ Integrado com componente `ProductCard`
- ✅ Mantidas funcionalidades existentes (stats, notificações, etc.)

**Nota:** O arquivo foi atualizado, mas ainda mantém compatibilidade com o código existente. Se a função RPC não estiver disponível, pode dar erro. Execute primeiro os SQLs dos itens 1 e 2.

---

## 📋 Ordem de Execução Recomendada

1. **Primeiro:** Execute o SQL de RLS (`SQL_RLS_CONSOLIDADO_FINAL.sql`)
   - Necessário para que admins e usuários possam criar compras/trials

2. **Segundo:** Execute o SQL da função RPC (`SQL_FUNCAO_GET_USER_APPS_STATUS.sql`)
   - Necessário para o PortalDashboard funcionar

3. **Terceiro:** Teste o PortalDashboard
   - Verifique se os apps aparecem corretamente
   - Verifique se o status de acesso está correto

---

## 🧪 Testes Recomendados

### Teste 1: RLS Policies
```sql
-- Como admin, tente inserir uma compra manual
-- Deve funcionar sem erro de permissão

-- Como usuário, tente criar um trial
-- Deve funcionar sem erro de permissão
```

### Teste 2: Função RPC
```sql
-- Testar com um usuário que tem acesso
SELECT * FROM get_user_apps_status('[USER_ID]'::UUID);

-- Deve retornar apps com has_access, access_type, etc.
```

### Teste 3: PortalDashboard
1. Faça login no portal
2. Acesse `/portal` (Dashboard)
3. Verifique se os apps aparecem
4. Verifique se o status de acesso está correto
5. Teste o botão "Testar Grátis" se aplicável

---

## ✅ Checklist Final

- [ ] SQL RLS executado no Supabase
- [ ] SQL da função RPC executado no Supabase
- [ ] Função RPC testada (SELECT query)
- [ ] PortalDashboard testado
- [ ] Botão "Testar Grátis" testado
- [ ] Verificar logs se houver erros

---

## 🐛 Troubleshooting

### Problema: "permission denied" ao criar trial/compra
**Solução:** Execute o SQL de RLS (`SQL_RLS_CONSOLIDADO_FINAL.sql`)

### Problema: "function get_user_apps_status does not exist"
**Solução:** Execute o SQL da função (`SQL_FUNCAO_GET_USER_APPS_STATUS.sql`)

### Problema: PortalDashboard mostra erro
**Solução:** 
1. Verifique se a função foi criada
2. Verifique os logs do console do navegador
3. Verifique se o usuário está autenticado
