-- ========================================
-- FIX V3 FINAL: Solução definitiva para recursão RLS
-- Migration criada em: 2025-01-07
-- Versão 3: Remove verificação de admin das políticas SELECT
-- ========================================

-- IMPORTANTE: Remover políticas PRIMEIRO (elas dependem da função)
-- Remover TODAS as políticas problemáticas ANTES de remover a função
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

-- Agora podemos remover as funções (as políticas já foram removidas)
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- SOLUÇÃO SIMPLIFICADA: Remover verificação de admin das políticas SELECT
-- Para admins, vamos usar uma abordagem diferente (verificação no código ou política separada)

-- Política para profiles: apenas usuários veem seus próprios perfis
-- (A verificação de admin será feita no código da aplicação)
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Política para registered_apps: todos podem ver apps ativos
CREATE POLICY "Todos podem ver apps ativos"
    ON public.registered_apps FOR SELECT
    USING (is_active = true);

-- Política para user_purchases: usuários veem suas próprias compras
CREATE POLICY "Usuários podem ver suas próprias compras"
    ON public.user_purchases FOR SELECT
    USING (user_id = auth.uid());

-- Para operações de admin (INSERT, UPDATE, DELETE), criar políticas separadas
-- que não dependem de verificação de role (será verificado no código)

-- Política para admins inserirem/atualizarem produtos (sem verificação de role na política)
-- A verificação será feita no código da aplicação antes de chamar o Supabase
CREATE POLICY "Permitir inserção de apps" 
    ON public.registered_apps FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de apps"
    ON public.registered_apps FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir deleção de apps"
    ON public.registered_apps FOR DELETE
    USING (true);

-- NOTA: A verificação de role ADMIN será feita no código da aplicação
-- antes de executar operações de INSERT/UPDATE/DELETE
-- Isso evita completamente a recursão nas políticas RLS

