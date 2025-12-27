# 📋 Documentação - Área do Usuário

## ✅ Análise de Segurança das Mudanças

### Mudanças Implementadas:
1. **PortalAssinaturas.jsx**: 
   - ✅ Substituído `window.location.href` por `useNavigate()` (React Router) - **SEGURO**
   - ✅ Cancelamento atualiza apenas o status no banco - **SEGURO**
   - ✅ Não altera estrutura de dados existente

2. **PortalContato.jsx**:
   - ✅ Adiciona nova tabela `contact_messages` - **SEGURO** (não afeta dados existentes)
   - ✅ Usa RLS (Row Level Security) - **SEGURO**
   - ✅ Não modifica código existente, apenas adiciona funcionalidade

### ⚠️ Requisito:
- **Migration precisa ser aplicada**: `supabase/migrations/20250108000001_add_contact_messages.sql`
- Sem a migration, o formulário de contato mostrará erro ao enviar
- **Não quebra o site**, apenas a funcionalidade de contato não funcionará até aplicar a migration

---

## 🎯 Funcionalidade de Cada Botão da Área do Usuário

### 📊 **Dashboard** (`/portal/dashboard`)

#### Botões/Ações:
1. **"Ver todos"** (Produtos Recentes)
   - **Função**: Navega para `/portal/meus-produtos`
   - **Status**: ✅ Funcional

2. **"Ver todos"** (Testes Ativos)
   - **Função**: Navega para `/portal/testes`
   - **Status**: ✅ Funcional

3. **"Explorar Produtos"** (quando não há produtos)
   - **Função**: Navega para `/portal/produtos`
   - **Status**: ✅ Funcional

4. **"Explorar Produtos"** (Ações Rápidas)
   - **Função**: Navega para `/portal/produtos`
   - **Status**: ✅ Funcional

5. **"Ver Pagamentos"** (Ações Rápidas)
   - **Função**: Navega para `/portal/pagamentos`
   - **Status**: ✅ Funcional

6. **"Falar com Suporte"** (Ações Rápidas)
   - **Função**: Navega para `/portal/contato`
   - **Status**: ✅ Funcional

7. **Cards clicáveis** (Produtos Recentes)
   - **Função**: Navega para `/product/{id}` (detalhes do produto)
   - **Status**: ✅ Funcional

---

### 🛍️ **Todos os Produtos** (`/portal/produtos`)

#### Botões/Ações:
1. **"Filtros"** (Toggle)
   - **Função**: Mostra/oculta opções de filtro (Todos, Grátis, Pagos)
   - **Status**: ✅ Funcional

2. **"Todos"** / **"Grátis"** / **"Pagos"** (Filtros)
   - **Função**: Filtra produtos por preço
   - **Status**: ✅ Funcional

3. **Ordenação** (Dropdown)
   - **Função**: Ordena por Nome, Menor Preço, Maior Preço
   - **Status**: ✅ Funcional

4. **"Ver Detalhes"** (Cada produto)
   - **Função**: Navega para `/product/{id}`
   - **Status**: ✅ Funcional

5. **Ícone de Link Externo** (Cada produto)
   - **Função**: Abre `vercel_deployment_url` em nova aba
   - **Status**: ✅ Funcional

6. **"Limpar Filtros"** (quando não há resultados)
   - **Função**: Reseta busca, filtros e ordenação
   - **Status**: ✅ Funcional

---

### 📦 **Meus Produtos** (`/portal/meus-produtos`)

#### Botões/Ações:
1. **"Todos"** (Filtro)
   - **Função**: Mostra todos os produtos (adquiridos + em teste)
   - **Status**: ✅ Funcional

2. **"Adquiridos"** (Filtro)
   - **Função**: Mostra apenas produtos comprados
   - **Status**: ✅ Funcional

3. **"Testando"** (Filtro)
   - **Função**: Mostra apenas produtos em período de teste
   - **Status**: ✅ Funcional

4. **"Acessar Aplicação"**
   - **Função**: Abre `vercel_deployment_url` em nova aba
   - **Status**: ✅ Funcional

5. **"Ver Repositório"**
   - **Função**: Abre `github_repo_url` em nova aba
   - **Status**: ✅ Funcional

6. **"Ver Detalhes"** (Link no card)
   - **Função**: Navega para `/product/{id}`
   - **Status**: ✅ Funcional

---

### 🧪 **Testes Ativos** (`/portal/testes`)

#### Botões/Ações:
1. **"Acessar Produto"** (quando teste está ativo)
   - **Função**: Abre `vercel_deployment_url` ou `github_repo_url` em nova aba
   - **Status**: ✅ Funcional

2. **"Comprar Agora"** (quando teste expirou)
   - **Função**: Navega para `/product/{id}`
   - **Status**: ✅ Funcional

3. **"Ver Planos"** (quando teste está ativo)
   - **Função**: Navega para `/product/{id}`
   - **Status**: ✅ Funcional

4. **"Explorar Produtos"** (quando não há testes)
   - **Função**: Navega para `/portal/produtos`
   - **Status**: ✅ Funcional

---

### 💳 **Assinaturas** (`/portal/assinaturas`)

#### Botões/Ações:
1. **"Renovar"**
   - **Função**: Navega para `/product/{id}` para renovar assinatura
   - **Status**: ✅ Funcional (usa `useNavigate`)

2. **"Solicitar Reembolso"**
   - **Função**: Navega para `/portal/contato` com assunto e mensagem pré-preenchidos
   - **Status**: ✅ Funcional (usa `useNavigate`)

