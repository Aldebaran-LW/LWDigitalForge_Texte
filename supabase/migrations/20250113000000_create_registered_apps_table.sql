-- ========================================
-- Migration: Criar tabela registered_apps
-- ========================================
-- Data: 2025-01-13
-- Descrição: Cria a tabela registered_apps com todas as colunas,
--            constraints e índices necessários
-- ========================================

-- Criar tabela registered_apps (se não existir)
CREATE TABLE IF NOT EXISTS public.registered_apps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  name text NOT NULL,
  description text NULL,
  github_repo_url text NULL,
  vercel_deployment_url text NULL,
  image_url text NULL,
  updated_at timestamp with time zone NULL,
  price_in_cents integer NULL DEFAULT 0,
  price_monthly bigint NULL,
  price_annual bigint NULL,
  price_lifetime bigint NULL,
  trial_period_days integer NULL DEFAULT 0,
  features text[] NULL,
  detailed_description text NULL,
  is_active boolean NULL DEFAULT true,
  slug text NULL,
  app_type text NULL DEFAULT 'WEB_APP'::text,
  CONSTRAINT registered_apps_pkey PRIMARY KEY (id),
  CONSTRAINT registered_apps_slug_key UNIQUE (slug),
  CONSTRAINT registered_apps_app_type_check CHECK (
    (
      (app_type IS NULL)
      OR (
        app_type = ANY (ARRAY['WEB_APP'::text, 'INFO_PRODUTO'::text])
      )
    )
  ),
  CONSTRAINT registered_apps_trial_period_days_non_negative CHECK ((trial_period_days >= 0))
) TABLESPACE pg_default;

-- Criar índices
CREATE INDEX IF NOT EXISTS registered_apps_slug_idx 
ON public.registered_apps 
USING btree (slug) 
TABLESPACE pg_default
WHERE (slug IS NOT NULL);

CREATE INDEX IF NOT EXISTS registered_apps_app_type_idx 
ON public.registered_apps 
USING btree (app_type) 
TABLESPACE pg_default;

-- Comentários nas colunas
COMMENT ON TABLE public.registered_apps IS 'Tabela que armazena os aplicativos registrados no sistema';
COMMENT ON COLUMN public.registered_apps.slug IS 'Slug único para URLs amigáveis (ex: jornadapro). Usado para identificação única do app na URL.';
COMMENT ON COLUMN public.registered_apps.app_type IS 'Tipo do aplicativo: WEB_APP (aplicativo web) ou INFO_PRODUTO (infoproduto)';
COMMENT ON COLUMN public.registered_apps.trial_period_days IS 'Dias de teste gratuito oferecidos para o aplicativo';
