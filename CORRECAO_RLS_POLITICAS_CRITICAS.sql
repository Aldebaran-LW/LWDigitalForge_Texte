-- ========================================
-- 🔒 CORREÇÃO CRÍTICA: Políticas RLS
-- ========================================
-- Este SQL corrige as políticas RLS que estão impedindo
-- a liberação manual pelo admin e o uso do trial gratuito
-- ========================================

-- ========================================
-- 1. A função is_admin() já existe
-- ========================================

-- A função is_admin() já foi criada na migration 20250110000000_fix_admin_email_access.sql
-- Ela usa SET LOCAL para bypass RLS e verifica se o usuário tem role = 'ADMIN'
-- NÃO precisamos criar novamente, apenas usaremos ela nas políticas abaixo

-- ========================================
-- 2. Política para Admins inserirem compras manuais
-- ========================================

-- Remover política existente se houver
DROP POLICY IF EXISTS "Admins podem inserir compras manuais" ON public.user_purchases;

-- Criar política para permitir que Admins insiram compras
CREATE POLICY "Admins podem inserir compras manuais"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() = true
);

-- ========================================
-- 3. Política para usuários criarem seu próprio trial
-- ========================================

-- Remover política existente se houver
DROP POLICY IF EXISTS "Utilizadores podem criar o seu próprio trial" ON public.user_trials;

-- Criar política para permitir que usuários criem seu próprio trial
CREATE POLICY "Utilizadores podem criar o seu próprio trial"
ON public.user_trials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- ========================================
-- 4. Política adicional: Admins podem gerenciar trials
-- ========================================

-- Remover política existente se houver
DROP POLICY IF EXISTS "Admins podem gerenciar trials" ON public.user_trials;

-- Criar política para permitir que Admins insiram/atualizem trials
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
-- 5. Verificar se RLS está ativado
-- ========================================

-- Ativar RLS se não estiver ativo (geralmente já está)
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. Verificar políticas criadas
-- ========================================

-- Verificar políticas de user_purchases
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
ORDER BY policyname;

-- Verificar políticas de user_trials
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_trials'
ORDER BY policyname;

-- ========================================
-- ✅ CONCLUSÃO
-- ========================================
-- Após executar este SQL:
-- 1. ✅ Admins podem inserir compras manualmente
-- 2. ✅ Usuários podem criar seu próprio trial
-- 3. ✅ Admins podem gerenciar trials de qualquer usuário
-- 4. ✅ RLS está ativado e funcionando
-- ========================================
