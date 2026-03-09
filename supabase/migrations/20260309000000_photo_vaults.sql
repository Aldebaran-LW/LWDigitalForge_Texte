-- PhotoVault: Partições de memória protegidas por senha
-- Cada cofre corresponde a uma pasta no Google Drive do usuário

CREATE TABLE IF NOT EXISTS public.photo_vaults (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  drive_folder_id TEXT DEFAULT NULL,
  color TEXT DEFAULT 'blue',
  icon TEXT DEFAULT 'lock',
  photo_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_photo_vaults_user_id ON public.photo_vaults(user_id);

-- Habilitar RLS
ALTER TABLE public.photo_vaults ENABLE ROW LEVEL SECURITY;

-- Políticas: usuários só veem e manipulam seus próprios cofres
CREATE POLICY "photo_vaults_select_own" ON public.photo_vaults
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "photo_vaults_insert_own" ON public.photo_vaults
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photo_vaults_update_own" ON public.photo_vaults
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "photo_vaults_delete_own" ON public.photo_vaults
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_photo_vaults_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER photo_vaults_updated_at
  BEFORE UPDATE ON public.photo_vaults
  FOR EACH ROW EXECUTE FUNCTION update_photo_vaults_updated_at();
