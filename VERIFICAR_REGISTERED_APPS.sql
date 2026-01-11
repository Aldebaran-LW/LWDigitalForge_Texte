-- ========================================
-- VERIFICAR SE app_id EXISTE EM registered_apps
-- ========================================
-- 
-- Problema: Trial ativo não aparece em "Testes"
-- Causa provável: JOIN com registered_apps falha
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- Verificar se o app_id existe em registered_apps
SELECT 
    id,
    name,
    description,
    image_url,
    vercel_deployment_url,
    github_repo_url,
    price_monthly,
    price_annual,
    price_lifetime,
    created_at
FROM registered_apps
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- Se não retornar nada, o JOIN falha e o trial não aparece!

-- Verificar todos os apps registrados
SELECT 
    id,
    name,
    created_at
FROM registered_apps
ORDER BY created_at DESC;
