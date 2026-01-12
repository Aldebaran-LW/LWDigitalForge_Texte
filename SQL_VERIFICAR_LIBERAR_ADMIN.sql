-- ========================================
-- Verificar e Liberar Acesso para ADMIN
-- ========================================
-- Usuário: lwdigitalforge@gmail.com (ADMIN)
-- ========================================

-- PASSO 1: Verificar usuário e acesso atual
SELECT 
  p.id,
  p.email,
  p.role,
  p.is_liberado,
  p.data_vencimento,
  up.id as purchase_id,
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
FROM profiles p
LEFT JOIN user_purchases up ON up.user_id = p.id
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.status = 'APPROVED'
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE p.email = 'lwdigitalforge@gmail.com';

-- ========================================
-- PASSO 2: Se não tiver acesso, liberar
-- ========================================
-- IMPORTANTE: Execute apenas se o PASSO 1 mostrar '❌ SEM_ACESSO'
-- ========================================

-- Primeiro, pegar o ID do usuário (execute o PASSO 1 primeiro)
-- O ID estará na coluna 'id' do resultado

-- Depois, execute este INSERT (substitua [USER_ID] pelo ID do PASSO 1):
/*
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
  '[USER_ID]',  -- SUBSTITUIR pelo ID retornado no PASSO 1
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- ID do JornadaPro
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW(),
  NULL
);
*/

-- ========================================
-- PASSO 3: Verificar se foi liberado (após executar PASSO 2)
-- ========================================
-- Execute o PASSO 1 novamente para verificar
-- Deve mostrar '✅ VITALÍCIO'
