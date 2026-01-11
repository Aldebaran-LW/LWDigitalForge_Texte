-- ========================================
-- 🔒 CORREÇÃO RLS FINAL (Versão Otimizada)
-- ========================================
-- Este SQL corrige as políticas RLS para permitir:
-- 1. Admins inserirem compras manuais
-- 2. Usuários criarem seus próprios trials
-- 3. Admins gerenciarem trials
-- ========================================

-- ========================================
-- 1. Política para Admins inserirem compras manuais
-- ========================================

-- Remover política existente se houver
DROP POLICY IF EXISTS "Admins podem inserir compras manuais" ON public.user_purchases;

-- Criar política para permitir que Admins insiram compras
-- Usa função is_admin() existente (mais eficiente)
CREATE POLICY "Admins podem inserir compras manuais"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() = true
);

-- ========================================
-- 2. Política para usuários criarem seu próprio trial
-- ========================================

-- Remover política existente se houver
DROP POLICY IF EXISTS "Utilizadores podem criar o seu próprio trial" ON public.user_trials;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios trials" ON public.user_trials;

-- Criar política para permitir que usuários criem seu próprio trial
-- Nota: A verificação de duplicado é feita pela constraint UNIQUE(user_id, app_id)
-- então não precisa verificar NOT EXISTS aqui
CREATE POLICY "Utilizadores podem criar o seu próprio trial"
ON public.user_trials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- ========================================
-- 3. Política adicional: Admins podem gerenciar trials
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
-- 4. Garantir que RLS está ativado
-- ========================================

ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. Verificar políticas criadas
-- ========================================

-- Verificar políticas de user_purchases
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
  AND cmd = 'INSERT'
ORDER BY policyname;

-- Verificar políticas de user_trials
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_trials'
  AND cmd = 'INSERT'
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
