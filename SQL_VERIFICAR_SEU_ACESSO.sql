-- 🔍 Verificar se VOCÊ tem acesso ao JornadaPro

-- PASSO 1: Encontrar seu user_id
SELECT id, email, is_liberado, data_vencimento, role
FROM profiles
WHERE email = 'lwdigitalforge@gmail.com'  -- SUBSTITUIR pelo seu email
   OR email = 'admin@lwdigitalforge.com'
   OR email = 'lucas05willian@hotmail.com';

-- PASSO 2: Verificar compras (substitua USER_ID_AQUI)
SELECT 
  up.id,
  up.purchase_type,
  up.status,
  up.expires_at,
  ra.name as app_name,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ ACESSO VITALÍCIO'
    WHEN up.purchase_type IN ('MONTHLY', 'ANNUAL') 
         AND up.status = 'APPROVED'
         AND (up.expires_at IS NULL OR up.expires_at > NOW()) THEN '✅ ACESSO ATIVO'
    ELSE '❌ SEM ACESSO'
  END as status_acesso
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = 'USER_ID_AQUI'  -- COLAR ID do PASSO 1
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';  -- JornadaPro

-- PASSO 3: Verificar trials (substitua USER_ID_AQUI)
SELECT 
  ut.id,
  ut.started_at,
  ut.expires_at,
  ut.is_active,
  ra.name as app_name,
  CASE 
    WHEN ut.is_active = true AND ut.expires_at > NOW() THEN '✅ TRIAL ATIVO'
    WHEN ut.expires_at < NOW() THEN '⏰ TRIAL EXPIRADO'
    ELSE '❌ TRIAL INATIVO'
  END as status_trial
FROM user_trials ut
LEFT JOIN registered_apps ra ON ra.id = ut.app_id
WHERE ut.user_id = 'USER_ID_AQUI'  -- COLAR ID do PASSO 1
  AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';  -- JornadaPro

-- PASSO 4: Se NÃO tiver nenhum registro, criar um:

-- OPÇÃO A: Criar LIFETIME (acesso vitalício)
INSERT INTO user_purchases (user_id, app_id, purchase_type, status, payment_method, amount_paid, purchased_at)
VALUES (
  'USER_ID_AQUI',  -- COLAR ID do PASSO 1
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW()
);

-- OPÇÃO B: Criar TRIAL de 30 dias
INSERT INTO user_trials (user_id, app_id, started_at, expires_at, is_active)
VALUES (
  'USER_ID_AQUI',  -- COLAR ID do PASSO 1
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  NOW(),
  NOW() + INTERVAL '30 days',
  true
);
