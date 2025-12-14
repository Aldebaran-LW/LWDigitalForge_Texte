-- ========================================
-- SUPORTE: Sincronização com Firebase Auth
-- Migration criada em: 2025-01-06
-- ========================================
-- 
-- Esta migration adiciona suporte para sincronização
-- bidirecional entre Supabase Auth e Firebase Auth.
-- 
-- A sincronização é feita principalmente no frontend,
-- mas esta migration adiciona campos auxiliares e
-- documentação para facilitar a integração.
-- ========================================

-- Adicionar campo para rastrear sincronização com Firebase (opcional)
-- Isso ajuda a evitar sincronizações duplicadas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS firebase_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS firebase_uid TEXT;

-- Criar índice para busca rápida por Firebase UID
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid 
ON public.profiles(firebase_uid) 
WHERE firebase_uid IS NOT NULL;

-- Comentário explicativo
COMMENT ON COLUMN public.profiles.firebase_synced_at IS 
'Timestamp da última sincronização bem-sucedida com Firebase Auth. NULL se nunca foi sincronizado.';

COMMENT ON COLUMN public.profiles.firebase_uid IS 
'UID do usuário no Firebase Auth. Usado para vincular contas entre Supabase e Firebase.';

-- ========================================
-- FUNÇÃO AUXILIAR: Marcar perfil como sincronizado
-- ========================================
CREATE OR REPLACE FUNCTION public.mark_profile_firebase_synced(
    profile_id UUID,
    firebase_user_id TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET 
        firebase_synced_at = NOW(),
        firebase_uid = firebase_user_id,
        updated_at = NOW()
    WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.mark_profile_firebase_synced IS 
'Marca um perfil como sincronizado com Firebase Auth. Usado pelo frontend após sincronização bem-sucedida.';

-- ========================================
-- NOTAS DE CONFIGURAÇÃO
-- ========================================
-- 
-- Para habilitar sincronização bidirecional completa:
-- 
-- 1. CONFIGURAR FIREBASE:
--    - Crie um projeto no Firebase Console
--    - Habilite Firebase Authentication
--    - Configure Google OAuth Provider
--    - Crie uma Service Account e baixe as credenciais
-- 
-- 2. CONFIGURAR VARIÁVEIS DE AMBIENTE (Frontend):
--    - VITE_FIREBASE_API_KEY
--    - VITE_FIREBASE_AUTH_DOMAIN
--    - VITE_FIREBASE_PROJECT_ID
--    - VITE_FIREBASE_STORAGE_BUCKET
--    - VITE_FIREBASE_MESSAGING_SENDER_ID
--    - VITE_FIREBASE_APP_ID
-- 
-- 3. CONFIGURAR VARIÁVEIS DE AMBIENTE (Edge Function - opcional):
--    - FIREBASE_PROJECT_ID
--    - FIREBASE_PRIVATE_KEY
--    - FIREBASE_CLIENT_EMAIL
-- 
-- 4. A sincronização funciona da seguinte forma:
--    a) Supabase -> Firebase: Quando usuário se cadastra no Supabase,
--       o frontend chama syncSupabaseToFirebase()
--    b) Firebase -> Supabase: Quando usuário se cadastra no Firebase,
--       o listener do Firebase chama syncFirebaseToSupabase()
--    c) Google OAuth: Quando usuário faz login com Google via Supabase,
--       o AuthCallback sincroniza com Firebase
-- 
-- 5. A sincronização é não-bloqueante: se falhar, não impede
--    o cadastro/login do usuário no sistema principal.
-- 
-- ========================================

