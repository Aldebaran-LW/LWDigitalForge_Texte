-- ========================================
-- Verificar se Emails Foram Sincronizados
-- ========================================

-- 1. Verificar se coluna email existe
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'email';

-- 2. Verificar quantos perfis têm email
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(email) as usuarios_com_email,
    COUNT(*) - COUNT(email) as usuarios_sem_email
FROM profiles;

-- 3. Listar usuários com seus emails
SELECT 
    p.id,
    p.email as email_profile,
    au.email as email_auth,
    p.full_name,
    p.role,
    CASE 
        WHEN p.email IS NULL THEN '❌ Email não sincronizado'
        WHEN p.email = au.email THEN '✅ Email sincronizado'
        ELSE '⚠️ Email diferente'
    END as status
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 4. Verificar se trigger foi criado
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'sync_email_to_profiles';

-- ========================================
-- Se houver usuários sem email, sincronizar:
-- ========================================
-- UPDATE public.profiles p
-- SET email = au.email
-- FROM auth.users au
-- WHERE p.id = au.id
--   AND (p.email IS NULL OR p.email != au.email);
-- ========================================
