-- ========================================
-- 🔒 CORREÇÃO RLS CONSOLIDADA FINAL
-- ========================================
-- Este SQL corrige TODAS as políticas RLS necessárias
-- para permitir liberação manual e trial gratuito
-- ========================================
-- Data: 2025-01-XX
-- Versão: Final Consolidada
-- ========================================

-- ========================================
-- 1. GARANTIR FUNÇÃO is_admin() EXISTE
-- ========================================
-- A função is_admin() SEM parâmetros é a versão correta
-- Ela verifica se o usuário autenticado (auth.uid()) é ADMIN

DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(UUID);

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

-- Comentário para documentação
COMMENT ON FUNCTION public.is_admin() IS 
'Verifica se o usuário autenticado (auth.uid()) tem role ADMIN. Retorna true se for ADMIN, false caso contrário.';

-- ========================================
-- 2. POLÍTICA: Admins podem inserir compras manuais
-- ========================================
-- Permite que usuários com role ADMIN insiram registros
-- na tabela user_purchases (para liberação manual)

DROP POLICY IF EXISTS "Admins podem inserir compras manuais" ON public.user_purchases;
DROP POLICY IF EXISTS "Admins podem inserir compras" ON public.user_purchases;
DROP POLICY IF EXISTS "admin_insert_purchases" ON public.user_purchases;

CREATE POLICY "Admins podem inserir compras manuais"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() = true
);

-- ========================================
-- 3. POLÍTICA: Usuários podem criar seu próprio trial
-- ========================================
-- Permite que usuários criem trials para si mesmos
-- A constraint UNIQUE(user_id, app_id) impede duplicação

DROP POLICY IF EXISTS "Utilizadores podem criar o seu próprio trial" ON public.user_trials;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios trials" ON public.user_trials;
DROP POLICY IF EXISTS "users_create_own_trial" ON public.user_trials;

CREATE POLICY "Utilizadores podem criar o seu próprio trial"
ON public.user_trials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- ========================================
-- 4. POLÍTICA: Admins podem gerenciar trials
-- ========================================
-- Permite que admins façam INSERT, UPDATE, DELETE e SELECT
-- em trials de qualquer usuário (para gerenciamento)

DROP POLICY IF EXISTS "Admins podem gerenciar trials" ON public.user_trials;
DROP POLICY IF EXISTS "admin_manage_trials" ON public.user_trials;

CREATE POLICY "Admins podem gerenciar trials"
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
-- 5. GARANTIR QUE RLS ESTÁ ATIVADO
-- ========================================

ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. VERIFICAÇÕES (OPCIONAL - Para debug)
-- ========================================

-- Verificar se a função is_admin() funciona
-- Execute como usuário ADMIN: deve retornar true
-- Execute como usuário USER: deve retornar false
-- SELECT public.is_admin();

-- Verificar políticas de user_purchases (INSERT)
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
  AND cmd = 'INSERT'
ORDER BY policyname;

-- Verificar políticas de user_trials (INSERT)
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_trials'
  AND cmd = 'INSERT'
ORDER BY policyname;

-- Verificar se RLS está ativado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('user_purchases', 'user_trials')
  AND schemaname = 'public';

-- ========================================
-- ✅ CONCLUSÃO
-- ========================================
-- Após executar este SQL:
-- 1. ✅ Função is_admin() criada/atualizada
-- 2. ✅ Admins podem inserir compras manualmente
-- 3. ✅ Usuários podem criar seu próprio trial
-- 4. ✅ Admins podem gerenciar trials de qualquer usuário
-- 5. ✅ RLS está ativado e funcionando
-- ========================================
-- PRÓXIMOS PASSOS:
-- 1. Teste a liberação manual no AdminUsuarios.jsx
-- 2. Teste o trial gratuito no PortalProdutos.jsx
-- 3. Verifique os logs se houver problemas
-- ========================================
