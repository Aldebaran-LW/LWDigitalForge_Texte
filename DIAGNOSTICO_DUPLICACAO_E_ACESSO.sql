-- ========================================
-- DIAGNÓSTICO: Duplicação e Problemas de Acesso
-- ========================================
-- 
-- Problemas:
-- 1. Aplicação aparece duplicada em "Meus Produtos"
-- 2. Nada aparece em "Testes"
-- 3. Usuário ainda não consegue acessar
-- 
-- Execute no SQL Editor do Supabase
-- ========================================

-- ========================================
-- 1. VERIFICAR DUPLICAÇÃO EM user_purchases
-- ========================================

-- Ver todos os registros de compras do usuário
SELECT 
    id,
    user_id,
    app_id,
    purchased_at,
    expires_at,
    status,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as status_descricao
FROM user_purchases
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
   OR user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
ORDER BY user_id, app_id, purchased_at DESC;

-- Verificar se há duplicação (mesmo user_id + app_id)
SELECT 
    user_id,
    app_id,
    COUNT(*) as total_registros,
    STRING_AGG(id::text, ', ') as ids,
    STRING_AGG(purchased_at::text, ', ') as datas_compra
FROM user_purchases
GROUP BY user_id, app_id
HAVING COUNT(*) > 1
ORDER BY total_registros DESC;

-- ========================================
-- 2. VERIFICAR TRIALS (Testes)
-- ========================================

-- Ver todos os trials do usuário
SELECT 
    id,
    user_id,
    app_id,
    created_at,
    expires_at,
    is_active,
    CASE 
        WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
        WHEN is_active = false THEN '❌ INATIVO'
        ELSE '✅ ATIVO'
    END as status_descricao
FROM user_trials
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
   OR user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
ORDER BY user_id, app_id, created_at DESC;

-- Verificar se há trials ativos
SELECT 
    COUNT(*) as total_trials,
    COUNT(CASE WHEN expires_at > NOW() AND is_active = true THEN 1 END) as trials_ativos
FROM user_trials
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
   OR user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0';

-- ========================================
-- 3. VERIFICAR ACESSO DO USUÁRIO
-- ========================================

-- Verificar perfil do usuário
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
   OR id = '09e6b710-c560-4f11-aa7a-01abef23f0b0';

-- Verificar se usuário tem sessão no Supabase Auth
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
   OR id = '09e6b710-c560-4f11-aa7a-01abef23f0b0';

-- ========================================
-- 4. VERIFICAR SE REGISTROS ESTÃO CORRETOS
-- ========================================

-- Verificar compras com app_id correto
SELECT 
    up.id,
    up.user_id,
    up.app_id,
    ra.name as nome_app,
    up.purchased_at,
    up.expires_at,
    CASE 
        WHEN up.expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN up.expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as status
FROM user_purchases up
LEFT JOIN registered_apps ra ON up.app_id = ra.id
WHERE up.user_id IN ('86f65d7a-cd01-45ed-b816-f105b8c3752e', '09e6b710-c560-4f11-aa7a-01abef23f0b0')
ORDER BY up.user_id, up.purchased_at DESC;

-- ========================================
-- 5. VERIFICAR DUPLICAÇÃO ESPECÍFICA
-- ========================================

-- Para o usuário Lucas Willian, verificar duplicação do JornadaPro
SELECT 
    up.id,
    up.user_id,
    up.app_id,
    up.status,
    up.purchase_type,
    up.purchased_at,
    up.expires_at,
    ra.name as nome_app,
    CASE 
        WHEN up.status = 'APPROVED' THEN '✅ APPROVED'
        WHEN up.status = 'active' THEN '⚠️ active (DIFERENTE DE APPROVED!)'
        ELSE '❌ ' || up.status
    END as status_check,
    CASE 
        WHEN up.expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN up.expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as expires_check
FROM user_purchases up
LEFT JOIN registered_apps ra ON up.app_id = ra.id
WHERE up.user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY up.purchased_at DESC;

-- ========================================
-- SOLUÇÃO: Remover Duplicações
-- ========================================

-- ⚠️ ATENÇÃO: Execute apenas se quiser remover duplicações
-- Mantém apenas o registro mais recente

-- Ver quais serão mantidos (mais recentes)
-- SELECT DISTINCT ON (user_id, app_id)
--     id,
--     user_id,
--     app_id,
--     purchased_at
-- FROM user_purchases
-- WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
-- ORDER BY user_id, app_id, purchased_at DESC;

-- Remover duplicados (mantém apenas o mais recente)
-- DELETE FROM user_purchases
-- WHERE id NOT IN (
--     SELECT DISTINCT ON (user_id, app_id) id
--     FROM user_purchases
--     ORDER BY user_id, app_id, purchased_at DESC
-- );
