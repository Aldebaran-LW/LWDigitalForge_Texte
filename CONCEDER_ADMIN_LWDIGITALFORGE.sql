-- ========================================
-- Conceder Permissão de ADMIN para lwdigitalforge@gmail.com
-- ========================================

-- 0. Verificar estrutura da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 1. Verificar se o usuário existe em auth.users
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'lwdigitalforge@gmail.com';

-- 2. Verificar se o perfil existe (usando JOIN com auth.users se email não existir em profiles)
-- Primeiro, tentar buscar pelo email direto
SELECT 
    p.id,
    COALESCE(p.email, au.email) as email,
    p.full_name,
    p.role,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE COALESCE(p.email, au.email) = 'lwdigitalforge@gmail.com';

-- 3. Atualizar role para ADMIN
-- Usar o ID do auth.users se o perfil existir
UPDATE profiles 
SET role = 'ADMIN'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'lwdigitalforge@gmail.com'
);

-- Se não existir perfil, criar um
INSERT INTO profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email),
    'ADMIN'
FROM auth.users
WHERE email = 'lwdigitalforge@gmail.com'
  AND id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN';

-- 4. Verificar se foi atualizado corretamente
SELECT 
    p.id,
    COALESCE(p.email, au.email) as email,
    p.full_name,
    p.role,
    CASE 
        WHEN p.role = 'ADMIN' THEN '✅ Usuário agora é ADMIN'
        ELSE '❌ Erro: Role não foi atualizado'
    END as status
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE COALESCE(p.email, au.email) = 'lwdigitalforge@gmail.com';

-- ========================================
-- IMPORTANTE: Após executar este script
-- ========================================
-- 1. Fazer LOGOUT da área admin (se estiver logado)
-- 2. Fazer LOGIN novamente
-- 3. Acessar /admin/usuarios
-- 4. Os usuários devem aparecer agora
-- ========================================

