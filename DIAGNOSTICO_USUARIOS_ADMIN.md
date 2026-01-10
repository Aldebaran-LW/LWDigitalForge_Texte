# 🔍 Diagnóstico: Usuários Não Aparecem na Área Admin

## Possíveis Causas

1. **Migration não aplicada** - RLS bloqueando acesso
2. **Usuário não tem role ADMIN** - Sem permissão
3. **Erro na query** - Problema com RLS ou função is_admin()
4. **Nenhum usuário no banco** - Tabela profiles vazia

---

## 🔧 Scripts de Diagnóstico

### 1. Verificar se Migration Foi Aplicada

Execute no Supabase SQL Editor:

```sql
-- Verificar se a política existe
SELECT 
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
  AND policyname = 'Admins podem ver todos os perfis';
```

**Resultado Esperado:** Deve retornar 1 linha

**Se não retornar nada:** A migration não foi aplicada. Aplique `20250110000000_fix_admin_email_access.sql`

---

### 2. Verificar Função is_admin()

```sql
-- Verificar se função existe
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname = 'is_admin';
```

**Resultado Esperado:** Deve retornar 1 linha com a função

**Se não retornar nada:** A migration não foi aplicada completamente

---

### 3. Verificar Role do Usuário Atual

```sql
-- Verificar seu role (substitua pelo seu email)
SELECT id, email, role 
FROM profiles 
WHERE email = 'seu-email@exemplo.com';
```

**Resultado Esperado:** `role` deve ser `'ADMIN'`

**Se não for ADMIN:**
```sql
-- Atualizar role (substitua pelo seu user_id)
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = 'seu-user-id-aqui';
```

---

### 4. Verificar se Existem Usuários no Banco

```sql
-- Contar total de usuários
SELECT COUNT(*) as total_usuarios FROM profiles;

-- Listar todos os usuários (se você for admin)
SELECT id, email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

**Se retornar 0:** Não há usuários cadastrados

---

### 5. Testar Função is_admin() Manualmente

```sql
-- Testar se a função retorna true para admin
SELECT 
    auth.uid() as current_user_id,
    public.is_admin() as is_admin_result,
    (SELECT role FROM profiles WHERE id = auth.uid()) as current_role;
```

**Resultado Esperado:** 
- `is_admin_result` deve ser `true` se você for admin
- `current_role` deve ser `'ADMIN'`

---

### 6. Verificar Políticas RLS Ativas

```sql
-- Ver todas as políticas de profiles
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
```

**Resultado Esperado:** Deve ter pelo menos 2 políticas:
1. "Usuários podem ver seus próprios perfis"
2. "Admins podem ver todos os perfis"

---

## 🐛 Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Acesse `/admin/usuarios`
4. Procure por erros:
   - `PGRST301` - Erro de permissão RLS
   - `permission denied` - Sem permissão
   - `policy` - Erro de política
   - `is_admin()` - Erro na função

---

## 🔧 Soluções

### Solução 1: Aplicar Migration

Se a migration não foi aplicada:

1. Abra `supabase/migrations/20250110000000_fix_admin_email_access.sql`
2. Copie TODO o conteúdo
3. Cole no Supabase SQL Editor
4. Execute (Run)

### Solução 2: Atualizar Role para ADMIN

Se seu usuário não tem role ADMIN:

```sql
-- Verificar seu user_id primeiro
SELECT id, email, role FROM profiles WHERE email = 'seu-email@exemplo.com';

-- Atualizar role
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = 'seu-user-id-aqui';
```

### Solução 3: Verificar RLS Está Habilitado

```sql
-- Verificar se RLS está habilitado na tabela
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';
```

**Se `rowsecurity` for `false`:** RLS está desabilitado (isso pode ser o problema!)

---

## 📝 Checklist de Verificação

- [ ] Migration `20250110000000_fix_admin_email_access.sql` aplicada
- [ ] Política "Admins podem ver todos os perfis" existe
- [ ] Função `is_admin()` existe e funciona
- [ ] Usuário tem role `ADMIN`
- [ ] Existem usuários na tabela `profiles`
- [ ] RLS está habilitado na tabela `profiles`
- [ ] Console do navegador não mostra erros
- [ ] Fazer logout e login novamente após aplicar migration

---

## 🚨 Se Nada Funcionar

Execute este SQL para diagnosticar tudo de uma vez:

```sql
-- Diagnóstico completo
SELECT 
    'Políticas RLS' as check_type,
    COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'profiles'
UNION ALL
SELECT 
    'Função is_admin' as check_type,
    COUNT(*) as count
FROM pg_proc 
WHERE proname = 'is_admin'
UNION ALL
SELECT 
    'Total de usuários' as check_type,
    COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
    'Usuários ADMIN' as check_type,
    COUNT(*) as count
FROM profiles
WHERE role = 'ADMIN';
```

---

**Última atualização:** 2025-01-10



