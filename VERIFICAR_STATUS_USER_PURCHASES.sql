-- ========================================
-- VERIFICAR STATUS EM user_purchases
-- ========================================
-- 
-- Problema 3: Usuário não consegue acessar
-- Causa provável: status = 'active' vs 'APPROVED'
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- Verificar status dos registros de compra
SELECT 
    id,
    user_id,
    app_id,
    status,
    purchase_type,
    purchased_at,
    expires_at,
    CASE 
        WHEN status = 'APPROVED' THEN '✅ APPROVED (CORRETO)'
        WHEN status = 'active' THEN '⚠️ active (PROBLEMA! Código busca APPROVED)'
        ELSE '❌ ' || status
    END as status_check,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as expires_check
FROM user_purchases
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY purchased_at DESC;

-- Verificar se há registros com status diferente de APPROVED
SELECT 
    status,
    COUNT(*) as total
FROM user_purchases
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
GROUP BY status;

-- Verificar todos os status únicos na tabela user_purchases
SELECT DISTINCT status, COUNT(*) as total
FROM user_purchases
GROUP BY status
ORDER BY total DESC;
