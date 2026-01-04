-- ========================================
-- FIX V5: Desabilitar RLS temporariamente para testar
-- Migration criada em: 2025-01-07
-- Versão 5: Desabilita RLS completamente para isolar o problema
-- ========================================

-- IMPORTANTE: Esta é uma solução TEMPORÁRIA para testar
-- Se funcionar, sabemos que o problema está nas políticas
-- Depois precisaremos recriar as políticas corretamente

-- ========================================
-- PASSO 1: Remover TODAS as políticas
-- ========================================

-- Remover TODAS as políticas de profiles
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- Remover TODAS as políticas de registered_apps
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'registered_apps') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.registered_apps';
    END LOOP;
END $$;

-- Remover TODAS as políticas de user_purchases
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_purchases') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.user_purchases';
    END LOOP;
END $$;

-- ========================================
-- PASSO 2: Remover funções
-- ========================================

DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ========================================
-- PASSO 3: DESABILITAR RLS TEMPORARIAMENTE
-- ========================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registered_apps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases DISABLE ROW LEVEL SECURITY;

-- ========================================
-- NOTA: 
-- Esta solução desabilita RLS completamente.
-- Use apenas para TESTE. Se funcionar, sabemos que o problema
-- está nas políticas. Depois precisaremos recriar as políticas
-- de forma mais cuidadosa.
-- ========================================






