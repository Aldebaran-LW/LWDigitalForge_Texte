# Verificação do Banco de Dados para o Portal do Usuário

## Tabelas Necessárias

O portal do usuário requer as seguintes tabelas:

### 1. `profiles`
- **Uso**: Exibe informações do usuário (nome, email, avatar)
- **Status**: ✅ Já existe na migration inicial
- **Colunas necessárias**: `id`, `email`, `full_name`, `avatar_url`, `role`

### 2. `registered_apps`
- **Uso**: Lista de produtos disponíveis
- **Status**: ✅ Já existe na migration inicial
- **Colunas necessárias**: `id`, `name`, `description`, `image_url`, `price_monthly`, `price_annual`, `price_lifetime`, `vercel_deployment_url`, `github_repo_url`

### 3. `user_purchases`
- **Uso**: Histórico de compras do usuário
- **Status**: ⚠️ Verificar coluna de relacionamento
- **Problema potencial**: O código usa `product_id` mas a migration inicial pode ter `app_id`
- **Colunas necessárias**: `id`, `user_id`, `product_id` (ou `app_id`), `purchased_at`

### 4. `user_product_access`
- **Uso**: Controle de acesso a produtos (testes e assinaturas)
- **Status**: ❓ Verificar se existe
- **Colunas necessárias**: 
  - `id`
  - `user_id` (UUID, FK para profiles)
  - `product_id` (UUID, FK para registered_apps)
  - `is_trial` (BOOLEAN)
  - `status` (TEXT: 'active', 'expired', 'cancelled')
  - `access_level` (TEXT)
  - `created_at` (TIMESTAMP)
  - `expires_at` (TIMESTAMP)
  - `product_name` (TEXT, opcional)

## Verificações Necessárias

1. **Verificar se `user_product_access` existe**
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name = 'user_product_access'
   );
   ```

2. **Verificar coluna em `user_purchases`**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_schema = 'public' 
   AND table_name = 'user_purchases' 
   AND column_name IN ('product_id', 'app_id');
   ```

3. **Verificar se `registered_apps` tem as colunas necessárias**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_schema = 'public' 
   AND table_name = 'registered_apps' 
   AND column_name IN ('vercel_deployment_url', 'github_repo_url');
   ```

## Possíveis Ações

### Se `user_product_access` não existir, criar:
```sql
CREATE TABLE IF NOT EXISTS public.user_product_access (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.registered_apps(id) ON DELETE CASCADE NOT NULL,
    is_trial BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    access_level TEXT,
    product_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS user_product_access_user_id_idx ON public.user_product_access(user_id);
CREATE INDEX IF NOT EXISTS user_product_access_product_id_idx ON public.user_product_access(product_id);
CREATE INDEX IF NOT EXISTS user_product_access_status_idx ON public.user_product_access(status);

ALTER TABLE public.user_product_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios acessos"
    ON public.user_product_access FOR SELECT
    USING (auth.uid() = user_id);
```

### Se `user_purchases` usar `app_id` ao invés de `product_id`:
- Opção 1: Adicionar coluna `product_id` e manter `app_id` para compatibilidade
- Opção 2: Atualizar o código para usar `app_id`
- Opção 3: Renomear `app_id` para `product_id` (recomendado para consistência)

### Se faltarem colunas em `registered_apps`:
```sql
ALTER TABLE public.registered_apps 
ADD COLUMN IF NOT EXISTS vercel_deployment_url TEXT,
ADD COLUMN IF NOT EXISTS github_repo_url TEXT;
```
















