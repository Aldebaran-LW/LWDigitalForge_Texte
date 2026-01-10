-- ========================================
-- Testar a função get_user_emails
-- ========================================

-- 1. Pegar IDs de alguns usuários para testar
SELECT 
    p.id,
    p.full_name,
    p.role
FROM profiles p
LIMIT 5;

-- 2. Testar a função com os IDs acima
-- (Substitua os UUIDs pelos IDs reais da query acima)
SELECT * FROM public.get_user_emails(
    ARRAY[
        '00000000-0000-0000-0000-000000000001'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid
    ]
);

-- ========================================
-- OU teste com todos os usuários:
-- ========================================
SELECT * FROM public.get_user_emails(
    (SELECT ARRAY_AGG(id) FROM profiles)
);

-- ========================================
-- Resultado esperado:
-- user_id | email
-- --------+------------------
-- uuid1   | email1@exemplo.com
-- uuid2   | email2@exemplo.com
-- ========================================



