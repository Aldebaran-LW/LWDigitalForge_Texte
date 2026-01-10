-- ========================================
-- MELHORIA: Sincronização com Google OAuth
-- Migration criada em: 2025-01-05
-- ========================================
-- 
-- Esta migration melhora a função handle_new_user() para
-- capturar corretamente os dados do Google OAuth quando
-- um usuário faz login/cadastro com Google.
-- ========================================

-- Atualizar a função para melhor captura de dados do Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_avatar_url TEXT;
    user_email TEXT;
BEGIN
    -- Garantir que o email está disponível
    user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
    
    -- Capturar nome completo do usuário
    -- O Google OAuth fornece 'name' ou 'full_name' em raw_user_meta_data
    -- Também verifica user_metadata que pode ter dados diferentes
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.user_metadata->>'full_name',
        NEW.user_metadata->>'name',
        SPLIT_PART(user_email, '@', 1) -- Fallback: usar parte antes do @ do email
    );
    
    -- Capturar URL do avatar/foto do perfil
    -- O Google OAuth fornece 'picture' ou 'avatar_url'
    user_avatar_url := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        NEW.user_metadata->>'avatar_url',
        NEW.user_metadata->>'picture'
    );
    
    -- Inserir ou atualizar o perfil
    -- Usa ON CONFLICT para evitar erros se o perfil já existir
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        user_email,
        user_full_name,
        user_avatar_url,
        'USER' -- Role padrão para novos usuários
    )
    ON CONFLICT (id) 
    DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_new_user() IS 
'Cria ou atualiza automaticamente o perfil do usuário quando um novo usuário é criado no auth.users. 
Suporta dados de autenticação por email/senha e OAuth (Google). 
Captura nome completo e avatar do Google OAuth quando disponível.';

-- ========================================
-- NOTA: Configuração do Google OAuth no Supabase
-- ========================================
-- 
-- Para habilitar login com Google no Supabase:
-- 
-- 1. Acesse o Supabase Dashboard: https://app.supabase.com/
-- 2. Selecione seu projeto
-- 3. Vá em Authentication > Providers
-- 4. Encontre "Google" e clique para habilitar
-- 5. Configure as credenciais OAuth do Google:
--    - Client ID (do Google Cloud Console)
--    - Client Secret (do Google Cloud Console)
-- 6. Adicione a URL de redirecionamento autorizada:
--    https://[seu-projeto-ref].supabase.co/auth/v1/callback
-- 
-- No Google Cloud Console:
-- 1. Acesse: https://console.cloud.google.com/
-- 2. Crie um projeto ou selecione um existente
-- 3. Vá em "APIs & Services" > "Credentials"
-- 4. Crie credenciais OAuth 2.0 Client ID
-- 5. Tipo: Web application
-- 6. Adicione as URLs autorizadas:
--    - JavaScript origins: https://[seu-projeto-ref].supabase.co
--    - Redirect URIs: https://[seu-projeto-ref].supabase.co/auth/v1/callback
-- ========================================

















