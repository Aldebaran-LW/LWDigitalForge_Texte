-- ========================================
-- SQL Completo para Debug da Liberação
-- ========================================
-- Execute estas queries para diagnosticar o problema
-- ========================================

-- 1. LISTAR TODOS OS USUÁRIOS (para pegar o ID)
SELECT id, email, role, full_name
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- 2. VERIFICAR COMPRAS DE UM USUÁRIO ESPECÍFICO
-- IMPORTANTE: Substitua [USER_ID] pelo ID do usuário que você tentou liberar
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
WHERE up.user_id = '[USER_ID]'  -- SUBSTITUIR AQUI
ORDER BY up.purchased_at DESC;

-- 3. VERIFICAR SE EXISTE COMPRA PARA O JORNADAPRO
-- IMPORTANTE: Substitua [USER_ID] pelo ID do usuário
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
WHERE up.user_id = '[USER_ID]'  -- SUBSTITUIR AQUI
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'  -- ID do JornadaPro
ORDER BY up.purchased_at DESC;

-- 4. VERIFICAR POLÍTICAS RLS EM user_purchases
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
ORDER BY policyname;

-- 5. VERIFICAR SE A FUNÇÃO is_admin() EXISTE E FUNCIONA
SELECT 
  proname,
  prosrc
FROM pg_proc
WHERE proname = 'is_admin';

-- 6. TESTAR A FUNÇÃO is_admin() (deve ser executado por um admin logado)
-- SELECT public.is_admin();

-- 7. VERIFICAR TODAS AS COMPRAS RECENTES (últimas 10)
SELECT 
  up.id,
  p.email as user_email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.payment_method,
  up.purchased_at,
  up.expires_at,
  up.created_at
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
ORDER BY up.created_at DESC
LIMIT 10;

-- 8. VERIFICAR SE O APP_ID DO JORNADAPRO ESTÁ CORRETO
SELECT id, name, slug, is_active
FROM registered_apps
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
   OR name ILIKE '%jornada%'
   OR slug ILIKE '%jornada%';

-- 9. SIMULAR A LÓGICA DA EDGE FUNCTION
-- IMPORTANTE: Substitua [USER_ID] pelo ID do usuário
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
  WHERE up.user_id = '[USER_ID]'  -- SUBSTITUIR AQUI
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
  WHERE ut.user_id = '[USER_ID]'  -- SUBSTITUIR AQUI
    AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
    AND ut.is_active = true
)
SELECT 
  COALESCE(MAX(ua.has_purchase), false) as has_access_purchase,
  COALESCE(MAX(ut.has_trial), false) as has_access_trial,
  (COALESCE(MAX(ua.has_purchase), false) OR COALESCE(MAX(ut.has_trial), false)) as has_access_final
FROM user_access ua
FULL OUTER JOIN user_trial ut ON true;

-- 10. VERIFICAR TRIALS DO USUÁRIO
-- IMPORTANTE: Substitua [USER_ID] pelo ID do usuário
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
WHERE ut.user_id = '[USER_ID]'  -- SUBSTITUIR AQUI
ORDER BY ut.started_at DESC;
