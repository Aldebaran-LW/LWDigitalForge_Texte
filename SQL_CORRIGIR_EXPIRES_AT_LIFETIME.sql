-- ========================================
-- CORRIGIR: expires_at deve ser NULL para LIFETIME
-- ========================================
-- Problema: Compras LIFETIME têm expires_at com data
-- Solução: Atualizar expires_at para NULL em todas as compras LIFETIME
-- ========================================

-- 1. VER COMPRAS LIFETIME COM expires_at PREENCHIDO (INCORRETO)
SELECT 
  id,
  user_id,
  app_id,
  purchase_type,
  status,
  purchased_at,
  expires_at,
  CASE 
    WHEN expires_at IS NOT NULL THEN '❌ INCORRETO (deve ser NULL)'
    ELSE '✅ CORRETO'
  END AS status_expires_at
FROM user_purchases
WHERE purchase_type = 'LIFETIME'
  AND status = 'APPROVED'
ORDER BY purchased_at DESC;

-- 2. CORRIGIR: Atualizar expires_at para NULL em todas as compras LIFETIME
UPDATE user_purchases
SET expires_at = NULL
WHERE purchase_type = 'LIFETIME'
  AND status = 'APPROVED'
  AND expires_at IS NOT NULL;

-- 3. VERIFICAR SE FOI CORRIGIDO
SELECT 
  id,
  user_id,
  app_id,
  purchase_type,
  status,
  purchased_at,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN '✅ CORRETO (NULL)'
    ELSE '❌ AINDA INCORRETO'
  END AS status_expires_at
FROM user_purchases
WHERE purchase_type = 'LIFETIME'
  AND status = 'APPROVED'
ORDER BY purchased_at DESC;

-- 4. VERIFICAR COMPRAS DO USUÁRIO ESPECÍFICO
SELECT 
  up.id,
  up.user_id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  up.purchased_at,
  up.expires_at,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.expires_at IS NULL THEN '✅ VITALÍCIO CORRETO'
    WHEN up.purchase_type = 'LIFETIME' AND up.expires_at IS NOT NULL THEN '❌ VITALÍCIO COM EXPIRAÇÃO (INCORRETO)'
    ELSE 'OUTRO TIPO'
  END AS status_correto
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = '09e6b710-c560-4f11-aa7a-01abef23f0b0'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY up.purchased_at DESC;
