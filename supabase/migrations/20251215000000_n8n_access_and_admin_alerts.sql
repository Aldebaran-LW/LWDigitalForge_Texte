-- ========================================
-- N8N + ACESSOS + ALERTAS ADMIN
-- Migration criada em: 2025-12-15
-- ========================================

-- Extensão (já pode existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA: product_types (usada no AdminTiposDeProduto)
-- ========================================
CREATE TABLE IF NOT EXISTS public.product_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tipos de produto"
  ON public.product_types FOR SELECT
  USING (true);

CREATE POLICY "Admins podem gerenciar tipos de produto"
  ON public.product_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Trigger de updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.product_types;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.product_types
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- AJUSTES: registered_apps (campos usados no front/admin)
-- ========================================
ALTER TABLE public.registered_apps
  ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
  ADD COLUMN IF NOT EXISTS vercel_deployment_url TEXT,
  ADD COLUMN IF NOT EXISTS trial_period_days INTEGER,
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES public.product_types(id) ON DELETE SET NULL;

-- ========================================
-- AJUSTES: user_purchases (campos usados nas Edge Functions)
-- ========================================
ALTER TABLE public.user_purchases
  ADD COLUMN IF NOT EXISTS preference_id TEXT;

-- ========================================
-- TABELA: user_product_access
-- Centraliza "direito de acesso" (trial/pago/vitalício/admin)
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_product_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.registered_apps(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT,
  access_level TEXT NOT NULL DEFAULT 'trial' CHECK (access_level IN ('trial', 'monthly', 'annual', 'lifetime')),
  is_trial BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'revoked')),
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  purchase_id UUID REFERENCES public.user_purchases(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'SYSTEM',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, product_id, is_trial)
);

CREATE INDEX IF NOT EXISTS user_product_access_user_id_idx ON public.user_product_access(user_id);
CREATE INDEX IF NOT EXISTS user_product_access_product_id_idx ON public.user_product_access(product_id);
CREATE INDEX IF NOT EXISTS user_product_access_status_idx ON public.user_product_access(status);
CREATE INDEX IF NOT EXISTS user_product_access_purchase_id_idx ON public.user_product_access(purchase_id);

ALTER TABLE public.user_product_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios acessos"
  ON public.user_product_access FOR SELECT
  USING (auth.uid() = user_id);

-- Permite iniciar trial via app web (o usuário só consegue inserir para si)
CREATE POLICY "Usuários podem iniciar trial para si"
  ON public.user_product_access FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND is_trial = true
    AND status = 'active'
  );

CREATE POLICY "Admins podem gerenciar acessos"
  ON public.user_product_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Trigger updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.user_product_access;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_product_access
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Manter expires_at sincronizado para trials
CREATE OR REPLACE FUNCTION public.sync_user_product_access_expires_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_trial THEN
    NEW.expires_at := NEW.trial_ends_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_expires_at ON public.user_product_access;
CREATE TRIGGER sync_expires_at
  BEFORE INSERT OR UPDATE ON public.user_product_access
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_product_access_expires_at();

-- ========================================
-- TABELA: user_registration_confirmations
-- "cadastro confirmado" (email confirmado / OAuth / etc.)
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_registration_confirmations (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL DEFAULT 'LOGIN',
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.user_registration_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário pode ver seu próprio cadastro confirmado"
  ON public.user_registration_confirmations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode registrar sua própria confirmação"
  ON public.user_registration_confirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar sua própria confirmação"
  ON public.user_registration_confirmations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver/gerenciar confirmações"
  ON public.user_registration_confirmations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

DROP TRIGGER IF EXISTS set_updated_at ON public.user_registration_confirmations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_registration_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- TABELA: admin_alerts
-- Notificações de erros + "como solucionar"
-- ========================================
CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  solution TEXT,
  related_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_purchase_id UUID REFERENCES public.user_purchases(id) ON DELETE SET NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_alerts_created_at_idx ON public.admin_alerts(created_at);
CREATE INDEX IF NOT EXISTS admin_alerts_severity_idx ON public.admin_alerts(severity);
CREATE INDEX IF NOT EXISTS admin_alerts_resolved_at_idx ON public.admin_alerts(resolved_at);

ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Somente admins podem ver alertas"
  ON public.admin_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Somente admins podem gerenciar alertas"
  ON public.admin_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ========================================
-- RPC: get_users_with_emails (usado no AdminUsuarios.jsx)
-- Restrito a ADMIN
-- ========================================
CREATE OR REPLACE FUNCTION public.get_users_with_emails()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.email, u.email) AS email,
    p.full_name,
    p.phone,
    p.role,
    p.created_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_users_with_emails() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_users_with_emails() TO authenticated;

