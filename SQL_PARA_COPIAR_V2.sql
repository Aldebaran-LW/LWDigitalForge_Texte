-- ========================================
-- FIX V2: Corrigir recursão infinita nas políticas RLS
-- Migration criada em: 2025-01-07
-- Versão 2: Usa SET LOCAL row_security = off para evitar recursão
-- ========================================

-- Remover função anterior que ainda causa recursão
DROP FUNCTION IF EXISTS public.is_admin(UUID);
DROP FUNCTION IF EXISTS public.is_admin();

-- Remover políticas problemáticas novamente (caso ainda existam)
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

-- Criar função que verifica role usando SET LOCAL para bypass RLS
-- Esta abordagem evita recursão usando configuração de sessão
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Desabilita temporariamente RLS para esta consulta
  SET LOCAL row_security = off;
  
  -- Verifica o role do usuário atual diretamente
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role = 'ADMIN', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recriar política para admins verem todos os perfis
-- Agora usando a função sem parâmetro que evita recursão
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles FOR SELECT
    USING (
        public.is_admin() OR auth.uid() = id
    );

-- Recriar política para admins em registered_apps
CREATE POLICY "Admins podem fazer tudo em apps"
    ON public.registered_apps FOR ALL
    USING (
        public.is_admin() OR is_active = true
    );

-- Recriar política para admins em user_purchases
CREATE POLICY "Admins podem ver todas as compras"
    ON public.user_purchases FOR SELECT
    USING (
        public.is_admin() OR user_id = auth.uid()
    );

