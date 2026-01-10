-- ========================================
-- Diagnóstico de Acesso do Usuário
-- ========================================
-- Este script verifica se um usuário tem acesso a um app específico
-- Execute substituindo USER_ID e APP_ID pelos valores corretos
-- ========================================

-- 1. Verificar se o usuário existe e tem perfil
SELECT 
    u.id as user_id,
    u.email as user_email,
    u.email_confirmed_at,
    p.full_name,
    p.role,
    p.email as profile_email,
    CASE 
        WHEN p.email IS NULL THEN '❌ Email não sincronizado em profiles'
        WHEN p.email = u.email THEN '✅ Email sincronizado'
        ELSE '⚠️ Email diferente'
    END as email_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.id = 'USER_ID_AQUI'  -- SUBSTITUIR pelo ID do usuário
   OR u.email = 'EMAIL_AQUI';  -- OU substituir pelo email do usuário

-- 2. Verificar assinaturas ativas para um app específico
-- SUBSTITUIR 'USER_ID_AQUI' e 'APP_ID_AQUI' pelos valores corretos
SELECT 
    up.id,
    up.user_id,
    up.app_id,
    ra.name as app_name,
    up.purchase_type,
    up.status,
    up.expires_at,
    up.created_at,
    CASE 
        WHEN up.purchase_type = 'LIFETIME' THEN '✅ LIFETIME - Sempre ativo'
        WHEN up.expires_at IS NULL THEN '⚠️ Sem data de expiração'
        WHEN up.expires_at > NOW() THEN '✅ Ativo'
        ELSE '❌ Expirado'
    END as status_assinatura
FROM user_purchases up
JOIN registered_apps ra ON up.app_id = ra.id
WHERE up.user_id = 'USER_ID_AQUI'  -- SUBSTITUIR
  AND up.app_id = 'APP_ID_AQUI'     -- SUBSTITUIR
  AND up.status = 'APPROVED'
  AND up.purchase_type IN ('MONTHLY', 'ANNUAL', 'LIFETIME')
ORDER BY up.created_at DESC;

-- 3. Verificar testes ativos para um app específico
SELECT 
    ut.id,
    ut.user_id,
    ut.app_id,
    ra.name as app_name,
    ut.is_active,
    ut.started_at,
    ut.expires_at,
    CASE 
        WHEN ut.is_active = false THEN '❌ Inativo'
        WHEN ut.expires_at < NOW() THEN '❌ Expirado'
        WHEN ut.expires_at > NOW() THEN '✅ Ativo'
        ELSE '⚠️ Status desconhecido'
    END as status_trial,
    EXTRACT(DAY FROM (ut.expires_at - NOW())) as dias_restantes
FROM user_trials ut
JOIN registered_apps ra ON ut.app_id = ra.id
WHERE ut.user_id = 'USER_ID_AQUI'  -- SUBSTITUIR
  AND ut.app_id = 'APP_ID_AQUI'     -- SUBSTITUIR
ORDER BY ut.started_at DESC;

-- 4. Verificar se o app existe e está ativo
SELECT 
    id,
    name,
    slug,
    is_active,
    vercel_deployment_url,
    CASE 
        WHEN is_active = true THEN '✅ App ativo'
        ELSE '❌ App inativo'
    END as status_app
FROM registered_apps
WHERE id = 'APP_ID_AQUI';  -- SUBSTITUIR

-- 5. Verificar TODAS as compras do usuário (para debug)
SELECT 
    up.id,
    up.app_id,
    ra.name as app_name,
    up.purchase_type,
    up.status,
    up.expires_at,
    up.created_at
FROM user_purchases up
LEFT JOIN registered_apps ra ON up.app_id = ra.id
WHERE up.user_id = 'USER_ID_AQUI'  -- SUBSTITUIR
ORDER BY up.created_at DESC;

-- 6. Verificar TODOS os testes do usuário (para debug)
SELECT 
    ut.id,
    ut.app_id,
    ra.name as app_name,
    ut.is_active,
    ut.started_at,
    ut.expires_at
FROM user_trials ut
LEFT JOIN registered_apps ra ON ut.app_id = ra.id
WHERE ut.user_id = 'USER_ID_AQUI'  -- SUBSTITUIR
ORDER BY ut.started_at DESC;

-- ========================================
-- RESUMO: Verificação Completa de Acesso
-- ========================================
-- Execute esta query substituindo USER_ID e APP_ID para ver um resumo completo
WITH user_info AS (
    SELECT 
        u.id,
        u.email,
        p.full_name
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.id = 'USER_ID_AQUI'  -- SUBSTITUIR
),
app_info AS (
    SELECT 
        id,
        name,
        is_active
    FROM registered_apps
    WHERE id = 'APP_ID_AQUI'  -- SUBSTITUIR
),
subscriptions AS (
    SELECT 
        up.user_id,
        up.app_id,
        up.purchase_type,
        up.expires_at,
        CASE 
            WHEN up.purchase_type = 'LIFETIME' THEN true
            WHEN up.expires_at > NOW() THEN true
            ELSE false
        END as is_active_subscription
    FROM user_purchases up
    WHERE up.user_id = (SELECT id FROM user_info)
      AND up.app_id = (SELECT id FROM app_info)
      AND up.status = 'APPROVED'
      AND up.purchase_type IN ('MONTHLY', 'ANNUAL', 'LIFETIME')
),
trials AS (
    SELECT 
        ut.user_id,
        ut.app_id,
        ut.is_active,
        ut.expires_at,
        CASE 
            WHEN ut.is_active = true AND ut.expires_at > NOW() THEN true
            ELSE false
        END as is_active_trial
    FROM user_trials ut
    WHERE ut.user_id = (SELECT id FROM user_info)
      AND ut.app_id = (SELECT id FROM app_info)
)
SELECT 
    ui.email,
    ai.name as app_name,
    ai.is_active as app_is_active,
    COALESCE(MAX(s.is_active_subscription), false) as has_active_subscription,
    COALESCE(MAX(t.is_active_trial), false) as has_active_trial,
    CASE 
        WHEN NOT ai.is_active THEN '❌ App não está ativo'
        WHEN COALESCE(MAX(s.is_active_subscription), false) THEN '✅ Tem assinatura ativa'
        WHEN COALESCE(MAX(t.is_active_trial), false) THEN '✅ Tem trial ativo'
        ELSE '❌ Sem acesso'
    END as resultado_acesso
FROM user_info ui
CROSS JOIN app_info ai
LEFT JOIN subscriptions s ON s.user_id = ui.id AND s.app_id = ai.id
LEFT JOIN trials t ON t.user_id = ui.id AND t.app_id = ai.id
GROUP BY ui.email, ai.name, ai.is_active;
