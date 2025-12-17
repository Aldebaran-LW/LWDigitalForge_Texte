-- ========================================
-- ALINHAMENTO: Schema x Frontend x Edge Functions
-- Migration criada em: 2025-12-17
-- ========================================
--
-- Objetivos:
-- 1) Garantir que `registered_apps` tenha os campos usados no app (URLs + trial).
-- 2) Garantir que `user_purchases` tenha `preference_id` (Mercado Pago).
-- 3) Corrigir políticas RLS para permitir:
--    - Admin CRUD em `registered_apps`
--    - Admin registrar/grant de compras (`user_purchases`)
--    - Usuário iniciar trial (`user_trials`)
-- ========================================

-- ========================================
-- 1) registered_apps: colunas usadas no frontend/admin
-- ========================================
-- Garantir extensões comuns (para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE public.registered_apps
  ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
  ADD COLUMN IF NOT EXISTS vercel_deployment_url TEXT,
  ADD COLUMN IF NOT EXISTS trial_period_days INTEGER,
  -- Alguns ambientes antigos podem não ter este flag
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN;

UPDATE public.registered_apps
SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE public.registered_apps
  ALTER COLUMN is_active SET DEFAULT true;

-- Garantir valores consistentes (null => 0) e constraint não-negativa
UPDATE public.registered_apps
SET trial_period_days = 0
WHERE trial_period_days IS NULL;

ALTER TABLE public.registered_apps
  ALTER COLUMN trial_period_days SET DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'registered_apps_trial_period_days_non_negative'
      AND conrelid = 'public.registered_apps'::regclass
  ) THEN
    ALTER TABLE public.registered_apps
      ADD CONSTRAINT registered_apps_trial_period_days_non_negative
      CHECK (trial_period_days >= 0);
  END IF;
END $$;

-- ========================================
-- 2) user_purchases: campo usado pelo checkout (Mercado Pago)
-- ========================================
ALTER TABLE public.user_purchases
  ADD COLUMN IF NOT EXISTS preference_id TEXT;

CREATE INDEX IF NOT EXISTS user_purchases_preference_id_idx
  ON public.user_purchases(preference_id);

-- ========================================
-- 3) RLS: helpers e políticas alinhadas ao app
-- ========================================

-- ========================================
-- 3.1) Garantir tabelas mínimas que o app usa
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, app_id)
);

CREATE INDEX IF NOT EXISTS user_trials_user_id_idx ON public.user_trials(user_id);
CREATE INDEX IF NOT EXISTS user_trials_app_id_idx ON public.user_trials(app_id);
CREATE INDEX IF NOT EXISTS user_trials_expires_at_idx ON public.user_trials(expires_at);

ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- ---- profiles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Sistema pode inserir novos perfis" ON public.profiles;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Necessário para fallback do AuthCallback.jsx (quando o trigger não cria o perfil)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_select_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "profiles_admin_update_all"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (true);

-- ---- registered_apps
DROP POLICY IF EXISTS "Todos podem ver apps ativos" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;

DROP POLICY IF EXISTS "registered_apps_public_select_active" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_select_all" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_insert" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_update" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_delete" ON public.registered_apps;

CREATE POLICY "registered_apps_public_select_active"
  ON public.registered_apps FOR SELECT
  USING (is_active = true);

CREATE POLICY "registered_apps_admin_select_all"
  ON public.registered_apps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "registered_apps_admin_insert"
  ON public.registered_apps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "registered_apps_admin_update"
  ON public.registered_apps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "registered_apps_admin_delete"
  ON public.registered_apps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- ---- user_purchases
DROP POLICY IF EXISTS "Usuários podem ver suas próprias compras" ON public.user_purchases;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

DROP POLICY IF EXISTS "user_purchases_select_own" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_select_all" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_insert" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_update" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_delete" ON public.user_purchases;

CREATE POLICY "user_purchases_select_own"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_purchases_admin_select_all"
  ON public.user_purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- Necessário para grants no painel admin (AdminUsuarios.jsx)
CREATE POLICY "user_purchases_admin_insert"
  ON public.user_purchases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "user_purchases_admin_update"
  ON public.user_purchases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (true);

CREATE POLICY "user_purchases_admin_delete"
  ON public.user_purchases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- ---- user_trials
DROP POLICY IF EXISTS "Usuários podem ver seus próprios trials" ON public.user_trials;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os trials" ON public.user_trials;

DROP POLICY IF EXISTS "user_trials_select_own" ON public.user_trials;
DROP POLICY IF EXISTS "user_trials_insert_own" ON public.user_trials;
DROP POLICY IF EXISTS "user_trials_update_own" ON public.user_trials;
DROP POLICY IF EXISTS "user_trials_admin_all" ON public.user_trials;

CREATE POLICY "user_trials_select_own"
  ON public.user_trials FOR SELECT
  USING (auth.uid() = user_id);

-- Necessário para iniciar teste grátis no frontend
CREATE POLICY "user_trials_insert_own"
  ON public.user_trials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permite que o usuário marque o trial como inativo (opcional/útil)
CREATE POLICY "user_trials_update_own"
  ON public.user_trials FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_trials_admin_all"
  ON public.user_trials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (true);

