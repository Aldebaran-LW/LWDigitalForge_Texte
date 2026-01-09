# Estrutura do Banco de Dados - Site Principal

## Visão Geral

O banco de dados do site principal é composto por **5 tabelas principais** e **3 funções** que gerenciam usuários, produtos, compras, testes e mensagens de contato. Todas as tabelas utilizam **Row Level Security (RLS)** para controle de acesso.

---

## Tabelas

### 1. `profiles`
**Descrição**: Armazena os perfis de usuários estendendo a tabela `auth.users` do Supabase.

**Colunas**:
- `id` (UUID, PK) - Referência ao `auth.users(id)`
- `email` (TEXT, UNIQUE, NOT NULL) - Email do usuário
- `full_name` (TEXT) - Nome completo
- `phone` (TEXT) - Telefone
- `avatar_url` (TEXT) - URL do avatar/foto
- `role` (TEXT, DEFAULT 'USER') - Role do usuário: 'USER' ou 'ADMIN'
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Políticas RLS**:
- Usuários podem ver e atualizar apenas seus próprios perfis
- Admins podem ver todos os perfis

**Índices**: `email`, `role`

---

### 2. `registered_apps`
**Descrição**: Produtos/aplicativos disponíveis na plataforma.

**Colunas**:
- `id` (UUID, PK) - Identificador único
- `name` (TEXT, NOT NULL) - Nome do produto
- `slug` (TEXT, UNIQUE) - Slug único para URLs amigáveis (ex: 'jornadapro')
- `app_type` (TEXT, DEFAULT 'WEB_APP') - Tipo: 'WEB_APP' ou 'INFO_PRODUTO'
- `description` (TEXT) - Descrição breve
- `detailed_description` (TEXT) - Descrição detalhada
- `image_url` (TEXT) - URL da imagem
- `price_monthly` (INTEGER) - Preço mensal em centavos
- `price_annual` (INTEGER) - Preço anual em centavos
- `price_lifetime` (INTEGER) - Preço vitalício em centavos
- `is_active` (BOOLEAN, DEFAULT true) - Status ativo/inativo
- `category` (TEXT) - Categoria do produto
- `features` (JSONB, DEFAULT '[]') - Array de funcionalidades
- `download_url` (TEXT) - URL de download
- `documentation_url` (TEXT) - URL da documentação
- `vercel_deployment_url` (TEXT) - URL de deploy no Vercel
- `github_repo_url` (TEXT) - URL do repositório GitHub
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Políticas RLS**:
- Todos podem ver produtos ativos
- Admins podem gerenciar todos os produtos

**Índices**: `name`, `slug`, `is_active`, `category`, `app_type`

---

### 3. `user_purchases`
**Descrição**: Histórico de compras realizadas pelos usuários.

**Colunas**:
- `id` (UUID, PK) - Identificador único
- `user_id` (UUID, FK → profiles.id) - Usuário que realizou a compra
- `app_id` (UUID, FK → registered_apps.id) - Produto comprado
- `purchase_type` (TEXT) - Tipo: 'MONTHLY', 'ANNUAL', 'LIFETIME', 'TRIAL'
- `amount_paid` (INTEGER, NOT NULL) - Valor pago em centavos
- `payment_method` (TEXT) - Método de pagamento
- `payment_id` (TEXT) - ID da transação no gateway
- `status` (TEXT, DEFAULT 'PENDING') - Status: 'PENDING', 'APPROVED', 'CANCELLED', 'REFUNDED'
- `expires_at` (TIMESTAMP) - Data de expiração (para assinaturas)
- `purchased_at` (TIMESTAMP) - Data da compra
- `created_at` (TIMESTAMP) - Data de criação do registro
- `updated_at` (TIMESTAMP) - Data de atualização

**Políticas RLS**:
- Usuários podem ver apenas suas próprias compras
- Admins podem ver todas as compras

**Índices**: `user_id`, `app_id`, `status`, `expires_at`

---

### 4. `user_trials`
**Descrição**: Períodos de teste/trial dos usuários para produtos.

**Colunas**:
- `id` (UUID, PK) - Identificador único
- `user_id` (UUID, FK → profiles.id) - Usuário do trial
- `app_id` (UUID, FK → registered_apps.id) - Produto do trial
- `started_at` (TIMESTAMP, NOT NULL) - Data de início
- `expires_at` (TIMESTAMP, NOT NULL) - Data de expiração
- `is_active` (BOOLEAN, DEFAULT true) - Status do trial
- `created_at` (TIMESTAMP) - Data de criação

**Constraints**: UNIQUE (`user_id`, `app_id`) - Um usuário só pode ter um trial por produto

**Políticas RLS**:
- Usuários podem ver e criar seus próprios trials
- Admins podem gerenciar todos os trials

**Índices**: `user_id`, `app_id`, `expires_at`

---

### 5. `contact_messages`
**Descrição**: Mensagens de contato enviadas pelo formulário do portal.

**Colunas**:
- `id` (UUID, PK) - Identificador único
- `user_id` (UUID, FK → profiles.id, NULLABLE) - Usuário que enviou (opcional)
- `name` (TEXT, NOT NULL) - Nome do remetente
- `email` (TEXT, NOT NULL) - Email do remetente
- `subject` (TEXT, NOT NULL) - Assunto
- `message` (TEXT, NOT NULL) - Mensagem
- `status` (TEXT, DEFAULT 'PENDING') - Status: 'PENDING', 'READ', 'REPLIED', 'RESOLVED'
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Políticas RLS**:
- Qualquer um pode criar mensagens
- Usuários podem ver apenas suas próprias mensagens
- Admins podem ver todas as mensagens

