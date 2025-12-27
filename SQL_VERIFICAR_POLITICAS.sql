-- ========================================
-- SQL para VERIFICAR todas as políticas existentes
-- Execute este primeiro para ver o que está ativo
-- ========================================

-- Ver todas as políticas da tabela profiles
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
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Ver todas as políticas da tabela registered_apps
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
WHERE tablename = 'registered_apps'
ORDER BY policyname;

-- Ver todas as políticas da tabela user_purchases
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

-- Ver todas as funções relacionadas
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%admin%'
ORDER BY routine_name;


