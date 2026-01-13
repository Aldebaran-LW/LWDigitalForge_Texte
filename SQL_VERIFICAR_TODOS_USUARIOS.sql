-- 🔍 VERIFICAR ACESSO DE TODOS OS USUÁRIOS AO JORNADAPRO

-- QUERY COMPLETA: Status de acesso de todos os usuários
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.role,
  p.is_liberado,
  p.data_vencimento,
  
  -- Verificar se tem compra LIFETIME
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_purchases up
      WHERE up.user_id = p.id
        AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND up.purchase_type = 'LIFETIME'
        AND up.status = 'APPROVED'
    ) THEN '✅ LIFETIME'
    ELSE NULL
  END as compra_lifetime,
  
  -- Verificar se tem compra MONTHLY/ANNUAL ativa
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_purchases up
      WHERE up.user_id = p.id
        AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND up.purchase_type IN ('MONTHLY', 'ANNUAL')
        AND up.status = 'APPROVED'
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) THEN '✅ ASSINATURA_ATIVA'
    ELSE NULL
  END as compra_assinatura,
  
  -- Verificar se tem trial ativo
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_trials ut
      WHERE ut.user_id = p.id
        AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND ut.is_active = true
        AND ut.expires_at > NOW()
    ) THEN '✅ TRIAL_ATIVO'
    ELSE NULL
  END as trial_status,
  
  -- VEREDICTO FINAL
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_purchases up
      WHERE up.user_id = p.id
        AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND up.purchase_type = 'LIFETIME'
        AND up.status = 'APPROVED'
    ) THEN '✅ TEM ACESSO (LIFETIME)'
    WHEN EXISTS (
      SELECT 1 FROM user_purchases up
      WHERE up.user_id = p.id
        AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND up.purchase_type IN ('MONTHLY', 'ANNUAL')
        AND up.status = 'APPROVED'
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) THEN '✅ TEM ACESSO (ASSINATURA)'
    WHEN EXISTS (
      SELECT 1 FROM user_trials ut
      WHERE ut.user_id = p.id
        AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
        AND ut.is_active = true
        AND ut.expires_at > NOW()
    ) THEN '✅ TEM ACESSO (TRIAL)'
    ELSE '❌ SEM ACESSO'
  END as status_final

FROM profiles p
ORDER BY 
  CASE 
    WHEN p.role = 'ADMIN' THEN 1
    ELSE 2
  END,
  p.email;


-- ════════════════════════════════════════════════════════════════════
-- QUERY RESUMIDA: Contar usuários por status
-- ════════════════════════════════════════════════════════════════════

SELECT 
  'Total de Usuários' as tipo,
  COUNT(*) as quantidade
FROM profiles
UNION ALL
SELECT 
  '✅ Com Acesso (LIFETIME)' as tipo,
  COUNT(DISTINCT p.id) as quantidade
FROM profiles p
INNER JOIN user_purchases up ON up.user_id = p.id
WHERE up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.purchase_type = 'LIFETIME'
  AND up.status = 'APPROVED'
UNION ALL
SELECT 
  '✅ Com Acesso (ASSINATURA)' as tipo,
  COUNT(DISTINCT p.id) as quantidade
FROM profiles p
INNER JOIN user_purchases up ON up.user_id = p.id
WHERE up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND up.purchase_type IN ('MONTHLY', 'ANNUAL')
  AND up.status = 'APPROVED'
  AND (up.expires_at IS NULL OR up.expires_at > NOW())
UNION ALL
SELECT 
  '✅ Com Acesso (TRIAL)' as tipo,
  COUNT(DISTINCT p.id) as quantidade
FROM profiles p
INNER JOIN user_trials ut ON ut.user_id = p.id
WHERE ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND ut.is_active = true
  AND ut.expires_at > NOW()
UNION ALL
SELECT 
  '❌ Sem Acesso' as tipo,
  COUNT(DISTINCT p.id) as quantidade
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_purchases up
  WHERE up.user_id = p.id
    AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
    AND up.status = 'APPROVED'
    AND (
      up.purchase_type = 'LIFETIME' 
      OR (up.purchase_type IN ('MONTHLY', 'ANNUAL') AND (up.expires_at IS NULL OR up.expires_at > NOW()))
    )
)
AND NOT EXISTS (
  SELECT 1 FROM user_trials ut
  WHERE ut.user_id = p.id
    AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
    AND ut.is_active = true
    AND ut.expires_at > NOW()
);


-- ════════════════════════════════════════════════════════════════════
-- LIBERAR ACESSO PARA USUÁRIOS ESPECÍFICOS (Se necessário)
-- ════════════════════════════════════════════════════════════════════

-- OPÇÃO 1: Liberar TODOS os usuários cadastrados (LIFETIME)
-- CUIDADO: Isso dá acesso vitalício para TODOS!
/*
INSERT INTO user_purchases (user_id, app_id, purchase_type, status, payment_method, amount_paid, purchased_at)
SELECT 
  id,
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW()
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM user_purchases up
  WHERE up.user_id = profiles.id
    AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
);
*/

-- OPÇÃO 2: Liberar apenas ADMINs (LIFETIME)
/*
INSERT INTO user_purchases (user_id, app_id, purchase_type, status, payment_method, amount_paid, purchased_at)
SELECT 
  id,
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  'LIFETIME',
  'APPROVED',
  'ADMIN_GRANT',
  0,
  NOW()
FROM profiles
WHERE role = 'ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM user_purchases up
    WHERE up.user_id = profiles.id
      AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  );
*/

-- OPÇÃO 3: Criar TRIAL de 30 dias para usuários sem acesso
/*
INSERT INTO user_trials (user_id, app_id, started_at, expires_at, is_active)
SELECT 
  id,
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
  NOW(),
  NOW() + INTERVAL '30 days',
  true
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM user_purchases up
  WHERE up.user_id = profiles.id
    AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
)
AND NOT EXISTS (
  SELECT 1 FROM user_trials ut
  WHERE ut.user_id = profiles.id
    AND ut.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
);
*/
