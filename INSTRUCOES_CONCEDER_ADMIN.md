# 🔐 Como Conceder Permissão de ADMIN

**Email:** lwdigitalforge@gmail.com

---

## 🚀 Passo a Passo

### 1. Acessar Supabase Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login
3. Selecione seu projeto

### 2. Abrir SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### 3. Executar Script

1. Abra o arquivo: `CONCEDER_ADMIN_LWDIGITALFORGE.sql`
2. **Copie TODO o conteúdo**
3. **Cole** no SQL Editor
4. Clique em **"Run"** (ou Ctrl+Enter)

### 4. Verificar Resultado

Você deve ver:
- ✅ Primeira query: Dados do usuário (se existir)
- ✅ Segunda query: `UPDATE 1` (1 linha atualizada)
- ✅ Terceira query: `role = 'ADMIN'` e status `✅ Usuário agora é ADMIN`

---

## ⚠️ Se o Usuário Não Existir

Se a primeira query não retornar nenhum resultado, o usuário ainda não foi criado. Nesse caso:

### Opção 1: Criar Usuário Manualmente

```sql
-- Primeiro, você precisa do user_id do auth.users
-- Verificar se existe em auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'lwdigitalforge@gmail.com';

-- Se existir, criar perfil
INSERT INTO profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email),
    'ADMIN'
FROM auth.users
WHERE email = 'lwdigitalforge@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN';
```

### Opção 2: Fazer Login Primeiro

1. Acesse o site: `http://localhost:3000/login`
2. Faça login com `lwdigitalforge@gmail.com`
3. Isso criará o perfil automaticamente
4. Depois execute o script de conceder ADMIN

---

## ✅ Após Conceder ADMIN

### 1. Fazer Logout

- Se estiver logado na área admin, faça logout

### 2. Fazer Login Novamente

- Acesse `/login`
- Faça login com `lwdigitalforge@gmail.com`

### 3. Verificar Acesso

- Acesse `/admin/usuarios`
- Os usuários devem aparecer agora
- Você deve ver todos os campos, incluindo emails

---

## 🔍 Verificar se Funcionou

Execute este SQL para confirmar:

```sql
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN role = 'ADMIN' THEN '✅ É ADMIN'
        ELSE '❌ NÃO é ADMIN'
    END as status
FROM profiles 
WHERE email = 'lwdigitalforge@gmail.com';
```

**Resultado Esperado:**
- `role` = `'ADMIN'`
- `status` = `'✅ É ADMIN'`

---

## 🐛 Se Ainda Não Funcionar

### Verificar se Migration Foi Aplicada

```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND policyname = 'Admins podem ver todos os perfis';
```

**Se não retornar nada:** Aplicar migration `20250110000000_fix_admin_email_access.sql`

### Verificar Função is_admin()

```sql
SELECT proname FROM pg_proc WHERE proname = 'is_admin';
```

**Se não retornar nada:** Aplicar migration `20250110000000_fix_admin_email_access.sql`

---

## 📝 Checklist

- [ ] Script SQL executado com sucesso
- [ ] Role atualizado para `ADMIN`
- [ ] Logout realizado
- [ ] Login realizado novamente
- [ ] Acesso a `/admin/usuarios` funcionando
- [ ] Usuários aparecem na lista
- [ ] Emails aparecem (se migration foi aplicada)

---

**Última atualização:** 2025-01-10



