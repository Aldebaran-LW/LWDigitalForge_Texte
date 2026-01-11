-- ========================================
-- VERIFICAR purchase_type EM user_purchases
-- ========================================
-- 
-- Problema 3: Usuário não consegue acessar
-- Status está APPROVED (correto!)
-- Precisamos verificar purchase_type
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- Verificar purchase_type do registro
SELECT 
    id,
    user_id,
    app_id,
    status,
    purchase_type,
    purchased_at,
    expires_at,
    CASE 
        WHEN purchase_type IN ('MONTHLY', 'ANNUAL', 'LIFETIME') THEN '✅ CORRETO (encontrado em subscriptions)'
        ELSE '⚠️ DIFERENTE (verifica em hasPurchase)'
    END as onde_encontra,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as expires_check
FROM user_purchases 
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY purchased_at DESC;

-- Verificar todos os purchase_type únicos na tabela
SELECT DISTINCT purchase_type, COUNT(*) as total
FROM user_purchases
GROUP BY purchase_type
ORDER BY total DESC;
