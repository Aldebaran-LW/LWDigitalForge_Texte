# 🧪 Testes: Autenticação com Google OAuth

Este documento descreve os testes para validar a funcionalidade de login e cadastro com Google OAuth.

## 📋 Casos de Teste

### ✅ Teste 1: Primeiro Login (Novo Usuário)

**Objetivo**: Verificar se um novo usuário consegue fazer login com Google e ter seu perfil criado automaticamente.

**Passos**:
1. Acesse a página de login (`/login`)
2. Clique no botão "Entrar com Google"
3. Selecione uma conta Google que **nunca** foi usada no sistema
4. Autorize o acesso
5. Aguarde o redirecionamento para `/auth/callback`

**Resultado Esperado**:
- ✅ Usuário é redirecionado para `/auth/callback`
- ✅ Mensagem de sucesso aparece: "Login realizado com sucesso!"
- ✅ Redirecionamento para `/portal/meus-produtos` (usuário comum) ou `/admin/dashboard` (admin)
- ✅ Toast de boas-vindas aparece com o nome do usuário
- ✅ Perfil é criado na tabela `profiles` com:
  - `id`: UUID do usuário
  - `email`: Email do Google
  - `full_name`: Nome completo do Google
  - `avatar_url`: Foto de perfil (se disponível)
  - `role`: 'USER' (padrão)

**Verificação no Banco**:
```sql
-- Verificar se o perfil foi criado
SELECT id, email, full_name, avatar_url, role, created_at 
FROM profiles 
WHERE email = 'email-do-teste@gmail.com';

-- Verificar se o usuário foi criado no auth.users
SELECT id, email, raw_user_meta_data, user_metadata 
FROM auth.users 
WHERE email = 'email-do-teste@gmail.com';
```

---

### ✅ Teste 2: Login de Usuário Existente

**Objetivo**: Verificar se um usuário que já fez login antes consegue fazer login novamente.

**Passos**:
1. Use uma conta Google que já foi usada no sistema (do Teste 1)
2. Acesse a página de login
3. Clique em "Entrar com Google"
4. Autorize o acesso

**Resultado Esperado**:
- ✅ Login bem-sucedido sem criar perfil duplicado
- ✅ Redirecionamento correto baseado no role
- ✅ Dados do perfil são atualizados se houver mudanças no Google (nome, avatar)

**Verificação no Banco**:
```sql
-- Verificar que não há duplicatas
SELECT COUNT(*) FROM profiles WHERE email = 'email-do-teste@gmail.com';
-- Deve retornar 1

-- Verificar se os dados foram atualizados
SELECT full_name, avatar_url, updated_at 
FROM profiles 
WHERE email = 'email-do-teste@gmail.com';
```

---

### ✅ Teste 3: Captura de Dados do Google

**Objetivo**: Verificar se todos os dados do Google são capturados corretamente.

**Cenários**:
- Usuário com nome completo
- Usuário com foto de perfil
- Usuário sem foto de perfil
- Usuário com nome em diferentes formatos

**Resultado Esperado**:
- ✅ Nome completo é capturado corretamente
- ✅ Avatar é capturado quando disponível
- ✅ Email sempre é capturado
- ✅ Fallback funciona quando dados não estão disponíveis

**Verificação**:
```sql
-- Verificar metadados do Google
SELECT 
    email,
    raw_user_meta_data->>'name' as google_name,
    raw_user_meta_data->>'picture' as google_picture,
    user_metadata->>'full_name' as metadata_full_name
FROM auth.users 
WHERE email = 'email-do-teste@gmail.com';

-- Comparar com o perfil criado
SELECT email, full_name, avatar_url 
FROM profiles 
WHERE email = 'email-do-teste@gmail.com';
```

---

### ✅ Teste 4: Tratamento de Erros

**Objetivo**: Verificar se erros são tratados corretamente.

#### 4.1 Usuário Cancela Autorização

**Passos**:
1. Clique em "Entrar com Google"
2. Na tela do Google, clique em "Cancelar" ou feche a janela

**Resultado Esperado**:
- ✅ Usuário retorna para a página de login
- ✅ Mensagem de erro apropriada (se aplicável)
- ✅ Nenhum perfil é criado

#### 4.2 Erro de Configuração OAuth

**Passos**:
1. Desabilite temporariamente o Google OAuth no Supabase Dashboard
2. Tente fazer login com Google

**Resultado Esperado**:
- ✅ Mensagem de erro clara: "Não foi possível fazer login com Google"
- ✅ Toast de erro aparece
- ✅ Usuário permanece na página de login

#### 4.3 Erro de Rede

**Passos**:
1. Desconecte a internet
2. Tente fazer login com Google

**Resultado Esperado**:
- ✅ Mensagem de erro de conexão
- ✅ Sistema não trava

---

### ✅ Teste 5: Sincronização de Perfil (Trigger)

**Objetivo**: Verificar se o trigger `handle_new_user()` funciona corretamente.

**Passos**:
1. Faça login com uma nova conta Google
2. Verifique imediatamente no banco se o perfil foi criado

**Resultado Esperado**:
- ✅ Perfil é criado **antes** do callback no frontend
- ✅ Dados são capturados corretamente do `raw_user_meta_data`
- ✅ Não há necessidade de criar perfil manualmente no `AuthCallback.jsx`

