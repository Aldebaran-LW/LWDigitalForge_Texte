-- ========================================
-- 🔍 Verificar Políticas RLS para user_purchases
-- ========================================
-- Execute esta query para verificar se as políticas
-- de INSERT para user_purchases foram criadas corretamente
-- ========================================

SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
  AND cmd = 'INSERT'
ORDER BY policyname;

-- ========================================
-- Resultado Esperado:
-- ========================================
-- Deve mostrar a política:
-- "Admins podem inserir compras manuais"
-- com with_check contendo is_admin()
-- ========================================
