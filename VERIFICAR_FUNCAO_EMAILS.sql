-- ========================================
-- Verificar se a função get_user_emails foi criada
-- ========================================

-- 1. Verificar se a função existe
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname = 'get_user_emails';

-- 2. Testar a função (substitua pelos IDs reais dos usuários)
-- Primeiro, vamos pegar alguns IDs de usuários
SELECT id FROM profiles LIMIT 5;

-- 3. Testar a função com IDs reais (substitua pelos IDs acima)
-- SELECT * FROM public.get_user_emails(ARRAY['uuid1'::uuid, 'uuid2'::uuid]);

-- ========================================
-- Se a função existir, você verá:
-- - function_name: get_user_emails
-- - arguments: user_ids uuid[]
-- ========================================



