# 🔍 Diagnóstico Completo - Problema de Acesso

## ❌ Problema Identificado

Você **NÃO CONSEGUE ENTRAR** na aplicação. Vamos diagnosticar passo a passo:

---

## 🧪 Checklist de Diagnóstico

### 1️⃣ Verificar se há usuário cadastrado

```sql
-- Executar no Supabase SQL Editor
SELECT id, email, role, is_liberado, data_vencimento, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ Se existe algum usuário cadastrado
- ✅ Se o email está correto
- ✅ Se o campo `role` é `ADMIN` ou `USER`
- ✅ Se `is_liberado` está `true`

---

### 2️⃣ Verificar autenticação no Supabase

```sql
-- Verificar usuários autenticados
SELECT * FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ Se o usuário existe na tabela `auth.users`
- ✅ Se o campo `email_confirmed_at` NÃO é `null`
- ✅ Se o usuário não está bloqueado

---

### 3️⃣ Verificar RLS (Row Level Security)

```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

**Problema comum:**
- ❌ RLS muito restritivo
- ❌ Políticas que impedem leitura do próprio perfil

---

### 4️⃣ Teste de login manual

**No navegador (DevTools > Console):**

```javascript
// Teste 1: Verificar sessão atual
const { data: session, error: sessionError } = await supabase.auth.getSession();
console.log('Sessão:', session);
console.log('Erro de sessão:', sessionError);

// Teste 2: Tentar login
const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'seu-email@exemplo.com',
  password: 'sua-senha'
});
console.log('Login data:', loginData);
console.log('Login error:', loginError);

// Teste 3: Verificar perfil
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'seu-email@exemplo.com')
  .single();
console.log('Perfil:', profile);
console.log('Erro perfil:', profileError);
```

---

## 🚨 Problemas Mais Comuns

### Problema 1: Email não confirmado
**Sintoma:** Não consegue fazer login
**Solução:**
```sql
-- Confirmar email manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'seu-email@exemplo.com';
```

---

### Problema 2: Perfil não criado
**Sintoma:** Login funciona mas redireciona para login novamente
**Solução:**
```sql
-- Criar perfil manualmente
INSERT INTO profiles (id, email, full_name, role, is_liberado)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com'),
  'seu-email@exemplo.com',
  'Seu Nome',
  'ADMIN', -- ou 'USER'
  true
);
```

---

### Problema 3: RLS bloqueando acesso
**Sintoma:** Usuário autenticado mas não consegue ver dados
**Solução:**
```sql
-- Desabilitar RLS temporariamente (APENAS PARA TESTE!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Depois de testar, reabilitar:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

### Problema 4: is_liberado = false
**Sintoma:** Usuário faz login mas é bloqueado
**Solução:**
```sql
-- Liberar usuário manualmente
UPDATE profiles 
SET is_liberado = true, 
    data_vencimento = '2099-01-01'::timestamp
WHERE email = 'seu-email@exemplo.com';
```

---

## 🔧 Script de Diagnóstico Automático

Execute este SQL para diagnóstico completo:

```sql
-- ============================================
-- SCRIPT DE DIAGNÓSTICO COMPLETO
-- ============================================

-- 1. Verificar usuários
SELECT 'Usuários cadastrados:' as tipo, 
       count(*) as total
FROM auth.users;

-- 2. Verificar perfis
SELECT 'Perfis criados:' as tipo,
       count(*) as total
FROM profiles;

-- 3. Verificar usuários sem perfil
SELECT 'Usuários SEM perfil:' as tipo,
       u.email,
       u.created_at,
       u.email_confirmed_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 4. Verificar perfis bloqueados
SELECT 'Perfis BLOQUEADOS:' as tipo,
       email,
       is_liberado,
       data_vencimento,
       role
FROM profiles
WHERE is_liberado = false 
   OR data_vencimento < NOW();

-- 5. Verificar RLS ativo
SELECT 'RLS Status:' as tipo,
       tablename,
       rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_purchases', 'user_trials');
```

---

## ✅ Solução Rápida (Emergência)

Se você precisa entrar AGORA, execute:

```sql
-- SOLUÇÃO EMERGENCIAL: Criar usuário ADMIN com acesso total

-- 1. Criar usuário (se não existir)
-- Vá em: Supabase Dashboard > Authentication > Users > Add User
-- Email: admin@lwdigitalforge.com
-- Password: SuaSenhaForte123!
-- Confirme o email automaticamente

-- 2. Buscar o ID do usuário
SELECT id, email FROM auth.users WHERE email = 'admin@lwdigitalforge.com';

-- 3. Criar perfil com acesso total (substitua o ID)
INSERT INTO profiles (id, email, full_name, role, is_liberado, data_vencimento)
VALUES (
  'ID_DO_USUARIO_AQUI', -- Copie o ID da query acima
  'admin@lwdigitalforge.com',
  'Administrador',
  'ADMIN',
  true,
  '2099-01-01'::timestamp
)
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN',
    is_liberado = true,
    data_vencimento = '2099-01-01'::timestamp;

-- 4. Verificar
SELECT * FROM profiles WHERE email = 'admin@lwdigitalforge.com';
```

---

## 📋 Próximos Passos

1. Execute o **Script de Diagnóstico Automático** acima
2. Copie e cole os resultados aqui
3. Vou identificar o problema específico
4. Aplicaremos a solução correta

**Me envie o resultado do diagnóstico para eu ajudar!** 🚀
