-- ========================================
-- FIX V4 COMPLETO: Remover TODAS as políticas e recriar do zero
-- Migration criada em: 2025-01-07
-- Versão 4: Remove TODAS as políticas existentes e recria apenas as necessárias
-- ========================================

-- ========================================
-- PASSO 1: Remover TODAS as políticas existentes
-- ========================================

-- Remover políticas da tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Sistema pode inserir novos perfis" ON public.profiles;

-- Remover políticas da tabela registered_apps
DROP POLICY IF EXISTS "Todos podem ver apps ativos" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Permitir inserção de apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Permitir atualização de apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Permitir deleção de apps" ON public.registered_apps;

-- Remover políticas da tabela user_purchases
DROP POLICY IF EXISTS "Usuários podem ver suas próprias compras" ON public.user_purchases;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

-- ========================================
-- PASSO 2: Remover funções antigas
-- ========================================

DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ========================================
-- PASSO 3: Recriar políticas SIMPLES (sem recursão)
-- ========================================

-- POLÍTICAS PARA profiles
-- Usuários podem ver seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Sistema pode inserir novos perfis (para triggers)
CREATE POLICY "Sistema pode inserir novos perfis"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- POLÍTICAS PARA registered_apps
-- Todos podem ver apps ativos (público)
CREATE POLICY "Todos podem ver apps ativos"
    ON public.registered_apps FOR SELECT
    USING (is_active = true);

-- Permitir inserção (verificação de admin no código)
CREATE POLICY "Permitir inserção de apps"
    ON public.registered_apps FOR INSERT
    WITH CHECK (true);

-- Permitir atualização (verificação de admin no código)
CREATE POLICY "Permitir atualização de apps"
    ON public.registered_apps FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Permitir deleção (verificação de admin no código)
CREATE POLICY "Permitir deleção de apps"
    ON public.registered_apps FOR DELETE
    USING (true);

-- POLÍTICAS PARA user_purchases
-- Usuários podem ver suas próprias compras
CREATE POLICY "Usuários podem ver suas próprias compras"
    ON public.user_purchases FOR SELECT
    USING (user_id = auth.uid());

-- Permitir inserção de compras (para checkout)
CREATE POLICY "Permitir inserção de compras"
    ON public.user_purchases FOR INSERT
    WITH CHECK (true);

-- ========================================
-- NOTA IMPORTANTE:
-- A verificação de role ADMIN será feita no código da aplicação
-- antes de executar operações administrativas.
-- Isso evita completamente a recursão nas políticas RLS.
-- ========================================

