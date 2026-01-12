-- ============================================
-- SOLUÇÃO URGENTE: LIBERAR ACESSO À APLICAÇÃO
-- ============================================

-- =============================================
-- OPÇÃO 1: TORNAR USUÁRIO EM ADMIN
-- =============================================
-- Use esta opção se você quer acessar /admin

-- Substitua 'SEU_EMAIL@GMAIL.COM' pelo seu email
UPDATE profiles
SET 
    role = 'ADMIN',
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE email = 'lucas005wfj@gmail.com'; -- ← MUDE AQUI PARA SEU EMAIL

-- Verificar se funcionou
SELECT email, role, is_liberado, data_vencimento 
FROM profiles 
WHERE email = 'lucas005wfj@gmail.com'; -- ← MUDE AQUI PARA SEU EMAIL


-- =============================================
-- OPÇÃO 2: LIBERAR USUÁRIO NORMAL (USER)
-- =============================================
-- Use esta opção se você quer acessar /portal

-- Substitua 'SEU_EMAIL@GMAIL.COM' pelo seu email
UPDATE profiles
SET 
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE email = 'lucas005wfj@gmail.com'; -- ← MUDE AQUI PARA SEU EMAIL

-- Verificar se funcionou
SELECT email, role, is_liberado, data_vencimento 
FROM profiles 
WHERE email = 'lucas005wfj@gmail.com'; -- ← MUDE AQUI PARA SEU EMAIL


-- =============================================
-- OPÇÃO 3: LIBERAR TODOS OS USUÁRIOS
-- =============================================
-- Use esta opção se quiser liberar TODOS os usuários

UPDATE profiles
SET 
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE is_liberado = false OR data_vencimento IS NULL;

-- Verificar quantos foram atualizados
SELECT 
    role,
    is_liberado,
    count(*) as total
FROM profiles
GROUP BY role, is_liberado;


-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
-- Execute para ver o status de todos os usuários

SELECT 
    email,
    role,
    is_liberado,
    data_vencimento,
    CASE 
        WHEN role = 'ADMIN' THEN '✅ Pode acessar /admin'
        WHEN role = 'USER' AND is_liberado = true THEN '✅ Pode acessar /portal'
        WHEN role = 'USER' AND is_liberado = false THEN '❌ Bloqueado'
        ELSE '❓ Status desconhecido'
    END as status_acesso
FROM profiles
ORDER BY created_at DESC;


-- =============================================
-- RESET COMPLETO (SE NADA FUNCIONAR)
-- =============================================
-- ATENÇÃO: Use apenas em ÚLTIMO CASO!

-- Tornar o primeiro usuário cadastrado em ADMIN com acesso total
UPDATE profiles
SET 
    role = 'ADMIN',
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE id = (
    SELECT id FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- Ver qual usuário se tornou ADMIN
SELECT 
    email,
    role,
    is_liberado,
    '✅ AGORA É ADMIN' as status
FROM profiles
WHERE role = 'ADMIN';
