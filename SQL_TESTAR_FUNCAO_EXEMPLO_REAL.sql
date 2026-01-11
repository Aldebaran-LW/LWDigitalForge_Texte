-- ========================================
-- TESTE DA FUNÇÃO RPC get_user_apps_status
-- ========================================
-- Use um dos IDs dos usuários encontrados
-- ========================================

-- Exemplo 1: Testar com o usuário ADMIN (lwdigitalforge@gmail.com)
SELECT * FROM get_user_apps_status('52c476c6-4edd-4f61-8f5e-599e067d6bc1'::UUID);

-- Exemplo 2: Testar com o usuário USER (lucas.psf.rinopolis@gmail.com)
-- SELECT * FROM get_user_apps_status('5ac6a296-98bd-45a5-90d9-434c598a415b'::UUID);

-- Exemplo 3: Testar com outro usuário (admin@lwdigitalforge.com)
-- SELECT * FROM get_user_apps_status('2ba83f99-3a2e-4962-9d0c-e284e8225c45'::UUID);
