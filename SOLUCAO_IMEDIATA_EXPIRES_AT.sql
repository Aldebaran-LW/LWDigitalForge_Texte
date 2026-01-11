-- ========================================
-- SOLUÇÃO IMEDIATA: Preencher expires_at
-- ========================================
-- 
-- PROBLEMA: expires_at está NULL em user_purchases
-- SOLUÇÃO: Preencher expires_at baseado em purchased_at
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- 1. VERIFICAR REGISTROS SEM EXPIRES_AT
SELECT 
    id,
    user_id,
    purchased_at,
    expires_at,
    app_id,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as status
FROM user_purchases
WHERE expires_at IS NULL
ORDER BY purchased_at DESC;

-- 2. ATUALIZAR EXPIRES_AT (ESCOLHA UMA OPÇÃO)

-- OPÇÃO A: 1 mês a partir de purchased_at
UPDATE user_purchases
SET expires_at = purchased_at + INTERVAL '1 month'
WHERE expires_at IS NULL
  AND purchased_at IS NOT NULL;

-- OPÇÃO B: 1 ano a partir de purchased_at
-- UPDATE user_purchases
-- SET expires_at = purchased_at + INTERVAL '1 year'
-- WHERE expires_at IS NULL
--   AND purchased_at IS NOT NULL;

-- OPÇÃO C: Vitalícia (100 anos - muito longe no futuro)
-- UPDATE user_purchases
-- SET expires_at = purchased_at + INTERVAL '100 years'
-- WHERE expires_at IS NULL
--   AND purchased_at IS NOT NULL;

-- 3. VERIFICAR RESULTADO
SELECT 
    id,
    user_id,
    purchased_at,
    expires_at,
    app_id,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as status,
    expires_at - NOW() as tempo_restante
FROM user_purchases
ORDER BY purchased_at DESC
LIMIT 20;

-- 4. CONTAR REGISTROS ATIVOS
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN expires_at IS NULL THEN 1 END) as sem_expiracao,
    COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at > NOW() THEN 1 END) as ativos,
    COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN 1 END) as expirados
FROM user_purchases;

-- ========================================
-- NOTAS:
-- ========================================
-- 
-- - Execute a OPÇÃO A (1 mês) se não souber o período
-- - Ajuste para 1 ano ou vitalícia conforme necessário
-- - Após executar, a verificação de assinatura deve funcionar
-- 
-- ========================================
