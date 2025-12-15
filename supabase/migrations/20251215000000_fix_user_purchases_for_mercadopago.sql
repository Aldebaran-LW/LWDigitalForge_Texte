-- ========================================
-- FIX: alinhar user_purchases com MercadoPago
-- Migration criada em: 2025-12-15
-- ========================================

-- Coluna usada para armazenar o ID da preferência (MercadoPago)
ALTER TABLE public.user_purchases
ADD COLUMN IF NOT EXISTS preference_id TEXT;

CREATE INDEX IF NOT EXISTS user_purchases_preference_id_idx
  ON public.user_purchases(preference_id);

-- Permitir que o próprio usuário crie sua compra (necessário para Edge Function usando ANON + JWT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_purchases'
      AND policyname = 'Usuários podem criar suas próprias compras'
  ) THEN
    CREATE POLICY "Usuários podem criar suas próprias compras"
      ON public.user_purchases
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Permitir que o próprio usuário atualize SOMENTE compras pendentes sem pagamento (para setar preference_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_purchases'
      AND policyname = 'Usuários podem atualizar compras pendentes'
  ) THEN
    CREATE POLICY "Usuários podem atualizar compras pendentes"
      ON public.user_purchases
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (
        auth.uid() = user_id
        AND status = 'PENDING'
        AND payment_id IS NULL
      );
  END IF;
END $$;

