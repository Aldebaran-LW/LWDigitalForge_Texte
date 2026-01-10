-- ========================================
-- Conceder Permissão de ADMIN para lwdigitalforge@gmail.com
-- Versão 2: Funciona mesmo se coluna email não existir em profiles
-- ========================================

-- 1. Verificar se usuário existe em auth.users e obter o ID
DO $$
DECLARE
    user_id_var UUID;
    email_var TEXT := 'lwdigitalforge@gmail.com';
BEGIN
    -- Buscar ID do usuário em auth.users
    SELECT id INTO user_id_var
    FROM auth.users
    WHERE email = email_var;
    
    IF user_id_var IS NULL THEN
        RAISE NOTICE '❌ Usuário não encontrado em auth.users com email: %', email_var;
        RAISE NOTICE '   O usuário precisa fazer login primeiro para ser criado.';
    ELSE
        RAISE NOTICE '✅ Usuário encontrado: ID = %', user_id_var;
        
        -- Verificar se perfil existe
        IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id_var) THEN
            -- Atualizar role existente
            UPDATE profiles 
            SET role = 'ADMIN'
            WHERE id = user_id_var;
            
            RAISE NOTICE '✅ Perfil atualizado para ADMIN';
        ELSE
            -- Criar perfil se não existir
            INSERT INTO profiles (id, full_name, role)
            SELECT 
                id,
                COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
                'ADMIN'
            FROM auth.users
            WHERE id = user_id_var;
            
            RAISE NOTICE '✅ Perfil criado com role ADMIN';
        END IF;
    END IF;
END $$;

-- 2. Verificar resultado final
SELECT 
    p.id,
    au.email,
    p.full_name,
    p.role,
    CASE 
        WHEN p.role = 'ADMIN' THEN '✅ Usuário é ADMIN'
        ELSE '❌ Usuário NÃO é ADMIN'
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



