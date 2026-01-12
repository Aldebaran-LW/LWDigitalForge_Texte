-- ========================================
-- SQL para Debug do Usuário Específico
-- ========================================
-- Usuário: lucaswillian.yamasa@gmail.com
-- ID: 09e6b710-c560-4f11-aa7a-01abef23f0b0
-- ========================================

-- 1. VERIFICAR PERFIL DO USUÁRIO
SELECT 
  id,
  email,
  full_name,
  role,
  is_liberado,
  data_vencimento
FROM profiles
WHERE id = '09e6b710-c560-4f11-aa7a-01abef23f0b0';

-- 2. VERIFICAR COMPRAS (user_purchases) DESTE USUÁRIO
SELECT 
  up.id,
  up.user_id,
  up.app_id,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.payment_method,
  up.amount_paid,
  up.purchased_at,
  up.expires_at,
  up.created_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
         AND up.status = 'APPROVED' 
         AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN '✅ ASSINATURA_ATIVA'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
ORDER BY up.purchased_at DESC;

-- 3. VERIFICAR SE EXISTE COMPRA PARA O JORNADAPRO ESPECIFICAMENTE
SELECT 
  up.id,
  up.user_id,
  up.app_id,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
         AND up.status = 'APPROVED' 
         AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN '✅ ASSINATURA_ATIVA'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'  -- ID do JornadaPro
ORDER BY up.purchased_at DESC;

-- 4. VERIFICAR TRIALS DESTE USUÁRIO
SELECT 
  ut.id,
  ut.user_id,
  ut.app_id,
  ra.name as app_name,
  ut.is_active,
  ut.started_at,
  ut.expires_at,
  CASE 
    WHEN ut.is_active = true AND ut.expires_at > NOW() THEN '✅ TRIAL_ATIVO'
    ELSE '❌ TRIAL_EXPIRADO_OU_INATIVO'
  END AS status_trial
FROM user_trials ut
LEFT JOIN registered_apps ra ON ra.id = ut.app_id
WHERE ut.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
ORDER BY ut.started_at DESC;

-- 5. SIMULAR A LÓGICA DA EDGE FUNCTION (para JornadaPro)
WITH user_access AS (
  SELECT 
    up.id as purchase_id,
    up.purchase_type,
    up.status,
    up.expires_at,
    CASE 
      WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN true
      WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
           AND up.status = 'APPROVED' 
           AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN true
      ELSE false
    END AS has_purchase
  FROM user_purchases up
  WHERE up.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
    AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
    AND up.status = 'APPROVED'
),
user_trial AS (
  SELECT 
    ut.id as trial_id,
    ut.expires_at,
    CASE 
      WHEN ut.is_active = true AND ut.expires_at > NOW() THEN true
      ELSE false
    END AS has_trial
  FROM user_trials ut
  WHERE ut.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
    AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
    AND ut.is_active = true
)
SELECT 
  COALESCE(MAX(ua.has_purchase), false) as has_access_purchase,
  COALESCE(MAX(ut.has_trial), false) as has_access_trial,
  (COALESCE(MAX(ua.has_purchase), false) OR COALESCE(MAX(ut.has_trial), false)) as has_access_final,
  CASE 
    WHEN COALESCE(MAX(ua.has_purchase), false) = true THEN 'PAID'
    WHEN COALESCE(MAX(ut.has_trial), false) = true THEN 'TRIAL'
    ELSE 'NONE'
  END AS access_type
FROM user_access ua
FULL OUTER JOIN user_trial ut ON true;

-- 6. VERIFICAR SE O APP JORNADAPRO EXISTE E ESTÁ ATIVO
SELECT id, name, slug, is_active
FROM registered_apps
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- 7. VERIFICAR TODAS AS COMPRAS LIFETIME DESTE USUÁRIO
SELECT 
  up.*,
  ra.name as app_name
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
  AND up.purchase_type = 'LIFETIME'
ORDER BY up.purchased_at DESC;
