-- ============================================
-- SOLUÇÃO COMPLETA: CORRIGIR is_liberado
-- ============================================

-- =============================================
-- PARTE 1: LIBERAR TODOS OS USUÁRIOS EXISTENTES
-- =============================================

UPDATE profiles
SET 
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE is_liberado = false OR is_liberado IS NULL;

-- Verificar quantos foram liberados
SELECT 
    'Usuários liberados' as status,
    count(*) as total
FROM profiles
WHERE is_liberado = true;


-- =============================================
-- PARTE 2: ALTERAR DEFAULT DA TABELA
-- =============================================
-- Agora novos usuários já serão liberados automaticamente!

ALTER TABLE public.profiles 
ALTER COLUMN is_liberado SET DEFAULT true;

-- Verificar se a alteração funcionou
SELECT 
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name = 'is_liberado';


-- =============================================
-- PARTE 3: CRIAR/ATUALIZAR TRIGGER AUTO LIBERAÇÃO
-- =============================================
-- Garantir que novos perfis sejam criados já liberados

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role, is_liberado, data_vencimento)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone',
        'USER',
        true,  -- ← JÁ LIBERADO!
        '2099-01-01 00:00:00'::timestamp  -- ← ACESSO VITALÍCIO!
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        is_liberado = true,  -- ← Sempre liberado
        data_vencimento = '2099-01-01 00:00:00'::timestamp;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar novo trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =============================================
-- PARTE 4: TORNAR UM USUÁRIO EM ADMIN
-- =============================================
-- Escolha o email do usuário que será ADMIN

UPDATE profiles
SET role = 'ADMIN'
WHERE email = 'lucas005wfj@gmail.com'; -- ← MUDE PARA SEU EMAIL

-- Verificar
SELECT email, role, is_liberado, data_vencimento
FROM profiles
WHERE role = 'ADMIN';


-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================

SELECT 
    email,
    role,
    is_liberado,
    data_vencimento,
    CASE 
        WHEN role = 'ADMIN' THEN '✅ Acesso ADMIN total'
        WHEN is_liberado = true THEN '✅ Acesso USER liberado'
        ELSE '❌ Acesso bloqueado'
    END as status
FROM profiles
ORDER BY created_at DESC;


-- =============================================
-- TESTE: CRIAR NOVO USUÁRIO
-- =============================================
-- Para testar se o trigger funciona, crie um novo usuário
-- no Supabase Dashboard > Authentication > Users > Add User
-- Ele deve ser automaticamente criado com is_liberado = true


-- =============================================
-- ROLLBACK (SE QUISER VOLTAR)
-- =============================================
-- Se quiser voltar ao comportamento antigo (NÃO RECOMENDADO):

-- ALTER TABLE public.profiles 
-- ALTER COLUMN is_liberado SET DEFAULT false;
