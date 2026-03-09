-- ========================================
-- PHOTOVAULT - Cofres e historico de transferencias
-- Migration criada em: 2026-03-09
-- ========================================

-- ========================================
-- TABELA: photo_vaults
-- Cada cofre representa uma particao protegida por senha
-- e vinculada a uma pasta dedicada no Google Drive
-- ========================================
CREATE TABLE IF NOT EXISTS public.photo_vaults (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#2563eb',
    drive_folder_id TEXT NOT NULL UNIQUE,
    drive_folder_name TEXT NOT NULL,
    drive_folder_url TEXT,
    password_hash TEXT NOT NULL,
    is_archived BOOLEAN DEFAULT false,
    last_unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS photo_vaults_user_name_unique_idx
    ON public.photo_vaults (user_id, lower(name));

CREATE INDEX IF NOT EXISTS photo_vaults_user_id_idx
    ON public.photo_vaults (user_id);

CREATE INDEX IF NOT EXISTS photo_vaults_archived_idx
    ON public.photo_vaults (is_archived);

ALTER TABLE public.photo_vaults ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios podem ver seus proprios cofres" ON public.photo_vaults;
CREATE POLICY "Usuarios podem ver seus proprios cofres"
    ON public.photo_vaults FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem criar seus proprios cofres" ON public.photo_vaults;
CREATE POLICY "Usuarios podem criar seus proprios cofres"
    ON public.photo_vaults FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem atualizar seus proprios cofres" ON public.photo_vaults;
CREATE POLICY "Usuarios podem atualizar seus proprios cofres"
    ON public.photo_vaults FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem excluir seus proprios cofres" ON public.photo_vaults;
CREATE POLICY "Usuarios podem excluir seus proprios cofres"
    ON public.photo_vaults FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

DROP TRIGGER IF EXISTS set_photo_vaults_updated_at ON public.photo_vaults;
CREATE TRIGGER set_photo_vaults_updated_at
    BEFORE UPDATE ON public.photo_vaults
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.photo_vaults IS 'Cofres/particoes do PhotoVault protegidos por senha e vinculados a pastas do Google Drive.';
COMMENT ON COLUMN public.photo_vaults.password_hash IS 'Hash PBKDF2 gerado no cliente; a senha em texto puro nunca e armazenada.';

-- ========================================
-- TABELA: photo_vault_transfers
-- Historico resumido das transferencias Google Photos -> Drive
-- ========================================
CREATE TABLE IF NOT EXISTS public.photo_vault_transfers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vault_id UUID REFERENCES public.photo_vaults(id) ON DELETE CASCADE NOT NULL,
    google_account_email TEXT,
    source_label TEXT DEFAULT 'google_photos',
    total_items INTEGER DEFAULT 0 NOT NULL,
    transferred_items INTEGER DEFAULT 0 NOT NULL,
    failed_items INTEGER DEFAULT 0 NOT NULL,
    total_bytes BIGINT DEFAULT 0 NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED'
        CHECK (status IN ('COMPLETED', 'PARTIAL', 'FAILED')),
    error_message TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS photo_vault_transfers_user_id_idx
    ON public.photo_vault_transfers (user_id);

CREATE INDEX IF NOT EXISTS photo_vault_transfers_vault_id_idx
    ON public.photo_vault_transfers (vault_id);

CREATE INDEX IF NOT EXISTS photo_vault_transfers_created_at_idx
    ON public.photo_vault_transfers (created_at DESC);

ALTER TABLE public.photo_vault_transfers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios podem ver seu historico do PhotoVault" ON public.photo_vault_transfers;
CREATE POLICY "Usuarios podem ver seu historico do PhotoVault"
    ON public.photo_vault_transfers FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem registrar historico do PhotoVault" ON public.photo_vault_transfers;
CREATE POLICY "Usuarios podem registrar historico do PhotoVault"
    ON public.photo_vault_transfers FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem remover seu historico do PhotoVault" ON public.photo_vault_transfers;
CREATE POLICY "Usuarios podem remover seu historico do PhotoVault"
    ON public.photo_vault_transfers FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

COMMENT ON TABLE public.photo_vault_transfers IS 'Historico de transferencias do PhotoVault executadas pelo proprio usuario.';
