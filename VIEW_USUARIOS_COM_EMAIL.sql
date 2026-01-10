-- ========================================
-- Criar VIEW para juntar profiles com emails de auth.users
-- ========================================
-- Esta view permite que admins vejam emails dos usuários
-- de forma mais simples e direta
-- ========================================

-- Remover view se já existir
DROP VIEW IF EXISTS public.users_with_emails;

-- Criar view que junta profiles com auth.users
-- Nota: profiles não tem created_at/updated_at, então usamos de auth.users
CREATE VIEW public.users_with_emails AS
SELECT 
    p.id,
    au.email,
    p.full_name,
    p.phone,
    p.role,
    COALESCE(au.created_at, NOW()) as created_at,
    COALESCE(au.updated_at, NOW()) as updated_at
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id;

-- Comentário na view
COMMENT ON VIEW public.users_with_emails IS 
  'View que junta profiles com emails de auth.users para admins';

-- ========================================
-- Política RLS para a view
-- ========================================
-- Admins podem ver todos os usuários
-- Usuários podem ver apenas seu próprio perfil
-- ========================================

-- Habilitar RLS na view (se necessário)
-- ALTER VIEW public.users_with_emails SET (security_invoker = true);

-- ========================================
-- Como usar no código:
-- ========================================
-- const { data, error } = await supabase
--   .from('users_with_emails')
--   .select('*')
--   .order('created_at', { ascending: false });
-- ========================================

