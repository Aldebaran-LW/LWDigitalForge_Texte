-- ========================================
-- Função RPC: get_user_apps_status
-- ========================================
-- Retorna todos os apps com o status de acesso do usuário
-- Faz join entre registered_apps, user_purchases e user_trials
-- ========================================
-- Data: 2025-01-12
-- ========================================

CREATE OR REPLACE FUNCTION get_user_apps_status(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  image_url TEXT,
  vercel_deployment_url TEXT,
  has_access BOOLEAN,
  access_type TEXT, -- 'paid', 'trial' ou NULL
  days_remaining INTEGER,
  trial_period_days INTEGER
) 
LANGUAGE plpgsql 
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ra.id,
    ra.name,
    ra.slug,
    ra.description,
    ra.image_url,
    ra.vercel_deployment_url,
    -- Tem acesso se houver compra aprovada OU trial ativo
    (up.id IS NOT NULL OR ut.id IS NOT NULL) AS has_access,
    -- Define o tipo de acesso prioritário (prioriza paid sobre trial)
    CASE 
      WHEN up.id IS NOT NULL THEN 'paid'
      WHEN ut.id IS NOT NULL THEN 'trial'
      ELSE NULL
    END AS access_type,
    -- Calcula dias restantes apenas para o Trial
    CASE 
      WHEN ut.id IS NOT NULL THEN 
        GREATEST(0, EXTRACT(DAY FROM (ut.expires_at - now()))::INTEGER)
      ELSE NULL
    END AS days_remaining,
    -- Período de trial padrão (pode vir da tabela registered_apps se existir)
    COALESCE(ra.trial_period_days, 30)::INTEGER AS trial_period_days
  FROM registered_apps ra
  -- Join com Compras (Pagas ou Vitalícias)
  LEFT JOIN LATERAL (
    SELECT up.id
    FROM user_purchases up
    WHERE up.app_id = ra.id 
      AND up.user_id = p_user_id 
      AND up.status = 'APPROVED'
      AND (
        up.purchase_type = 'LIFETIME' 
        OR up.expires_at IS NULL 
        OR up.expires_at > now()
      )
    LIMIT 1
  ) up ON true
  -- Join com Trials Ativos
  LEFT JOIN LATERAL (
    SELECT ut.id, ut.expires_at
    FROM user_trials ut
    WHERE ut.app_id = ra.id 
      AND ut.user_id = p_user_id 
      AND ut.is_active = true 
      AND ut.expires_at > now()
    ORDER BY ut.expires_at DESC
    LIMIT 1
  ) ut ON true
  WHERE ra.is_active = true
  ORDER BY ra.name ASC;
END;
$$;

-- Comentário para documentação
COMMENT ON FUNCTION get_user_apps_status(UUID) IS 
'Retorna todos os apps ativos com o status de acesso do usuário. Inclui informações sobre compras aprovadas e trials ativos.';

-- Permissão para usuários autenticados
GRANT EXECUTE ON FUNCTION get_user_apps_status(UUID) TO authenticated;
