-- ========================================
-- FIX: Remover constraint antiga product_id se existir
-- Migration criada em: 2025-01-09
-- ========================================
-- 
-- Esta migration remove qualquer constraint ou coluna antiga relacionada a product_id
-- que possa estar causando conflito. A tabela user_purchases usa app_id, não product_id.
-- ========================================

-- Remover constraint de foreign key antiga se existir
DO $$
BEGIN
    -- Verificar e remover constraint de foreign key product_id
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND constraint_name = 'user_purchases_product_id_fkey'
    ) THEN
        ALTER TABLE public.user_purchases 
        DROP CONSTRAINT IF EXISTS user_purchases_product_id_fkey;
        RAISE NOTICE 'Constraint user_purchases_product_id_fkey removida';
    END IF;

    -- Verificar e remover coluna product_id se existir (não deveria existir, mas por segurança)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'product_id'
    ) THEN
        -- Primeiro remover constraint se existir
        ALTER TABLE public.user_purchases 
        DROP CONSTRAINT IF EXISTS user_purchases_product_id_fkey;
        
        -- Depois remover a coluna
        ALTER TABLE public.user_purchases 
        DROP COLUMN IF EXISTS product_id;
        
        RAISE NOTICE 'Coluna product_id removida (não deveria existir)';
    ELSE
        RAISE NOTICE 'Coluna product_id não existe (correto)';
    END IF;
END $$;

