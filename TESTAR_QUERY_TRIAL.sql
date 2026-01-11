-- ========================================
-- TESTAR QUERY EXATA DO TRIAL
-- ========================================
-- 
-- Problema 2: Trial ativo não aparece
-- registered_apps existe (confirmado!)
-- Testar query exata que o código usa
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- Testar query exata que o código usa (com JOIN)
SELECT 
    ut.id as trial_id,
    ut.user_id,
    ut.app_id,
    ut.started_at,
    ut.expires_at,
    ut.is_active,
    ut.created_at,
    ra.id as app_id_check,
    ra.name as app_name,
    CASE 
        WHEN ut.expires_at > NOW() THEN '✅ NÃO EXPIRADO'
        ELSE '⚠️ EXPIRADO'
    END as expires_check,
    CASE 
        WHEN ut.is_active = true THEN '✅ ATIVO'
        ELSE '❌ INATIVO'
    END as active_check
FROM user_trials ut
LEFT JOIN registered_apps ra ON ut.app_id = ra.id
WHERE ut.user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND ut.is_active = true
  AND ut.expires_at > NOW()
ORDER BY ut.started_at DESC;

-- Se retornar o trial: Query funciona no banco, problema no código/frontend
-- Se não retornar: Problema na query ou dados
