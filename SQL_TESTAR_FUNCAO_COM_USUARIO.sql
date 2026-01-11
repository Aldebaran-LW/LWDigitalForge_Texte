-- ========================================
-- TESTE DA FUNÇÃO RPC get_user_apps_status
-- ========================================

-- PASSO 1: Listar usuários disponíveis
SELECT id, email, role 
FROM profiles 
LIMIT 5;

-- PASSO 2: Testar a função com um usuário real
-- Use um dos IDs do PASSO 1 (substitua pelo ID real)

-- Exemplo com o ADMIN:
SELECT * FROM get_user_apps_status('52c476c6-4edd-4f61-8f5e-599e067d6bc1'::UUID);

-- Ou com outro usuário (substitua pelo ID desejado):
-- SELECT * FROM get_user_apps_status('5ac6a296-98bd-45a5-90d9-434c598a415b'::UUID);
