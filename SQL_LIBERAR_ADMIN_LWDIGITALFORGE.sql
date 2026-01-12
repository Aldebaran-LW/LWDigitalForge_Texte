-- ========================================
-- Liberar Acesso JornadaPro para ADMIN
-- ========================================
-- Usuário: lwdigitalforge@gmail.com (ADMIN)
-- ========================================

-- PASSO 1: Verificar ID do usuário e acesso atual
SELECT 
  p.id,
  p.email,
  p.role,
  p.is_liberado,
  up.id as purchase_id,
  up.purchase_type,
  up.status,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM profiles p
LEFT JOIN user_purchases up ON up.user_id = p.id
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.status = 'APPROVED'
WHERE p.email = 'lwdigitalforge@gmail.com';

-- ========================================
-- PASSO 2: Liberar acesso (execute se PASSO 1 mostrar ❌ SEM_ACESSO)
-- ========================================
-- ID conhecido do usuário: 52c476c6-4edd-4f61-8f5e-599e067d6bc1
-- ========================================

-- Liberar acesso vitalício
INSERT INTO user_purchases (
  user_id,
  app_id,
  purchase_type,
  status,
  payment_method,
  amount_paid,
  purchased_at,
  expires_at
) VALUES (
  '52c476c6-4edd-4f61-8f5e-599e067d6bc1',  -- ID do usuário lwdigitalforge@gmail.com
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
)
ON CONFLICT DO NOTHING;  -- Evita erro se já existir

-- ========================================
-- PASSO 3: Verificar se foi liberado
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
WHERE up.user_id = '52c476c6-4edd-4f61-8f5e-599e067d6bc1'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- Resultado esperado: Deve mostrar ✅ VITALÍCIO
