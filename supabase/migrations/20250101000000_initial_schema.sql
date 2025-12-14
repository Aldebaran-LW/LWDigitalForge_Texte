-- ========================================
-- LWDIGITALFORGE - INITIAL SCHEMA
-- Migration criada em: 2025-01-01
-- ========================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA: profiles
-- Perfis de usuários estendendo auth.users
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "Sistema pode inserir novos perfis"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- ========================================
-- TABELA: registered_apps
-- Produtos/Apps registrados na plataforma
-- ========================================
CREATE TABLE IF NOT EXISTS public.registered_apps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    image_url TEXT,
    price_monthly INTEGER, -- Preço em centavos
    price_annual INTEGER,  -- Preço em centavos
    price_lifetime INTEGER, -- Preço em centavos
    is_active BOOLEAN DEFAULT true,
    category TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    download_url TEXT,
    documentation_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS registered_apps_name_idx ON public.registered_apps(name);
CREATE INDEX IF NOT EXISTS registered_apps_is_active_idx ON public.registered_apps(is_active);
CREATE INDEX IF NOT EXISTS registered_apps_category_idx ON public.registered_apps(category);

-- RLS
ALTER TABLE public.registered_apps ENABLE ROW LEVEL SECURITY;

-- Políticas para registered_apps
CREATE POLICY "Todos podem ver apps ativos"
    ON public.registered_apps FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins podem fazer tudo em apps"
    ON public.registered_apps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ========================================
-- TABELA: user_purchases
-- Compras realizadas pelos usuários
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    app_id UUID REFERENCES public.registered_apps(id) ON DELETE SET NULL,
    purchase_type TEXT NOT NULL CHECK (purchase_type IN ('MONTHLY', 'ANNUAL', 'LIFETIME', 'TRIAL')),
    amount_paid INTEGER NOT NULL, -- Valor em centavos
    payment_method TEXT,
    payment_id TEXT, -- ID da transação no gateway de pagamento
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'CANCELLED', 'REFUNDED')),
    expires_at TIMESTAMP WITH TIME ZONE, -- Para assinaturas mensais/anuais
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS user_purchases_user_id_idx ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS user_purchases_app_id_idx ON public.user_purchases(app_id);
CREATE INDEX IF NOT EXISTS user_purchases_status_idx ON public.user_purchases(status);

-- RLS
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas para user_purchases
CREATE POLICY "Usuários podem ver suas próprias compras"
    ON public.user_purchases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as compras"
    ON public.user_purchases FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ========================================
-- TABELA: user_trials
-- Testes/trials de produtos
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_trials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    app_id UUID REFERENCES public.registered_apps(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, app_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS user_trials_user_id_idx ON public.user_trials(user_id);
CREATE INDEX IF NOT EXISTS user_trials_app_id_idx ON public.user_trials(app_id);
CREATE INDEX IF NOT EXISTS user_trials_expires_at_idx ON public.user_trials(expires_at);

-- RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Políticas para user_trials
CREATE POLICY "Usuários podem ver seus próprios trials"
    ON public.user_trials FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar todos os trials"
    ON public.user_trials FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ========================================
-- FUNÇÕES E TRIGGERS
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.registered_apps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_purchases
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- DADOS INICIAIS (SEED)
-- ========================================

-- Comentário: Adicione aqui dados iniciais se necessário
-- INSERT INTO public.registered_apps (name, description, ...) VALUES (...);

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';
COMMENT ON TABLE public.registered_apps IS 'Produtos/aplicativos disponíveis na plataforma';
COMMENT ON TABLE public.user_purchases IS 'Histórico de compras dos usuários';
COMMENT ON TABLE public.user_trials IS 'Períodos de teste dos usuários para produtos';







