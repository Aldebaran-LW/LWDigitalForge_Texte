-- Home hero carousel (Macofel-style banners) + galeria opcional em produtos/portfólio
-- Bucket Storage: Hero-LW_Digital_Forge (público leitura). Executar no SQL Editor se a migration não correr.

-- ========== Tabela slides da home ==========
CREATE TABLE IF NOT EXISTS public.lw_home_hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sort_order INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    body_text TEXT,
    href TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS lw_home_hero_slides_sort_idx
    ON public.lw_home_hero_slides (sort_order ASC, is_active);

ALTER TABLE public.lw_home_hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active hero slides" ON public.lw_home_hero_slides;
DROP POLICY IF EXISTS "Admins full access hero slides" ON public.lw_home_hero_slides;

CREATE POLICY "Public read active hero slides"
    ON public.lw_home_hero_slides FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins full access hero slides"
    ON public.lw_home_hero_slides FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ========== Galeria extra (carrossel no card): produtos ==========
ALTER TABLE public.registered_apps
    ADD COLUMN IF NOT EXISTS hero_gallery_urls JSONB DEFAULT '[]'::jsonb;

-- ========== Galeria extra: portfólio (se a tabela existir) ==========
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'portfolio'
    ) THEN
        ALTER TABLE public.portfolio
            ADD COLUMN IF NOT EXISTS hero_gallery_urls JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- ========== Bucket público hero ==========
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'Hero-LW_Digital_Forge',
    'Hero-LW_Digital_Forge',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas storage (admin autenticado)
DROP POLICY IF EXISTS "Hero LW admins insert" ON storage.objects;
DROP POLICY IF EXISTS "Hero LW admins update" ON storage.objects;
DROP POLICY IF EXISTS "Hero LW admins delete" ON storage.objects;

CREATE POLICY "Hero LW admins insert"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'Hero-LW_Digital_Forge'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Hero LW admins update"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'Hero-LW_Digital_Forge'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Hero LW admins delete"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'Hero-LW_Digital_Forge'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );
