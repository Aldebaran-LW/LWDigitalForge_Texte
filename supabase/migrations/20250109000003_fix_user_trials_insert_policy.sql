-- ========================================
-- FIX: Permitir que usuários criem seus próprios trials
-- Migration criada em: 2025-01-09
-- ========================================
-- 
-- Esta migration adiciona uma política RLS que permite usuários criarem
-- seus próprios trials na tabela user_trials.
-- 
-- SEGURANÇA: A política garante que:
-- - Usuários só podem criar trials para si mesmos (user_id = auth.uid())
-- - Não afeta outras políticas existentes
-- ========================================

-- Remover política antiga se existir (para evitar duplicação)
DROP POLICY IF EXISTS "Usuários podem criar seus próprios trials" ON public.user_trials;

-- Criar política que permite usuários inserirem seus próprios trials
CREATE POLICY "Usuários podem criar seus próprios trials"
    ON public.user_trials FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Comentário explicativo
COMMENT ON POLICY "Usuários podem criar seus próprios trials" ON public.user_trials IS 
'Permite que usuários autenticados criem trials para si mesmos. A política garante que user_id = auth.uid() para segurança.';

