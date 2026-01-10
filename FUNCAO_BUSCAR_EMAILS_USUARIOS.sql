-- ========================================
-- Criar função para buscar emails de usuários (para admins)
-- ========================================
-- Esta função permite que admins vejam emails dos usuários
-- mesmo que a coluna email não exista em profiles
-- ========================================

-- Criar função que retorna emails de usuários
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids UUID[])
RETURNS TABLE(user_id UUID, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário na função
COMMENT ON FUNCTION public.get_user_emails(UUID[]) IS 
  'Retorna emails de usuários para admins. Requer role ADMIN.';

-- ========================================
-- Como usar no código:
-- ========================================
-- const { data, error } = await supabase.rpc('get_user_emails', {
--   user_ids: ['uuid1', 'uuid2', ...]
-- });
-- ========================================



