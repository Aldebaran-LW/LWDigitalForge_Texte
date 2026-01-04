# 📦 Migrations do Supabase

Este diretório contém as migrations do banco de dados PostgreSQL do Supabase.

## 🚀 Como Aplicar as Migrations

### **Opção 1: Usando Supabase Dashboard (Recomendado para iniciantes)**

1. Acesse o [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie o conteúdo de `20250101000000_initial_schema.sql`
5. Cole no editor e clique em **RUN**

### **Opção 2: Usando Supabase CLI (Recomendado para produção)**

```bash
# 1. Instale o Supabase CLI
npm install -g supabase

# 2. Faça login
npx supabase login

# 3. Conecte ao seu projeto
npx supabase link --project-ref seu-projeto-ref

# 4. Aplique as migrations
npx supabase db push
```

## 📋 Migrations Disponíveis

### `20250101000000_initial_schema.sql`

**Schema inicial do banco de dados incluindo:**

#### Tabelas:
- ✅ `profiles` - Perfis de usuários
- ✅ `registered_apps` - Produtos/apps da plataforma
- ✅ `user_purchases` - Compras realizadas
- ✅ `user_trials` - Períodos de teste

#### Recursos:
- ✅ RLS (Row Level Security) configurado
- ✅ Políticas de segurança para cada tabela
- ✅ Índices para performance
- ✅ Triggers para `updated_at` automático
- ✅ Trigger para criação automática de perfil ao registrar usuário

## 🔐 Segurança

Todas as tabelas têm **Row Level Security (RLS)** habilitado com as seguintes regras:

- **Usuários comuns:** Podem ver e editar apenas seus próprios dados
- **Admins:** Têm acesso total a todos os dados
- **Público:** Pode visualizar apenas produtos ativos

## 📊 Diagrama de Relacionamentos

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
    ├── user_purchases (1:N) → registered_apps
    └── user_trials (1:N) → registered_apps
```

## 🛠️ Criando Novas Migrations

Para criar uma nova migration:

```bash
# Formato: YYYYMMDDHHMMSS_nome_descritivo.sql
# Exemplo:
touch supabase/migrations/20250104120000_add_categories_table.sql
```

**Boas práticas:**
- Use timestamps no formato `YYYYMMDDHHMMSS`
- Nome descritivo em snake_case
- Uma migration por mudança lógica
- Sempre teste em ambiente de desenvolvimento primeiro

## ⚠️ Importante

- ⚠️ **Nunca** altere migrations já aplicadas em produção
- ⚠️ Sempre crie **novas** migrations para mudanças
- ✅ Teste em ambiente local/dev antes de produção
- ✅ Faça backup antes de aplicar migrations críticas