**Verificação**:
```sql
-- Verificar se o trigger existe e está ativo
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    pg_get_triggerdef(oid) as definition
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Verificar se a função existe
SELECT 
    proname as function_name,
    prosrc as source_code
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

---

### ✅ Teste 6: Fallback no Frontend

**Objetivo**: Verificar se o fallback no `AuthCallback.jsx` funciona quando o trigger falha.

**Passos**:
1. Temporariamente desabilite o trigger (apenas para teste):
   ```sql
   ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
   ```
2. Faça login com uma nova conta Google
3. Verifique se o perfil é criado pelo `AuthCallback.jsx`

**Resultado Esperado**:
- ✅ Perfil é criado pelo fallback no frontend
- ✅ Mensagem "Perfil Criado!" aparece
- ✅ Login continua normalmente

**Limpeza**:
```sql
-- Reabilitar o trigger após o teste
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

---

### ✅ Teste 7: Atualização de Dados Existentes

**Objetivo**: Verificar se dados são atualizados quando usuário faz login novamente após mudar dados no Google.

**Passos**:
1. Faça login com uma conta Google
2. Anote o nome e avatar atuais
3. Altere o nome e/ou foto no Google
4. Faça logout
5. Faça login novamente com a mesma conta

**Resultado Esperado**:
- ✅ Dados são atualizados no perfil (nome, avatar)
- ✅ `updated_at` é atualizado
- ✅ Não cria perfil duplicado

**Verificação**:
```sql
-- Verificar atualização
SELECT 
    full_name,
    avatar_url,
    updated_at,
    created_at
FROM profiles 
WHERE email = 'email-do-teste@gmail.com'
ORDER BY updated_at DESC;
```

---

### ✅ Teste 8: Múltiplos Provedores (Email + Google)

**Objetivo**: Verificar comportamento quando usuário tem conta com email e depois faz login com Google.

**Cenário A: Email diferente do Google**
- Criar conta com email: `usuario@exemplo.com`
- Fazer login com Google: `usuario@gmail.com`

**Resultado Esperado**:
- ✅ São criados dois perfis diferentes (emails diferentes)
- ✅ Cada um tem seu próprio UUID

**Cenário B: Mesmo email**
- Criar conta com email: `usuario@gmail.com` (senha)
- Fazer login com Google: `usuario@gmail.com`

**Resultado Esperado**:
- ✅ Supabase pode vincular as contas (depende da configuração)
- ✅ Ou criar contas separadas

---

## 🔧 Scripts de Teste SQL

### Verificar Estado do Sistema

```sql
-- Verificar triggers
SELECT 
    schemaname,
    tablename,
    triggername,
    tgisinternal as is_internal,
    tgenabled as enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE triggername = 'on_auth_user_created';

-- Verificar função
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user' 
AND n.nspname = 'public';

-- Verificar estrutura da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

### Limpar Dados de Teste

```sql
-- ⚠️ CUIDADO: Isso deleta dados reais!
-- Use apenas em ambiente de desenvolvimento/teste

-- Deletar perfil de teste
DELETE FROM profiles WHERE email = 'email-de-teste@gmail.com';

-- Deletar usuário de teste (cascata deleta o perfil)
DELETE FROM auth.users WHERE email = 'email-de-teste@gmail.com';
```

---

## 📊 Checklist de Testes

Use este checklist para garantir que todos os testes foram executados:

- [ ] Teste 1: Primeiro Login (Novo Usuário)
- [ ] Teste 2: Login de Usuário Existente
- [ ] Teste 3: Captura de Dados do Google
- [ ] Teste 4.1: Usuário Cancela Autorização
- [ ] Teste 4.2: Erro de Configuração OAuth
- [ ] Teste 4.3: Erro de Rede
- [ ] Teste 5: Sincronização de Perfil (Trigger)
- [ ] Teste 6: Fallback no Frontend
- [ ] Teste 7: Atualização de Dados Existentes
- [ ] Teste 8: Múltiplos Provedores

---

## 🐛 Problemas Conhecidos e Soluções

### Problema: Perfil não é criado automaticamente

**Sintomas**: Login funciona, mas perfil não aparece na tabela `profiles`.

**Soluções**:
1. Verificar se a migration foi aplicada
2. Verificar se o trigger está ativo
3. Verificar logs do Supabase para erros na função
4. O fallback no `AuthCallback.jsx` deve criar o perfil

### Problema: Dados do Google não aparecem

**Sintomas**: Perfil é criado, mas `full_name` ou `avatar_url` estão vazios.

**Soluções**:
1. Verificar metadados do usuário: `SELECT raw_user_meta_data FROM auth.users WHERE email = '...'`
2. Ajustar a função `handle_new_user()` se necessário
3. Verificar se o Google está retornando os dados esperados

### Problema: Erro "redirect_uri_mismatch"

**Sintomas**: Erro ao tentar fazer login com Google.

**Soluções**:
1. Verificar URLs no Google Cloud Console
2. Certificar-se de que a URL está exatamente: `https://[projeto-ref].supabase.co/auth/v1/callback`
3. Aguardar alguns minutos após alterar URLs

---

## 📝 Notas de Teste

**Data do Teste**: _______________

**Ambiente**: [ ] Desenvolvimento [ ] Staging [ ] Produção

**Versão da Migration**: `20250105000000_improve_google_oauth_sync.sql`

**Resultados**:
- Total de testes executados: ___
- Testes aprovados: ___
- Testes falhados: ___
- Observações: 

---

**Última atualização**: 2025-01-05


