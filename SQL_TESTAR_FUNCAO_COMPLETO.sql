-- ========================================
-- TESTE COMPLETO DA FUNÇÃO get_user_apps_status
-- ========================================
-- Execute estas queries uma por uma no SQL Editor
-- ========================================

-- 1. Verificar se há apps ativos
SELECT id, name, is_active 
FROM registered_apps 
WHERE is_active = true;

-- 2. Verificar se há usuários
SELECT id, email, role 
FROM profiles 
LIMIT 3;

-- 3. Verificar se a função existe
SELECT proname 
FROM pg_proc 
WHERE proname = 'get_user_apps_status';

-- 4. Testar a função com um usuário real
-- IMPORTANTE: Substitua [ID_DO_USUARIO] pelo ID real de um usuário da query 2
-- SELECT * FROM get_user_apps_status('[ID_DO_USUARIO]'::UUID);
