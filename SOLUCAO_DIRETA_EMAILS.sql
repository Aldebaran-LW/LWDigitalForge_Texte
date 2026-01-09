-- ========================================
-- Solução Direta: Adicionar coluna email em profiles
-- ========================================
-- Esta solução adiciona a coluna email em profiles
-- e cria um trigger para sincronizar automaticamente
-- ========================================

-- 1. Adicionar coluna email em profiles (se não existir)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email) 
WHERE email IS NOT NULL;

-- 3. Criar função para sincronizar email de auth.users para profiles
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar email em profiles quando auth.users for atualizado
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar trigger para sincronizar automaticamente
DROP TRIGGER IF EXISTS sync_email_to_profiles ON auth.users;
CREATE TRIGGER sync_email_to_profiles
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_email();

-- 5. Sincronizar emails existentes
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id
  AND (p.email IS NULL OR p.email != au.email);

-- ========================================
-- Agora a coluna email existe em profiles!
-- ========================================
-- O código pode buscar diretamente:
-- SELECT id, email, full_name, phone, role FROM profiles
-- ========================================
