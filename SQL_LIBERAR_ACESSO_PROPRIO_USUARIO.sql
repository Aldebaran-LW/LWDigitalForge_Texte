-- ========================================
-- Liberar Acesso ao JornadaPro para Seu Usuário
-- ========================================
-- PASSO 1: Ver seu ID de usuário
-- ========================================

-- Substitua '[SEU_EMAIL]' pelo seu email
SELECT id, email, role, is_liberado, data_vencimento
FROM profiles
WHERE email = '[SEU_EMAIL]';
-- Exemplo: WHERE email = 'lwdigitalforge@gmail.com';

-- ========================================
-- PASSO 2: Liberar acesso (execute após o PASSO 1)
-- ========================================

-- IMPORTANTE: Substitua [SEU_USER_ID] pelo ID retornado no PASSO 1
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
  '[SEU_USER_ID]',  -- SUBSTITUIR pelo ID do PASSO 1
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);

-- ========================================
-- PASSO 3: Verificar se foi liberado
-- ========================================

-- Substitua [SEU_USER_ID] pelo seu ID
SELECT 
  up.id,
  up.user_id,
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
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '[SEU_USER_ID]'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

-- Resultado esperado: Deve mostrar '✅ VITALÍCIO'
