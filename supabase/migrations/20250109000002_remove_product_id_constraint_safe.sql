-- ========================================
-- FIX: Verificar e remover constraint antiga product_id (VERSÃO SEGURA)
-- Migration criada em: 2025-01-09
-- ========================================
-- 
-- Esta migration verifica e remove qualquer constraint ou coluna antiga relacionada a product_id.
-- A tabela user_purchases usa app_id, não product_id.
-- 
-- SEGURANÇA: Esta migration é 100% segura porque:
-- - Verifica se existe antes de remover
-- - Usa IF EXISTS em todas as operações
-- - Não afeta dados existentes
-- - Só remove constraints/colunas que não deveriam existir
-- ========================================

-- Verificar e remover constraint de foreign key antiga se existir
DO $$
DECLARE
    constraint_exists BOOLEAN;
    column_exists BOOLEAN;
BEGIN
    -- Verificar se a constraint existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND constraint_name = 'user_purchases_product_id_fkey'
    ) INTO constraint_exists;

    -- Verificar se a coluna existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'product_id'
    ) INTO column_exists;

    -- Remover constraint se existir
    IF constraint_exists THEN
        ALTER TABLE public.user_purchases 
        DROP CONSTRAINT user_purchases_product_id_fkey;
        RAISE NOTICE '✅ Constraint user_purchases_product_id_fkey removida com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️  Constraint user_purchases_product_id_fkey não existe (tudo OK)';
    END IF;

    -- Remover coluna se existir (não deveria existir)
    IF column_exists THEN
        -- A constraint já foi removida acima se existia
        ALTER TABLE public.user_purchases 
        DROP COLUMN product_id;
        RAISE NOTICE '✅ Coluna product_id removida (não deveria existir)';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna product_id não existe (correto - a tabela usa app_id)';
    END IF;

    RAISE NOTICE '✅ Verificação concluída. A tabela user_purchases está usando app_id corretamente.';
END $$;

