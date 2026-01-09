-- ========================================
-- Conceder Permissão de ADMIN para lwdigitalforge@gmail.com
-- Versão Simples: Usa apenas auth.users (não depende de coluna email em profiles)
-- ========================================

-- 1. Buscar ID do usuário em auth.users
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'lwdigitalforge@gmail.com';

-- 2. Atualizar ou criar perfil usando o ID do auth.users
-- Primeiro, tentar atualizar se já existir
UPDATE profiles 
SET role = 'ADMIN'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'lwdigitalforge@gmail.com'
);

-- Depois, criar perfil se não existir (sem coluna email se não existir)
INSERT INTO profiles (id, full_name, role)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'ADMIN'
FROM auth.users
WHERE email = 'lwdigitalforge@gmail.com'
  AND id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN';

-- 3. Verificar resultado (usando JOIN com auth.users para pegar email)
SELECT 
    p.id,
    au.email,
    p.full_name,
    p.role,
    CASE 
        WHEN p.role = 'ADMIN' THEN '✅ Usuário agora é ADMIN'
        ELSE '❌ Erro: Role não foi atualizado'
    END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'lwdigitalforge@gmail.com';

-- ========================================
-- IMPORTANTE: Após executar este script
-- ========================================
-- 1. Fazer LOGOUT da área admin (se estiver logado)
-- 2. Fazer LOGIN novamente com lwdigitalforge@gmail.com
-- 3. Acessar /admin/usuarios
-- 4. Os usuários devem aparecer agora
-- ========================================



