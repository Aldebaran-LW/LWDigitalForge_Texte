-- ========================================
-- 🔍 TESTE SUPREMO (Debug no Banco)
-- ========================================
-- Execute estas queries no SQL Editor do Supabase para diagnosticar problemas de acesso
-- ========================================

-- 1. Verificar se o registro de compra existe para o usuário
-- ⚠️ SUBSTITUA 'ID-DO-USUARIO' pelo ID real do usuário
-- ⚠️ SUBSTITUA 'e8ff7872-dedb-405c-bf8a-f7901ac4b432' pelo app_id real (JornadaPro)

SELECT 
  id,
  user_id,
  app_id,
  purchase_type,
  status,
  expires_at,
  purchased_at,
  payment_method,
  amount_paid,
  created_at
FROM user_purchases 
WHERE user_id = 'ID-DO-USUARIO' 
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND status = 'APPROVED';

-- 2. Verificar se o registro de trial existe
SELECT 
  id,
  user_id,
  app_id,
  started_at,
  expires_at,
  is_active,
  created_at
FROM user_trials 
WHERE user_id = 'ID-DO-USUARIO' 
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND is_active = true;

-- 3. Verificar se o app existe e está ativo
SELECT 
  id,
  name,
  slug,
  is_active,
  created_at
FROM registered_apps 
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- 4. Verificar TODAS as compras do usuário (para debug completo)
SELECT 
  up.id,
  up.user_id,
  up.app_id,
  up.purchase_type,
  up.status,
  up.expires_at,
  up.purchased_at,
  up.payment_method,
  up.amount_paid,
  ra.name as app_name,
  ra.is_active as app_is_active,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' THEN 'VITALÍCIO (sempre ativo se APPROVED)'
    WHEN up.expires_at IS NULL THEN 'SEM EXPIRAÇÃO DEFINIDA'
    WHEN up.expires_at > NOW() THEN 'ATIVO (não expirado)'
    ELSE 'EXPIRADO'
  END as status_accesso
FROM user_purchases up
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = 'ID-DO-USUARIO'
ORDER BY up.created_at DESC;

-- 5. Verificar TODOS os trials do usuário
SELECT 
  ut.id,
  ut.user_id,
  ut.app_id,
  ut.started_at,
  ut.expires_at,
  ut.is_active,
  ra.name as app_name,
  CASE 
    WHEN ut.is_active = false THEN 'INATIVO'
    WHEN ut.expires_at > NOW() THEN 'ATIVO (não expirado)'
    ELSE 'EXPIRADO'
  END as status_trial
FROM user_trials ut
LEFT JOIN registered_apps ra ON ra.id = ut.app_id
WHERE ut.user_id = 'ID-DO-USUARIO'
ORDER BY ut.started_at DESC;

-- 6. Verificar se o usuário existe no profiles
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles 
WHERE id = 'ID-DO-USUARIO';

-- ========================================
-- 📋 CHECKLIST DE DIAGNÓSTICO
-- ========================================
-- Execute as queries acima e verifique:
-- 
-- ✅ Query 1: Deve retornar pelo menos 1 registro com:
--    - status = 'APPROVED'
--    - purchase_type = 'LIFETIME' (ou MONTHLY/ANNUAL com expires_at > NOW())
--    - app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
--
-- ✅ Query 2: Deve retornar pelo menos 1 registro com:
--    - is_active = true
--    - expires_at > NOW()
--    - app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
--
-- ✅ Query 3: Deve retornar 1 registro com:
--    - is_active = true
--    - id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
--
-- ✅ Query 6: Deve retornar 1 registro com:
--    - id = 'ID-DO-USUARIO'
--    - email correspondente
--
-- ========================================
-- 🔧 SE OS REGISTROS EXISTIREM E O APP CONTINUAR BLOQUEADO:
-- ========================================
-- O problema está na Edge Function ou no frontend que chama a Edge Function.
-- 
-- 1. Verifique os logs da Edge Function no Supabase Dashboard:
--    - Functions > check-subscription > Logs
--    - Procure por "DADOS RECEBIDOS NA FUNÇÃO"
--    - Verifique se appId está chegando corretamente
--
-- 2. Verifique o frontend (JornadaPro):
--    - Console do navegador (F12)
--    - Procure por logs de verifyAccess
--    - Verifique se appId está sendo enviado corretamente
--
-- ========================================
