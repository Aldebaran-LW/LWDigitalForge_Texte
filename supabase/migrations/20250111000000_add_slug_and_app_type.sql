-- ========================================
-- Padronização do Catálogo de Apps
-- Migration criada em: 2025-01-11
-- ========================================
-- 
-- Adiciona campos slug e app_type para tornar a tabela registered_apps
-- um catálogo profissional de aplicativos
-- ========================================

-- 1. Adiciona um 'slug' para URLs amigáveis (ex: jornadapro)
ALTER TABLE public.registered_apps 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Adiciona 'app_type' para sabermos se é um WebApp ou um InfoProduto
ALTER TABLE public.registered_apps 
ADD COLUMN IF NOT EXISTS app_type TEXT DEFAULT 'WEB_APP';

-- 3. Adiciona constraint para garantir valores válidos de app_type
DO $$
BEGIN
    -- Verificar se a constraint já existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'registered_apps' 
        AND constraint_name = 'registered_apps_app_type_check'
    ) THEN
        ALTER TABLE public.registered_apps 
        ADD CONSTRAINT registered_apps_app_type_check 
        CHECK (app_type IS NULL OR app_type IN ('WEB_APP', 'INFO_PRODUTO'));
    END IF;
END $$;

-- 4. Criar índice para slug (já que será usado em queries)
CREATE INDEX IF NOT EXISTS registered_apps_slug_idx ON public.registered_apps(slug) WHERE slug IS NOT NULL;

-- 5. Criar índice para app_type
CREATE INDEX IF NOT EXISTS registered_apps_app_type_idx ON public.registered_apps(app_type);

-- 6. Atualiza o JornadaPro com o slug correto (se existir)
-- NOTA: O ID usado aqui é o fornecido pelo usuário
-- Se o ID for diferente, será necessário ajustar
UPDATE public.registered_apps 
SET slug = 'jornadapro', app_type = 'WEB_APP' 
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
  AND (slug IS NULL OR slug != 'jornadapro');

-- Comentários nas novas colunas
COMMENT ON COLUMN public.registered_apps.slug IS 'Slug único para URLs amigáveis (ex: jornadapro). Usado para identificação única do app na URL.';
COMMENT ON COLUMN public.registered_apps.app_type IS 'Tipo do aplicativo: WEB_APP (aplicativo web) ou INFO_PRODUTO (infoproduto)';

