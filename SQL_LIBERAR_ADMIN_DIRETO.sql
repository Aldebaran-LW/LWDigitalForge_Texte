-- ========================================
-- Liberar Acesso JornadaPro para ADMIN (DIRETO)
-- ========================================
-- Usuário: lwdigitalforge@gmail.com (ADMIN)
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- Liberar acesso vitalício (busca ID automaticamente)
INSERT INTO user_purchases (
  user_id,
  app_id,
  purchase_type,
  status,
  payment_method,
  amount_paid,
  purchased_at,
  expires_at
)
SELECT 
  p.id,  -- ID do usuário lwdigitalforge@gmail.com
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
FROM profiles p
WHERE p.email = 'lwdigitalforge@gmail.com'
  AND NOT EXISTS (
    -- Evita duplicar se já existir
    SELECT 1 FROM user_purchases up
    WHERE up.user_id = p.id
      AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
      AND up.status = 'APPROVED'
      AND up.purchase_type = 'LIFETIME'
  );

-- ========================================
-- Verificar se foi liberado
-- ========================================

SELECT 
  up.id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com')
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- Resultado esperado: Deve mostrar ✅ VITALÍCIO
