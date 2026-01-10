# 🔐 Guia de Configuração: Login com Google no Supabase

Este guia explica como configurar a autenticação com Google no Supabase para permitir que usuários façam login e cadastro usando suas contas do Google.

## 📋 Pré-requisitos

- Conta no Supabase
- Conta no Google Cloud Platform
- Projeto Supabase criado

## 🚀 Passo 1: Configurar OAuth no Google Cloud Console

### 1.1 Criar ou Selecionar um Projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione um projeto existente ou crie um novo
3. Anote o **Project ID** do seu projeto

### 1.2 Habilitar a API do Google+

1. No menu lateral, vá em **APIs & Services** > **Library**
2. Procure por "Google+ API" ou "Google Identity"
3. Clique em **Enable** para habilitar a API

### 1.3 Criar Credenciais OAuth 2.0

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Se solicitado, configure a tela de consentimento OAuth:
   - Escolha **External** (ou Internal se for para uso interno)
   - Preencha as informações necessárias:
     - Nome do aplicativo
     - Email de suporte
     - Logo (opcional)
   - Adicione seu email como usuário de teste
   - Salve e continue

4. Configure o OAuth Client:
   - **Application type**: Selecione **Web application**
   - **Name**: Dê um nome descritivo (ex: "LWDigitalForge Supabase Auth")
   
5. Configure as URLs autorizadas:
   
   **JavaScript origins:**
   ```
   https://[SEU-PROJETO-REF].supabase.co
   ```
   *Substitua `[SEU-PROJETO-REF]` pelo ID do seu projeto Supabase*
   
   **Redirect URIs:**
   ```
   https://[SEU-PROJETO-REF].supabase.co/auth/v1/callback
   ```
   *Substitua `[SEU-PROJETO-REF]` pelo ID do seu projeto Supabase*

6. Clique em **CREATE**
7. **IMPORTANTE**: Copie e guarde:
   - **Client ID**
   - **Client Secret**

## 🔧 Passo 2: Configurar Google OAuth no Supabase

### 2.1 Acessar Configurações de Autenticação

1. Acesse o [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication** > **Providers**

### 2.2 Habilitar o Provedor Google

1. Role até encontrar o provedor **Google**
2. Clique no toggle para **habilitar** o provedor
3. Preencha os campos:
   - **Client ID (for OAuth)**: Cole o Client ID obtido no Google Cloud Console
   - **Client Secret (for OAuth)**: Cole o Client Secret obtido no Google Cloud Console
4. Clique em **Save**

### 2.3 Verificar URL de Redirecionamento

O Supabase automaticamente configura a URL de redirecionamento como:
```
https://[seu-projeto-ref].supabase.co/auth/v1/callback
```

Certifique-se de que esta URL está adicionada nas **Redirect URIs** do Google Cloud Console.

## 📦 Passo 3: Aplicar a Migration do Banco de Dados

A migration `20250105000000_improve_google_oauth_sync.sql` melhora a sincronização automática de dados do Google OAuth.

### Opção A: Via Supabase Dashboard (Recomendado)

1. No Supabase Dashboard, vá em **SQL Editor**
2. Abra o arquivo `supabase/migrations/20250105000000_improve_google_oauth_sync.sql`
3. Copie todo o conteúdo SQL
4. Cole no SQL Editor
5. Clique em **RUN** para executar

### Opção B: Via Supabase CLI

```bash
# Se ainda não tiver o CLI instalado
npm install -g supabase

# Faça login
npx supabase login

# Conecte ao seu projeto
npx supabase link --project-ref seu-projeto-ref

# Aplique as migrations
npx supabase db push
```

## ✅ Passo 4: Testar o Login com Google

### 4.1 No Frontend

1. Certifique-se de que as variáveis de ambiente estão configuradas:
   ```env
   VITE_SUPABASE_URL=https://[seu-projeto-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

2. Acesse a página de login da aplicação
3. Clique no botão "Entrar com Google"
4. Você será redirecionado para o Google para autorizar
5. Após autorizar, será redirecionado de volta para `/auth/callback`
6. O sistema criará automaticamente um perfil na tabela `profiles`

### 4.2 Verificar no Banco de Dados

1. No Supabase Dashboard, vá em **Table Editor**
2. Selecione a tabela `profiles`
3. Verifique se um novo registro foi criado com:
   - `id`: UUID do usuário
   - `email`: Email do Google
   - `full_name`: Nome completo do Google
   - `avatar_url`: Foto de perfil do Google (se disponível)

## 🔍 Como Funciona a Sincronização

### Fluxo de Autenticação

1. **Usuário clica em "Entrar com Google"**
   - Frontend chama `signInWithGoogle()` do `SupabaseAuthContext`
   - Supabase redireciona para Google OAuth

2. **Usuário autoriza no Google**
   - Google retorna para o Supabase com código de autorização
   - Supabase troca o código por tokens

3. **Supabase cria usuário em `auth.users`**
   - Trigger `on_auth_user_created` é disparado automaticamente
   - Função `handle_new_user()` cria registro em `profiles`

4. **Callback no Frontend**
   - Usuário é redirecionado para `/auth/callback`
   - `AuthCallback.jsx` verifica se o perfil existe
   - Se não existir, cria um perfil (fallback de segurança)

### Dados Capturados do Google

A função `handle_new_user()` captura automaticamente:

- ✅ **Email**: Do campo `email` do usuário
- ✅ **Nome Completo**: De `raw_user_meta_data->>'name'` ou `raw_user_meta_data->>'full_name'`
- ✅ **Avatar**: De `raw_user_meta_data->>'picture'` ou `raw_user_meta_data->>'avatar_url'`
- ✅ **Role**: Padrão `'USER'` (pode ser alterado por admins depois)

## 🛠️ Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URL de redirecionamento no Google Cloud Console não corresponde à do Supabase.

**Solução**:
1. Verifique se a Redirect URI no Google Cloud Console é exatamente:
   ```
   https://[seu-projeto-ref].supabase.co/auth/v1/callback
   ```
2. Certifique-se de que não há espaços ou caracteres extras
3. Salve e aguarde alguns minutos para propagação

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos no Supabase.

**Solução**:
1. Verifique se copiou corretamente o Client ID e Client Secret
2. Certifique-se de que não há espaços extras
3. Tente gerar novas credenciais no Google Cloud Console

### Perfil não é criado automaticamente

**Causa**: A migration não foi aplicada ou o trigger não está funcionando.

**Solução**:
1. Verifique se a migration foi aplicada:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Verifique se a função existe:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
   ```
3. O `AuthCallback.jsx` tem um fallback que cria o perfil se não existir

### Dados do Google não aparecem no perfil

**Causa**: Os metadados do Google podem estar em campos diferentes.

**Solução**:
1. Verifique os metadados do usuário:
   ```sql
   SELECT raw_user_meta_data, user_metadata 
   FROM auth.users 
   WHERE email = 'seu-email@gmail.com';
   ```
2. A função `handle_new_user()` já verifica múltiplos campos, mas você pode ajustar se necessário

## 📚 Recursos Adicionais

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login/auth-google)

## 🔐 Segurança

- ✅ Nunca exponha o Client Secret no frontend
- ✅ Use sempre HTTPS em produção
- ✅ Configure corretamente as URLs de redirecionamento
- ✅ Revise as permissões solicitadas no OAuth consent screen
- ✅ Monitore logs de autenticação no Supabase Dashboard

---

**Última atualização**: 2025-01-05

















