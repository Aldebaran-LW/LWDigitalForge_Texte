-- ========================================
-- FIX: Garantir que admins vejam emails na tabela profiles
-- Migration criada em: 2025-01-10
-- ========================================

-- IMPORTANTE: Remover políticas PRIMEIRO (elas dependem da função)
-- Depois remover a função, e então recriar tudo

-- Remover políticas que dependem da função is_admin()
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;

-- Agora podemos remover a função sem erro de dependência
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(UUID);

-- Criar função que verifica role usando SET LOCAL para bypass RLS
-- Esta abordagem evita recursão usando configuração de sessão
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Se não houver usuário autenticado, retornar false
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Desabilita temporariamente RLS para esta consulta
  SET LOCAL row_security = off;
  
  -- Verifica o role do usuário atual diretamente
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  -- Restaura RLS
  SET LOCAL row_security = on;
  
  RETURN COALESCE(user_role = 'ADMIN', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recriar política combinada que permite:
-- 1. Admins vejam TODOS os perfis com TODOS os campos (incluindo email)
-- 2. Usuários vejam apenas seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles FOR SELECT
    USING (public.is_admin() = true);

-- Garantir que as políticas estão aplicadas corretamente
COMMENT ON POLICY "Usuários podem ver seus próprios perfis" ON public.profiles IS 
    'Permite que usuários vejam apenas seus próprios perfis';
COMMENT ON POLICY "Admins podem ver todos os perfis" ON public.profiles IS 
    'Permite que admins vejam todos os perfis com todos os campos, incluindo email';







