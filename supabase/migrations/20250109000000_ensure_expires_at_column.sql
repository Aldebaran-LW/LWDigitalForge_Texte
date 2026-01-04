-- ========================================
-- FIX: Garantir que a coluna expires_at existe em user_purchases
-- Migration criada em: 2025-01-09
-- ========================================
-- 
-- Esta migration garante que a coluna expires_at existe na tabela user_purchases.
-- Isso resolve o erro "Could not find the 'expires_at' column of 'user_purchases' in the schema cache"
-- 
-- SEGURANÇA: Esta migration é 100% segura porque:
-- - Usa IF NOT EXISTS (não adiciona se já existir)
-- - Não remove nenhuma coluna existente
-- - Não altera dados existentes
-- - Não quebra funcionalidades existentes
-- ========================================

-- Verificar e adicionar coluna expires_at se não existir
-- Esta operação é idempotente (pode ser executada múltiplas vezes sem problemas)
DO $$
BEGIN
    -- Verificar se a coluna já existe antes de adicionar
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'expires_at'
    ) THEN
        -- Adicionar coluna apenas se não existir
        ALTER TABLE public.user_purchases 
        ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
        
        RAISE NOTICE 'Coluna expires_at adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna expires_at já existe, pulando criação';
    END IF;
END $$;

-- Adicionar comentário na coluna (se não existir)
COMMENT ON COLUMN public.user_purchases.expires_at IS 
'Data de expiração para assinaturas mensais/anuais. NULL para compras lifetime ou trial.';

-- Criar índice se não existir (para melhor performance em queries de expiração)
-- Este índice é opcional e não afeta funcionalidades existentes
CREATE INDEX IF NOT EXISTS user_purchases_expires_at_idx 
ON public.user_purchases(expires_at) 
WHERE expires_at IS NOT NULL;

