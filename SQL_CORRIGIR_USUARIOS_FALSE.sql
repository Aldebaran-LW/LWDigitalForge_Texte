-- 🔧 CORREÇÃO URGENTE: Liberar Usuários Bloqueados
-- Execute IMEDIATAMENTE no Supabase SQL Editor

-- 1. LIBERAR OS 2 USUÁRIOS QUE ESTÃO COM FALSE
UPDATE profiles
SET 
  is_liberado = TRUE,
  data_vencimento = '2099-01-01 00:00:00+00'
WHERE email IN (
  'admin@lwdigitalforge.com',
  'lucas05willian@hotmail.com'
);

-- 2. VERIFICAR SE FORAM ATUALIZADOS
SELECT 
  email, 
  is_liberado, 
  data_vencimento,
  role
FROM profiles
WHERE email IN (
  'admin@lwdigitalforge.com',
  'lucas05willian@hotmail.com'
);

-- 3. GARANTIR QUE ADMIN TEM ROLE CORRETO
UPDATE profiles
SET role = 'ADMIN'
WHERE email = 'admin@lwdigitalforge.com';

-- 4. SE QUISER LIBERAR TODOS OS USUÁRIOS
UPDATE profiles
SET 
  is_liberado = TRUE,
  data_vencimento = '2099-01-01 00:00:00+00'
WHERE is_liberado = FALSE OR is_liberado IS NULL;

-- 5. ALTERAR DEFAULT PARA NOVOS USUÁRIOS
ALTER TABLE profiles 
ALTER COLUMN is_liberado SET DEFAULT TRUE;

-- ✅ RESULTADO ESPERADO:
-- Todos os usuários agora podem acessar o SITE PRINCIPAL (/portal)
-- Para acessar APPS ESPECÍFICOS (JornadaPro), ainda precisam de user_purchases/user_trials
