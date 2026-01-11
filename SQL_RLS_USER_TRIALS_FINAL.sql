-- ========================================
-- 🔒 POLÍTICAS RLS PARA user_trials
-- ========================================
-- SQL específico para garantir que usuários
-- possam criar e ver seus próprios trials
-- ========================================

-- Garantir que RLS está ativado
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 1. POLÍTICA: Usuários podem criar seu próprio trial
-- ========================================
-- Permite que usuários autenticados criem trials
-- A constraint UNIQUE(user_id, app_id) impede duplicação

DROP POLICY IF EXISTS "Users can insert their own trials" ON public.user_trials;
DROP POLICY IF EXISTS "Utilizadores podem criar o seu próprio trial" ON public.user_trials;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios trials" ON public.user_trials;

CREATE POLICY "Users can insert their own trials" 
ON public.user_trials 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 2. POLÍTICA: Usuários podem ver seu próprio trial
-- ========================================
-- Permite que usuários vejam seus próprios trials

DROP POLICY IF EXISTS "Users can view their own trials" ON public.user_trials;
DROP POLICY IF EXISTS "Utilizadores podem ver o seu próprio trial" ON public.user_trials;

CREATE POLICY "Users can view their own trials" 
ON public.user_trials 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- ========================================
-- 3. POLÍTICA: Admins podem gerenciar todos os trials
-- ========================================
-- Permite que admins façam SELECT, INSERT, UPDATE, DELETE
-- em trials de qualquer usuário

-- Verificar se a função is_admin() existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_admin' 
    AND pronargs = 0
  ) THEN
    -- Criar função is_admin() se não existir
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    STABLE
    AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'ADMIN'
      );
    END;
    $$;
  END IF;
END
$$;

DROP POLICY IF EXISTS "Admins podem gerenciar trials" ON public.user_trials;
DROP POLICY IF EXISTS "Admins can manage all trials" ON public.user_trials;

CREATE POLICY "Admins can manage all trials"
ON public.user_trials
FOR ALL
TO authenticated
USING (
  public.is_admin() = true
)
WITH CHECK (
  public.is_admin() = true
);

-- ========================================
-- 4. VERIFICAÇÕES (Para debug)
-- ========================================

-- Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_trials'
ORDER BY policyname, cmd;

-- Verificar se RLS está ativado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_trials'
  AND schemaname = 'public';

-- ========================================
-- ✅ CONCLUSÃO
-- ========================================
-- Após executar este SQL:
-- 1. ✅ Usuários podem criar seus próprios trials (INSERT)
-- 2. ✅ Usuários podem ver seus próprios trials (SELECT)
-- 3. ✅ Admins podem gerenciar todos os trials (ALL)
-- 4. ✅ RLS está ativado e funcionando
-- ========================================
