-- Correção RLS blog_posts — alinhado ao projeto LW (role = ADMIN, função is_admin())
-- NÃO use scripts com role = admin em minúsculo.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SET LOCAL row_security = off;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;

  SET LOCAL row_security = on;

  RETURN COALESCE(user_role = 'ADMIN', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins full access blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Qualquer um pode ver posts publicados" ON public.blog_posts;
DROP POLICY IF EXISTS "Usuários autenticados podem ver posts publicados" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins podem ver todos os posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins podem inserir posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins podem atualizar posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins podem deletar posts" ON public.blog_posts;

CREATE POLICY "blog_posts_public_read"
    ON public.blog_posts FOR SELECT TO anon, authenticated
    USING (is_published = true AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "blog_posts_admin_select"
    ON public.blog_posts FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "blog_posts_admin_insert"
    ON public.blog_posts FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "blog_posts_admin_update"
    ON public.blog_posts FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "blog_posts_admin_delete"
    ON public.blog_posts FOR DELETE TO authenticated
    USING (public.is_admin());

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