**Índices**: `user_id`, `status`, `created_at`

---

## Funções

### 1. `handle_updated_at()`
**Tipo**: Trigger Function  
**Descrição**: Atualiza automaticamente o campo `updated_at` quando um registro é modificado.

**Uso**: Aplicada como trigger nas tabelas:
- `profiles`
- `registered_apps`
- `user_purchases`
- `contact_messages`

---

### 2. `handle_new_user()`
**Tipo**: Trigger Function (SECURITY DEFINER)  
**Descrição**: Cria automaticamente um perfil na tabela `profiles` quando um novo usuário é registrado em `auth.users`.

**Funcionalidades**:
- Captura dados do Google OAuth (nome, avatar, email)
- Cria perfil com role padrão 'USER'
- Atualiza perfil existente se já houver conflito

**Trigger**: `on_auth_user_created` em `auth.users`

---

### 3. `is_admin()` / `is_admin(UUID)`
**Tipo**: Function (SECURITY DEFINER, STABLE)  
**Descrição**: Verifica se um usuário possui role 'ADMIN'.

**Versões**:
- `is_admin()` - Verifica o usuário autenticado atual (`auth.uid()`)
- `is_admin(UUID)` - Verifica um usuário específico por ID

**Uso**: Utilizada nas políticas RLS para conceder permissões administrativas, evitando recursão infinita ao usar `SET LOCAL row_security = off`.

---

## Triggers

### 1. `set_updated_at`
**Tabelas**: `profiles`, `registered_apps`, `user_purchases`, `contact_messages`  
**Evento**: BEFORE UPDATE  
**Função**: `handle_updated_at()`  
**Descrição**: Atualiza automaticamente o campo `updated_at` antes de qualquer atualização.

---

### 2. `on_auth_user_created`
**Tabela**: `auth.users`  
**Evento**: AFTER INSERT  
**Função**: `handle_new_user()`  
**Descrição**: Cria automaticamente um perfil em `profiles` quando um novo usuário é registrado no Supabase Auth.

---

## Relacionamentos

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles
    ↓ (1:N)
user_purchases ← (N:1) registered_apps
    ↓
user_trials ← (N:1) registered_apps

contact_messages → (N:1, opcional) profiles
```

---

## Segurança (RLS)

Todas as tabelas possuem **Row Level Security (RLS)** habilitado, garantindo que:
- Usuários autenticados só acessam seus próprios dados
- Admins têm acesso completo a todas as tabelas
- Produtos inativos não são visíveis publicamente
- A função `is_admin()` usa `SECURITY DEFINER` para evitar recursão nas políticas

---

## Índices e Performance

Índices criados para otimizar consultas frequentes:
- Chaves primárias (PK) e estrangeiras (FK) automaticamente indexadas
- Índices em campos de busca: `email`, `name`, `status`
- Índices em campos de filtro: `role`, `is_active`, `category`
- Índices em campos temporais: `expires_at`, `created_at`

---

## Extensões Utilizadas

- `uuid-ossp`: Geração de UUIDs para chaves primárias

---

## Edge Functions

### `check-subscription`
**Descrição**: Edge Function para verificar se um usuário tem acesso a um app específico (sistema híbrido).

**Parâmetros de Entrada**:
- `userId` (UUID, obrigatório) - ID do usuário
- `email` (TEXT, obrigatório) - Email do usuário (para validação)
- `appId` ou `productId` (UUID, obrigatório) - ID do app para verificar acesso

**Resposta**:
- `hasAccess` (BOOLEAN) - Se o usuário tem acesso ao app específico
- `isSubscriber` (BOOLEAN) - Se tem assinatura ativa para o app
- `isTrial` (BOOLEAN) - Se está em período de trial para o app
- `subscriptionStatus` (TEXT) - Status: 'active', 'trial' ou 'none'
- `appId` (UUID) - ID do app verificado
- `appName` (TEXT) - Nome do app
- `appSlug` (TEXT, opcional) - Slug do app
- `expiresAt` (TIMESTAMP, opcional) - Data de expiração da assinatura
- `purchaseType` (TEXT, opcional) - Tipo: 'MONTHLY', 'ANNUAL', 'LIFETIME'
- `trialExpiresAt` (TIMESTAMP, opcional) - Data de expiração do trial
- `daysRemaining` (INTEGER, opcional) - Dias restantes do trial

**Lógica**:
1. Verifica se o usuário existe e o email corresponde
2. Verifica se o app existe e está ativo
3. Busca assinaturas ativas (`user_purchases`) **específicas do app** (filtro por `app_id`)
4. Busca trials ativos (`user_trials`) **específicos do app** (filtro por `app_id`)
5. Retorna status baseado no acesso ao **app específico** (sistema híbrido)

**Nota Importante**: A função verifica acesso a um **app específico**, não acesso geral. Se o usuário tem JornadaPro mas não tem App de Vendas, ele será bloqueado ao tentar acessar o App de Vendas, mesmo tendo acesso ao JornadaPro.

