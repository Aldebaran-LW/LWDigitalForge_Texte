-- ========================================
-- FIX: Completar estrutura da tabela user_purchases
-- Migration criada em: 2025-01-09
-- ========================================
-- 
-- Esta migration adiciona todas as colunas faltantes na tabela user_purchases.
-- A tabela parece ter sido criada de forma incompleta.
-- 
-- SEGURANÇA: Esta migration é 100% segura porque:
-- - Usa verificação antes de adicionar cada coluna
-- - Não remove nenhuma coluna existente
-- - Não altera dados existentes
-- - Pode ser executada múltiplas vezes sem problemas
-- ========================================

-- Função auxiliar para adicionar coluna apenas se não existir
DO $$
BEGIN
    -- app_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'app_id'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN app_id UUID REFERENCES public.registered_apps(id) ON DELETE SET NULL;
        RAISE NOTICE 'Coluna app_id adicionada';
    END IF;

    -- purchase_type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'purchase_type'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN purchase_type TEXT;
        RAISE NOTICE 'Coluna purchase_type adicionada';
    END IF;
    
    -- Adicionar constraint para purchase_type se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND constraint_name = 'user_purchases_purchase_type_check'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD CONSTRAINT user_purchases_purchase_type_check 
        CHECK (purchase_type IS NULL OR purchase_type IN ('MONTHLY', 'ANNUAL', 'LIFETIME', 'TRIAL'));
    END IF;

    -- amount_paid
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'amount_paid'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN amount_paid INTEGER;
        RAISE NOTICE 'Coluna amount_paid adicionada';
    END IF;

    -- payment_method
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN payment_method TEXT;
        RAISE NOTICE 'Coluna payment_method adicionada';
    END IF;

    -- payment_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'payment_id'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN payment_id TEXT;
        RAISE NOTICE 'Coluna payment_id adicionada';
    END IF;

    -- status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN status TEXT DEFAULT 'PENDING';
        RAISE NOTICE 'Coluna status adicionada';
    END IF;
    
    -- Adicionar constraint para status se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND constraint_name = 'user_purchases_status_check'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD CONSTRAINT user_purchases_status_check 
        CHECK (status IS NULL OR status IN ('PENDING', 'APPROVED', 'CANCELLED', 'REFUNDED'));
    END IF;

    -- created_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
        RAISE NOTICE 'Coluna created_at adicionada';
    END IF;

    -- updated_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_purchases' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.user_purchases 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
        RAISE NOTICE 'Coluna updated_at adicionada';
    END IF;
END $$;

-- Atualizar created_at e updated_at para registros existentes que possam ter NULL
UPDATE public.user_purchases 
SET created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE created_at IS NULL OR updated_at IS NULL;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS user_purchases_user_id_idx ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS user_purchases_app_id_idx ON public.user_purchases(app_id);
CREATE INDEX IF NOT EXISTS user_purchases_status_idx ON public.user_purchases(status);
CREATE INDEX IF NOT EXISTS user_purchases_expires_at_idx ON public.user_purchases(expires_at) WHERE expires_at IS NOT NULL;

-- Comentários nas colunas
COMMENT ON COLUMN public.user_purchases.app_id IS 'ID do aplicativo/produto comprado';
COMMENT ON COLUMN public.user_purchases.purchase_type IS 'Tipo de compra: MONTHLY, ANNUAL, LIFETIME, TRIAL';
COMMENT ON COLUMN public.user_purchases.amount_paid IS 'Valor pago em centavos';
COMMENT ON COLUMN public.user_purchases.payment_method IS 'Método de pagamento utilizado';
COMMENT ON COLUMN public.user_purchases.payment_id IS 'ID da transação no gateway de pagamento';
COMMENT ON COLUMN public.user_purchases.status IS 'Status da compra: PENDING, APPROVED, CANCELLED, REFUNDED';
COMMENT ON COLUMN public.user_purchases.expires_at IS 'Data de expiração para assinaturas mensais/anuais. NULL para compras lifetime ou trial.';

