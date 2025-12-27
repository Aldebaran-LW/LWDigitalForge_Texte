-- ========================================
-- FIX: Corrigir queries do portal para usar app_id
-- Migration criada em: 2025-01-08
-- ========================================

-- Adicionar coluna product_id como alias para app_id (opcional, para compatibilidade futura)
-- Por enquanto, o código foi atualizado para usar app_id diretamente

-- Verificar se registered_apps tem as colunas necessárias
ALTER TABLE public.registered_apps 
ADD COLUMN IF NOT EXISTS vercel_deployment_url TEXT,
ADD COLUMN IF NOT EXISTS github_repo_url TEXT;

-- Adicionar coluna purchased_at se não existir (para compatibilidade)
ALTER TABLE public.user_purchases 
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Atualizar purchased_at com created_at se estiver null
UPDATE public.user_purchases 
SET purchased_at = created_at 
WHERE purchased_at IS NULL;


