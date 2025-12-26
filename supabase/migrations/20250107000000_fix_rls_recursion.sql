-- ========================================
-- FIX: Corrigir recursão infinita nas políticas RLS
-- Migration criada em: 2025-01-07
-- ========================================

-- Remover políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

-- Criar função helper para verificar se usuário é admin (evita recursão)
-- SECURITY DEFINER permite que a função bypass RLS ao acessar profiles
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica diretamente na tabela profiles sem passar por RLS
  -- SECURITY DEFINER executa com privilégios do criador da função
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = user_id 
    AND profiles.role = 'ADMIN'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recriar política para admins verem todos os perfis (sem recursão)
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles FOR SELECT
    USING (
        public.is_admin(auth.uid())
    );

-- Recriar política para admins em registered_apps (sem recursão)
CREATE POLICY "Admins podem fazer tudo em apps"
    ON public.registered_apps FOR ALL
    USING (
        public.is_admin(auth.uid())
    );

-- Recriar política para admins em user_purchases (sem recursão)
CREATE POLICY "Admins podem ver todas as compras"
    ON public.user_purchases FOR SELECT
    USING (
        public.is_admin(auth.uid())
    );

