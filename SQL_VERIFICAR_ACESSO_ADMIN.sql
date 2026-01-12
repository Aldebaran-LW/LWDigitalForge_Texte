-- ========================================
-- Verificar Acesso do ADMIN
-- ========================================
-- Usuário: lwdigitalforge@gmail.com
-- ========================================

-- VERIFICAÇÃO 1: Ver se o usuário existe e tem role ADMIN
SELECT 
  id,
  email,
  role,
  is_liberado,
  data_vencimento,
  created_at
FROM profiles
WHERE email = 'lwdigitalforge@gmail.com';

-- ========================================
-- VERIFICAÇÃO 2: Ver se tem acesso ao JornadaPro
-- ========================================

SELECT 
  up.id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.payment_method,
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
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com')
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- ========================================
-- VERIFICAÇÃO 3: Ver todos os acessos do usuário (purchases + trials)
-- ========================================

-- Purchases
SELECT 
  'PURCHASE' as tipo,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com');

-- Trials
SELECT 
  'TRIAL' as tipo,
  p.email,
  ra.name as app_name,
  ut.is_active,
  ut.started_at,
  ut.expires_at
FROM user_trials ut
LEFT JOIN profiles p ON p.id = ut.user_id
LEFT JOIN registered_apps ra ON ra.id = ut.app_id
WHERE ut.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com');
