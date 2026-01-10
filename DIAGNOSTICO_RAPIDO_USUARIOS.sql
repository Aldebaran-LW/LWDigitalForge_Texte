-- ========================================
-- Script de Diagnóstico Rápido: Usuários Não Aparecem na Área Admin
-- ========================================
-- Execute este script no SQL Editor do Supabase para diagnosticar o problema
-- ========================================

-- 1. Verificar se você tem role ADMIN
-- (Substitua 'seu-email@exemplo.com' pelo seu email)
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN role = 'ADMIN' THEN '✅ Você é ADMIN'
        ELSE '❌ Você NÃO é ADMIN - Precisa atualizar role'
    END as status
FROM profiles 
WHERE email = 'seu-email@exemplo.com';

-- 2. Verificar se a migration foi aplicada (política existe)
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Política existe - Migration aplicada'
        ELSE '❌ Política NÃO existe - Migration NÃO aplicada'
    END as status_migration,
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'profiles'
  AND policyname = 'Admins podem ver todos os perfis'
GROUP BY policyname, roles, cmd;

-- 3. Verificar se função is_admin() existe
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Função is_admin() existe'
        ELSE '❌ Função is_admin() NÃO existe'
    END as status_funcao,
    proname as function_name
FROM pg_proc 
WHERE proname = 'is_admin';

-- 4. Verificar total de usuários no banco
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as total_admins,
    COUNT(CASE WHEN role = 'USER' THEN 1 END) as total_users,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Nenhum usuário no banco'
        ELSE '✅ Existem usuários no banco'
    END as status
FROM profiles;

-- 5. Listar todos os usuários (se você for admin, deve ver todos)
-- Se não aparecer nada, você não tem permissão de admin
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 20;

-- 6. Verificar todas as políticas RLS de profiles
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN policyname = 'Admins podem ver todos os perfis' THEN '✅ Política de admin'
        WHEN policyname = 'Usuários podem ver seus próprios perfis' THEN '✅ Política de usuário'
        ELSE '⚠️ Outra política'
    END as status
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 7. Testar função is_admin() (deve retornar true se você for admin)
-- Nota: Isso só funciona se você estiver autenticado
SELECT 
    auth.uid() as current_user_id,
    public.is_admin() as is_admin_result,
    CASE 
        WHEN public.is_admin() = true THEN '✅ Você é reconhecido como ADMIN'
        ELSE '❌ Você NÃO é reconhecido como ADMIN'
    END as status_funcao;

-- ========================================
-- RESUMO DO DIAGNÓSTICO
-- ========================================
-- Se algum dos itens acima mostrar ❌, esse é o problema:
--
-- 1. ❌ Você NÃO é ADMIN
--    → Solução: UPDATE profiles SET role = 'ADMIN' WHERE id = 'seu-user-id';
--
-- 2. ❌ Política NÃO existe
--    → Solução: Aplicar migration 20250110000000_fix_admin_email_access.sql
--
-- 3. ❌ Função is_admin() NÃO existe
--    → Solução: Aplicar migration 20250110000000_fix_admin_email_access.sql
--
-- 4. ❌ Nenhum usuário no banco
--    → Solução: Criar usuários através do cadastro
--
-- 5. Nenhum resultado na listagem
--    → Solução: Verificar itens 1, 2 e 3 acima
-- ========================================



