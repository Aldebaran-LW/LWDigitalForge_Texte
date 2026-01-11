-- ========================================
-- Migration: Adicionar colunas is_liberado e data_vencimento em profiles
-- ========================================
-- Data: 2025-01-12
-- Descrição: Adiciona colunas para indicar se o usuário está liberado
--            e a data de vencimento da assinatura/trial/vitalício
-- ========================================

-- 1. Adicionar colunas na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_liberado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_vencimento TIMESTAMP WITH TIME ZONE;

-- 2. Criar função para calcular is_liberado e data_vencimento
CREATE OR REPLACE FUNCTION public.calculate_user_liberado_status(p_user_id UUID)
RETURNS TABLE (
  is_liberado BOOLEAN,
  data_vencimento TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql 
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_has_access BOOLEAN := false;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_has_lifetime BOOLEAN := false;
BEGIN
  -- Verificar se tem compra vitalícia (LIFETIME)
  SELECT EXISTS(
    SELECT 1
    FROM public.user_purchases
    WHERE user_id = p_user_id
      AND app_id IN (SELECT id FROM public.registered_apps WHERE is_active = true)
      AND status = 'APPROVED'
      AND purchase_type = 'LIFETIME'
  ) INTO v_has_lifetime;

  -- Se tem vitalício, está liberado e data é 2099-01-01
  IF v_has_lifetime THEN
    RETURN QUERY SELECT true, '2099-01-01 00:00:00+00'::TIMESTAMP WITH TIME ZONE;
    RETURN;
  END IF;

  -- Verificar se tem compra/assinatura ativa (não vitalício)
  SELECT 
    EXISTS(
      SELECT 1
      FROM public.user_purchases
      WHERE user_id = p_user_id
        AND app_id IN (SELECT id FROM public.registered_apps WHERE is_active = true)
        AND status = 'APPROVED'
        AND purchase_type IN ('MONTHLY', 'ANNUAL')
        AND (expires_at IS NULL OR expires_at > NOW())
    ),
    MAX(expires_at)
  INTO v_has_access, v_expires_at
  FROM public.user_purchases
  WHERE user_id = p_user_id
    AND app_id IN (SELECT id FROM public.registered_apps WHERE is_active = true)
    AND status = 'APPROVED'
    AND purchase_type IN ('MONTHLY', 'ANNUAL')
    AND (expires_at IS NULL OR expires_at > NOW());

  -- Se tem compra ativa, usar a data de expiração
  IF v_has_access AND v_expires_at IS NOT NULL THEN
    RETURN QUERY SELECT true, v_expires_at;
    RETURN;
  END IF;

  -- Verificar se tem trial ativo (CONDIÇÃO 3)
  SELECT 
    EXISTS(
      SELECT 1
      FROM public.user_trials
      WHERE user_id = p_user_id
        AND app_id IN (SELECT id FROM public.registered_apps WHERE is_active = true)
        AND is_active = true
        AND expires_at > NOW()
    ),
    MAX(expires_at)
  INTO v_has_access, v_expires_at
  FROM public.user_trials
  WHERE user_id = p_user_id
    AND app_id IN (SELECT id FROM public.registered_apps WHERE is_active = true)
    AND is_active = true
    AND expires_at > NOW();

  -- Se tem trial ativo, usar a data de expiração do trial
  IF v_has_access AND v_expires_at IS NOT NULL THEN
    RETURN QUERY SELECT true, v_expires_at;
    RETURN;
  END IF;

  -- Se nenhuma das condições for atendida, não está liberado
  RETURN QUERY SELECT false, NULL::TIMESTAMP WITH TIME ZONE;
END;
$$;

-- 3. Criar função para atualizar is_liberado e data_vencimento de um usuário
CREATE OR REPLACE FUNCTION public.update_user_liberado_status(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status RECORD;
BEGIN
  -- Calcular status
  SELECT * INTO v_status
  FROM public.calculate_user_liberado_status(p_user_id);

  -- Atualizar profiles
  UPDATE public.profiles
  SET 
    is_liberado = v_status.is_liberado,
    data_vencimento = v_status.data_vencimento
  WHERE id = p_user_id;
END;
$$;

-- 4. Criar função para atualizar todos os usuários (útil para inicialização)
CREATE OR REPLACE FUNCTION public.update_all_users_liberado_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user RECORD;
BEGIN
  FOR v_user IN SELECT id FROM public.profiles
  LOOP
    PERFORM public.update_user_liberado_status(v_user.id);
  END LOOP;
END;
$$;

-- 5. Criar trigger para atualizar automaticamente quando houver mudanças em user_purchases
CREATE OR REPLACE FUNCTION public.trigger_update_liberado_on_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.update_user_liberado_status(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS update_liberado_on_purchase_insert ON public.user_purchases;
CREATE TRIGGER update_liberado_on_purchase_insert
  AFTER INSERT OR UPDATE OR DELETE ON public.user_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_liberado_on_purchase();

-- 6. Criar trigger para atualizar automaticamente quando houver mudanças em user_trials
CREATE OR REPLACE FUNCTION public.trigger_update_liberado_on_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.update_user_liberado_status(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS update_liberado_on_trial_insert ON public.user_trials;
CREATE TRIGGER update_liberado_on_trial_insert
  AFTER INSERT OR UPDATE OR DELETE ON public.user_trials
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_liberado_on_trial();

-- 7. (Opcional) Atualizar todos os usuários existentes
-- Descomente a linha abaixo para atualizar todos os usuários existentes:
-- SELECT public.update_all_users_liberado_status();

-- Comentários
COMMENT ON COLUMN public.profiles.is_liberado IS 'Indica se o usuário está liberado (tem acesso a pelo menos um app ativo via compra/trial/vitalício)';
COMMENT ON COLUMN public.profiles.data_vencimento IS 'Data de vencimento da assinatura/trial. Para vitalício, usa 2099-01-01';
