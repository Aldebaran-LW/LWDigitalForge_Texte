# 📋 Instruções para Aplicar Migration - Email Admin

**Problema:** Email admin não visível na área administrativa  
**Solução:** Aplicar migration `20250110000000_fix_admin_email_access.sql`

---

## ✅ Migration Corrigida

A migration foi corrigida para resolver o erro de dependência. A ordem agora está correta:

1. ✅ Remove políticas primeiro (que dependem da função)
2. ✅ Remove a função
3. ✅ Recria a função
4. ✅ Recria as políticas

---

## 🚀 Como Aplicar

### Passo 1: Acessar Supabase Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto correto

### Passo 2: Abrir SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"** (ou use o editor existente)

### Passo 3: Copiar Migration

1. Abra o arquivo: `supabase/migrations/20250110000000_fix_admin_email_access.sql`
2. **Selecione TODO o conteúdo** (Ctrl+A)
3. **Copie** (Ctrl+C)

### Passo 4: Colar e Executar

1. **Cole** o conteúdo no SQL Editor do Supabase (Ctrl+V)
2. Clique no botão **"Run"** (ou pressione **Ctrl+Enter**)

### Passo 5: Verificar Sucesso

Você deve ver uma mensagem de sucesso:
```
Success. No rows returned
```

**Se aparecer erro:**
- Verifique se copiou TODO o conteúdo
- Verifique se não há caracteres estranhos
- Tente executar novamente

---

## 🔍 Verificar se Funcionou

### 1. Verificar Políticas RLS

Execute este SQL no Supabase Dashboard:

```sql
SELECT 
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
  AND policyname = 'Admins podem ver todos os perfis';
```

**Resultado Esperado:**
- Deve retornar 1 linha
- `policyname` = "Admins podem ver todos os perfis"
- `cmd` = "SELECT"

### 2. Verificar Função is_admin()

Execute este SQL:

```sql
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname = 'is_admin';
```

**Resultado Esperado:**
- Deve retornar 1 linha com a função

### 3. Testar no Frontend

1. **Fazer logout** da área admin (se estiver logado)
2. **Fazer login novamente** (para atualizar a sessão)
3. Acessar `/admin/usuarios`
4. **Verificar se emails aparecem** na lista

---

## ⚠️ Se Ainda Não Funcionar

### Verificar Role do Usuário

Execute este SQL (substitua pelo seu email):

```sql
SELECT id, email, role 
FROM profiles 
WHERE email = 'seu-email@exemplo.com';
```

**Se `role` não for `ADMIN`:**

```sql
-- Atualizar role (substitua o ID pelo seu user_id)
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = 'seu-user-id-aqui';
```

### Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por erros como:
   - `PGRST301` - Erro de permissão RLS
   - `permission denied` - Sem permissão
   - `policy` - Erro de política

### Verificar Logs do Supabase

1. No Supabase Dashboard, vá em **"Logs"**
2. Procure por erros relacionados a `profiles` ou `is_admin()`

---

## 📝 Conteúdo da Migration

A migration faz o seguinte:

1. **Remove políticas antigas** que podem estar causando conflito
2. **Remove função antiga** `is_admin()` se existir
3. **Cria nova função** `is_admin()` que:
   - Verifica se usuário está autenticado
   - Desabilita RLS temporariamente para verificar role
   - Retorna `true` se role for `ADMIN`
4. **Recria políticas RLS**:
   - Usuários podem ver seus próprios perfis
   - Admins podem ver TODOS os perfis (incluindo email)

---

## ✅ Checklist Final

- [ ] Migration executada com sucesso
- [ ] Política RLS criada corretamente
- [ ] Função `is_admin()` criada
- [ ] Usuário tem role `ADMIN`
- [ ] Logout e login realizados
- [ ] Emails aparecem em `/admin/usuarios`

---

## 🆘 Suporte

Se ainda tiver problemas:

1. Verifique se copiou TODO o conteúdo da migration
2. Verifique se não há erros de sintaxe SQL
3. Verifique logs do Supabase
4. Verifique console do navegador
5. Tente executar a migration novamente

---

**Última atualização:** 2025-01-10  
**Status:** Migration corrigida e pronta para uso



