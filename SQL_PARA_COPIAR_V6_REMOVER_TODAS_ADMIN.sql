-- ========================================
-- FIX V6: Remover TODAS as políticas que verificam admin via profiles
-- Migration criada em: 2025-01-07
-- Versão 6: Remove políticas específicas que causam recursão
-- ========================================

-- ========================================
-- REMOVER POLÍTICAS PROBLEMÁTICAS DE user_purchases
-- ========================================

DROP POLICY IF EXISTS "user_purchases_admin_delete" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_insert" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_select_all" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_admin_update" ON public.user_purchases;
DROP POLICY IF EXISTS "user_purchases_select_own" ON public.user_purchases;
DROP POLICY IF EXISTS "Nenhuma escrita pública" ON public.user_purchases;

-- Manter apenas as políticas simples (sem verificação de admin)
-- "Permitir inserção de compras" - OK (não verifica admin)
-- "Usuários podem ver suas próprias compras" - OK (não verifica admin)

-- ========================================
-- VERIFICAR E REMOVER POLÍTICAS DE registered_apps
-- ========================================

-- Remover qualquer política que verifica admin via profiles
DROP POLICY IF EXISTS "registered_apps_admin_all" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_delete" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_insert" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_select" ON public.registered_apps;
DROP POLICY IF EXISTS "registered_apps_admin_update" ON public.registered_apps;

-- ========================================
-- VERIFICAR E REMOVER POLÍTICAS DE profiles
-- ========================================

-- Remover qualquer política que verifica admin via profiles (recursão)
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete" ON public.profiles;

-- ========================================
-- REMOVER TODAS AS POLÍTICAS QUE FAZEM SELECT EM profiles
-- Usando um loop para garantir que todas sejam removidas
-- ========================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remover políticas de user_purchases que fazem SELECT em profiles
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_purchases' 
        AND (qual LIKE '%profiles%' OR qual LIKE '%SELECT 1%' OR with_check LIKE '%profiles%')
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.user_purchases';
        RAISE NOTICE 'Removida política: %', r.policyname;
    END LOOP;
    
    -- Remover políticas de registered_apps que fazem SELECT em profiles
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'registered_apps' 
        AND (qual LIKE '%profiles%' OR qual LIKE '%SELECT 1%' OR with_check LIKE '%profiles%')
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.registered_apps';
        RAISE NOTICE 'Removida política: %', r.policyname;
    END LOOP;
    
    -- Remover políticas de profiles que fazem SELECT em profiles (recursão direta)
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND (qual LIKE '%profiles%' OR qual LIKE '%SELECT 1%' OR qual LIKE '%EXISTS%')
        AND policyname != 'Usuários podem ver seus próprios perfis'
        AND policyname != 'Usuários podem atualizar seus próprios perfis'
        AND policyname != 'Sistema pode inserir novos perfis'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
        RAISE NOTICE 'Removida política: %', r.policyname;
    END LOOP;
END $$;

-- ========================================
-- GARANTIR QUE APENAS POLÍTICAS SIMPLES EXISTAM
-- ========================================

-- Se as políticas simples não existirem, criá-las
-- (Isso garante que temos pelo menos as políticas básicas)

-- Profiles: usuários veem seus próprios perfis
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Usuários podem ver seus próprios perfis'
    ) THEN
        CREATE POLICY "Usuários podem ver seus próprios perfis"
            ON public.profiles FOR SELECT
            USING (auth.uid() = id);
    END IF;
END $$;

-- Profiles: usuários podem atualizar seus próprios perfis
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Usuários podem atualizar seus próprios perfis'
    ) THEN
        CREATE POLICY "Usuários podem atualizar seus próprios perfis"
            ON public.profiles FOR UPDATE
            USING (auth.uid() = id);
    END IF;
END $$;

-- Profiles: sistema pode inserir novos perfis
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Sistema pode inserir novos perfis'
    ) THEN
        CREATE POLICY "Sistema pode inserir novos perfis"
            ON public.profiles FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- Registered apps: todos podem ver apps ativos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'registered_apps' 
        AND policyname = 'Todos podem ver apps ativos'
    ) THEN
        CREATE POLICY "Todos podem ver apps ativos"
            ON public.registered_apps FOR SELECT
            USING (is_active = true);
    END IF;
END $$;

-- User purchases: usuários veem suas próprias compras
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_purchases' 
        AND policyname = 'Usuários podem ver suas próprias compras'
    ) THEN
        CREATE POLICY "Usuários podem ver suas próprias compras"
            ON public.user_purchases FOR SELECT
            USING (user_id = auth.uid());
    END IF;
END $$;

-- User purchases: permitir inserção de compras
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_purchases' 
        AND policyname = 'Permitir inserção de compras'
    ) THEN
        CREATE POLICY "Permitir inserção de compras"
            ON public.user_purchases FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- ========================================
-- NOTA FINAL:
-- Todas as políticas que verificam admin via SELECT em profiles foram removidas.
-- A verificação de role ADMIN será feita no código da aplicação.
-- ========================================