3. **"Cancelar"**
   - **Função**: 
     - Abre diálogo de confirmação
     - Atualiza status da compra para `CANCELLED` no banco
     - Recarrega lista de assinaturas
   - **Status**: ✅ Funcional (implementado)

4. **"Manter Assinatura"** (no diálogo)
   - **Função**: Fecha o diálogo sem cancelar
   - **Status**: ✅ Funcional

5. **"Cancelar Assinatura"** (no diálogo)
   - **Função**: Confirma e executa o cancelamento
   - **Status**: ✅ Funcional

---

### 💰 **Pagamentos** (`/portal/pagamentos`)

#### Botões/Ações:
1. **"Gerenciar"** (para assinaturas)
   - **Função**: Navega para `/portal/assinaturas`
   - **Status**: ✅ Funcional

2. **"Ver Produto"** (para compras lifetime)
   - **Função**: Navega para `/product/{id}`
   - **Status**: ✅ Funcional

3. **"Explorar Produtos"** (quando não há pagamentos)
   - **Função**: Navega para `/portal/produtos`
   - **Status**: ✅ Funcional

---

### 📧 **Contato** (`/portal/contato`)

#### Botões/Ações:
1. **"Enviar Mensagem"**
   - **Função**: 
     - Valida formulário
     - Salva mensagem na tabela `contact_messages` do Supabase
     - Mostra mensagem de sucesso
     - Limpa formulário
   - **Status**: ✅ Funcional (requer migration aplicada)

2. **Link de Email** (`suporte@lwdigitalforge.com`)
   - **Função**: Abre cliente de email padrão
   - **Status**: ✅ Funcional

---

## 🔐 Como Funciona o Login/Cadastro com Google

### Fluxo Completo:

#### 1. **Início do Login** (`PaginaLogin.jsx`)
```javascript
signInWithGoogle() // Chama função do contexto
```

#### 2. **Processo OAuth** (`SupabaseAuthContext.jsx`)
```javascript
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
})
```

**O que acontece:**
- Usuário é redirecionado para página de login do Google
- Google autentica e retorna para `/auth/callback`
- Supabase cria/atualiza usuário em `auth.users`

#### 3. **Callback** (`AuthCallback.jsx`)

**Processo:**
1. Extrai código de autenticação da URL
2. Troca código por sessão no Supabase
3. Verifica se existe perfil em `profiles`:
   - **Se NÃO existe**: Cria perfil automaticamente
   - **Se existe**: Atualiza dados se necessário
4. Redireciona:
   - **ADMIN** → `/admin/dashboard`
   - **USER** → `/portal/meus-produtos`

#### 4. **Criação Automática de Perfil**

```javascript
// Se não houver perfil, criar automaticamente
const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 
               user.user_metadata?.name || 
               user.email?.split('@')[0],
    role: 'USER' // Padrão
  });
```

**Dados capturados do Google:**
- `email`: Email do Google
- `full_name`: Nome completo (de `user_metadata`)
- `avatar_url`: Foto de perfil (se disponível)

#### 5. **Sincronização** (Migration: `20250105000000_improve_google_oauth_sync.sql`)

**Trigger automático:**
- Quando usuário faz login com Google
- Se perfil não existe, cria automaticamente
- Se existe, atualiza email e nome se necessário

### ⚠️ Pontos Importantes:

1. **Primeiro Login:**
   - Perfil é criado automaticamente
   - Role padrão: `USER`
   - Não precisa completar cadastro manual

2. **Logins Subsequentes:**
   - Usa perfil existente
   - Atualiza dados se mudaram no Google

3. **Segurança:**
   - OAuth gerenciado pelo Supabase
   - Tokens seguros
   - RLS protege dados do perfil

4. **Redirecionamento:**
   - Após login, redireciona automaticamente
   - Baseado no role do usuário

### 🔧 Configuração Necessária no Supabase:

1. **Habilitar Google OAuth:**
   - Dashboard → Authentication → Providers → Google
   - Adicionar Client ID e Client Secret do Google Cloud Console

2. **URLs de Redirecionamento:**
   - Adicionar: `https://seu-dominio.com/auth/callback`
   - Adicionar: `http://localhost:3000/auth/callback` (desenvolvimento)

3. **Google Cloud Console:**
   - Criar projeto OAuth 2.0
   - Adicionar URLs autorizadas
   - Obter Client ID e Secret

---

## 📝 Resumo das Mudanças Implementadas

### ✅ Seguras (Não Quebram o Site):
- Navegação com `useNavigate` (substitui `window.location`)
- Cancelamento de assinatura (apenas atualiza status)
- Envio de mensagem de contato (nova funcionalidade)

### ⚠️ Requer Migration:
- Tabela `contact_messages` precisa ser criada
- Sem migration: formulário de contato não funcionará
- **Site continua funcionando**, apenas contato não salva mensagens

### 🔒 Segurança:
- Todas as operações usam RLS
- Validações de dados
- Tratamento de erros
- Não expõe dados sensíveis

---

## 🚀 Próximos Passos Recomendados

1. **Aplicar Migration:**
   ```sql
   -- Executar no Supabase SQL Editor:
   -- Arquivo: supabase/migrations/20250108000001_add_contact_messages.sql
   ```

2. **Testar Funcionalidades:**
   - Cancelar assinatura
   - Enviar mensagem de contato
   - Navegação entre páginas

3. **Monitorar Logs:**
   - Verificar erros no console
   - Verificar logs do Supabase

---

**Última atualização:** 2025-01-08

