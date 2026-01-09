# 🔧 Solução para Bugs: Aplicações Web e Email Admin

**Data:** 2025-01-10  
**Problemas Identificados:**
1. Aplicações web não carregam quando cliente clica para testar
2. Email admin não visível na área administrativa

---

## 🐛 Problema 1: Aplicações Web Não Carregam

### Sintomas
- Cliente clica em "Acessar Aplicação" ou "Acessar Produto"
- Nada acontece ou aparece erro
- Aplicação não abre em nova aba

### Possíveis Causas

#### 1. **URL Vazia ou Null** ⚠️ CRÍTICO
**Localização:** `registered_apps.vercel_deployment_url`

**Verificação:**
```sql
-- Verificar produtos sem URL
SELECT id, name, vercel_deployment_url 
FROM registered_apps 
WHERE vercel_deployment_url IS NULL OR vercel_deployment_url = '';
```

**Solução:**
1. Acessar `/admin/produtos`
2. Editar cada produto sem URL
3. Preencher o campo "URL de Deploy (Vercel)"
4. Salvar

#### 2. **Popup Bloqueado pelo Navegador** ⚠️ COMUM
**Localização:** `PortalMeusProdutos.jsx` linha 87, `PortalTestes.jsx` linha 86

**Código Atual:**
```javascript
window.open(product.vercel_deployment_url, '_blank');
```

**Problema:** Navegadores modernos bloqueiam popups que não são resultado de ação direta do usuário.

**Solução:** O código já está correto (dentro de `onClick`), mas pode melhorar:

```javascript
const handleAccess = (product) => {
  if (!product.vercel_deployment_url) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'URL de acesso não configurada para este produto. Entre em contato com o suporte.',
    });
    return;
  }

  // Verificar se URL é válida
  try {
    new URL(product.vercel_deployment_url);
  } catch (e) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'URL de acesso inválida. Entre em contato com o suporte.',
    });
    return;
  }

  // Salvar productId no sessionStorage antes de abrir app
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('app_product_id', product.id);
    sessionStorage.setItem('app_product_name', product.name);
  }
  
  // Abrir app com URL limpa (sem parâmetros)
  const newWindow = window.open(product.vercel_deployment_url, '_blank');
  
  // Verificar se popup foi bloqueado
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    toast({
      variant: 'destructive',
      title: 'Popup Bloqueado',
      description: 'Por favor, permita popups para este site e tente novamente.',
    });
  }
};
```

#### 3. **Aplicação Não Verifica Acesso** ⚠️ IMPORTANTE
**Localização:** Aplicação web (não no site principal)

**Problema:** A aplicação web pode não estar verificando o `sessionStorage` ou não está integrada com o sistema de verificação de acesso.

**Solução na Aplicação Web:**
A aplicação web deve verificar o acesso assim que carregar:

```javascript
// No início da aplicação web (ex: App.jsx ou main.jsx)
useEffect(() => {
  // Ler productId do sessionStorage
  const productId = sessionStorage.getItem('app_product_id');
  const productName = sessionStorage.getItem('app_product_name');
  
  if (productId) {
    // Verificar acesso com Edge Function
    verifyAccess(productId);
  } else {
    // Se não tem productId, pode ser acesso direto (sem passar pelo portal)
    // Redirecionar para portal ou mostrar erro
    console.warn('Acesso direto sem productId');
  }
}, []);

async function verifyAccess(productId) {
  try {
    const response = await fetch('/api/check-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        email: currentUser.email,
        productId: productId
      })
    });
    
    const data = await response.json();
    
    if (!data.hasAccess) {
      // Redirecionar para página de compra ou mostrar erro
      window.location.href = `https://seu-site.com/product/${productId}`;
    }
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
  }
}
```

#### 4. **Teste Expirado Ainda Aparece como Ativo** ⚠️ BUG
**Localização:** `PortalTestes.jsx` linha 44

**Problema:** A query busca apenas `is_active = true`, mas não verifica se `expires_at` já passou.

**Código Atual:**
```javascript
.eq('is_active', true)
```

**Solução:** Adicionar verificação de data:

```javascript
const { data, error } = await supabase
  .from('user_trials')
  .select(`
    *,
    registered_apps:app_id (...)
  `)
  .eq('user_id', user.id)
  .eq('is_active', true)
  .gt('expires_at', new Date().toISOString()) // Adicionar esta linha
  .order('started_at', { ascending: false });
```

E também atualizar testes expirados automaticamente:

```javascript
// Adicionar função para atualizar testes expirados
const updateExpiredTrials = async () => {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('user_trials')
    .update({ is_active: false })
    .lt('expires_at', now)
    .eq('is_active', true);
    
  if (error) {
    console.error('Erro ao atualizar testes expirados:', error);
  }
};

// Chamar antes de buscar testes
useEffect(() => {
  const fetchActiveTrials = async () => {
    await updateExpiredTrials(); // Adicionar esta linha
    // ... resto do código
  };
  fetchActiveTrials();
}, [user, toast]);
```

---

## 🐛 Problema 2: Email Admin Não Visível

### Sintomas
- Na área administrativa (`/admin/usuarios`), a coluna de email aparece vazia
- Mensagem "Email não disponível (sem permissão)" aparece
- Erro de RLS (Row Level Security) no console

### Causa
**Políticas RLS (Row Level Security) do Supabase estão bloqueando o acesso ao campo `email` na tabela `profiles`.**

### Solução

#### Passo 1: Aplicar Migration
A migration `20250110000000_fix_admin_email_access.sql` já existe e corrige o problema.

**Como Aplicar:**

**Opção A: Via Supabase Dashboard (Recomendado)**
1. Acessar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecionar seu projeto
3. Ir em **SQL Editor**
4. Abrir o arquivo `supabase/migrations/20250110000000_fix_admin_email_access.sql`
5. Copiar todo o conteúdo
6. Colar no SQL Editor
7. Clicar em **Run** (ou pressionar Ctrl+Enter)

**Opção B: Via Supabase CLI**
```bash
# Se tiver Supabase CLI instalado
supabase db push
```

#### Passo 2: Verificar se Migration Foi Aplicada

Execute este SQL no Supabase Dashboard:

```sql
-- Verificar se a política existe
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
WHERE tablename = 'profiles' 
  AND policyname = 'Admins podem ver todos os perfis';
```

**Resultado Esperado:**
- Deve retornar 1 linha com a política
- `roles` deve incluir `authenticated`
- `cmd` deve ser `SELECT`

#### Passo 3: Testar no Frontend

1. Fazer logout e login novamente (para atualizar sessão)
2. Acessar `/admin/usuarios`
3. Verificar se emails aparecem

**Se ainda não aparecer:**

Verificar no console do navegador (F12):
- Se houver erro `PGRST301` ou `permission denied`, a migration não foi aplicada corretamente
- Se houver erro diferente, verificar logs do Supabase

#### Passo 4: Verificar Role do Usuário

Certifique-se de que seu usuário tem role `ADMIN`:

```sql
-- Verificar seu role
SELECT id, email, role 
FROM profiles 
WHERE email = 'seu-email@exemplo.com';
```

**Se role não for `ADMIN`:**
```sql
-- Atualizar role (substituir o ID pelo seu)
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = 'seu-user-id-aqui';
```

---

## 📋 Checklist de Correção

### Para Aplicações Web Não Carregarem:

- [ ] Verificar se `vercel_deployment_url` está preenchido no banco
- [ ] Verificar se URLs são válidas (começam com `http://` ou `https://`)
- [ ] Testar se popup não está sendo bloqueado
- [ ] Verificar console do navegador para erros
- [ ] Verificar se aplicação web está verificando acesso
- [ ] Corrigir verificação de testes expirados

### Para Email Admin Não Visível:

- [ ] Aplicar migration `20250110000000_fix_admin_email_access.sql`
- [ ] Verificar se política RLS foi criada
- [ ] Verificar se usuário tem role `ADMIN`
- [ ] Fazer logout e login novamente
- [ ] Verificar console do navegador para erros
- [ ] Verificar logs do Supabase

---

## 🔍 Scripts de Diagnóstico

### Verificar Produtos sem URL
```sql
SELECT 
    id,
    name,
    vercel_deployment_url,
    github_repo_url,
    is_active
FROM registered_apps
WHERE (vercel_deployment_url IS NULL OR vercel_deployment_url = '')
  AND is_active = true;
```

### Verificar Testes Expirados Ainda Ativos
```sql
SELECT 
    ut.id,
    ut.user_id,
    ut.app_id,
    ut.started_at,
    ut.expires_at,
    ut.is_active,
    ra.name as product_name,
    p.email as user_email
FROM user_trials ut
JOIN registered_apps ra ON ut.app_id = ra.id
JOIN profiles p ON ut.user_id = p.id
WHERE ut.is_active = true
  AND ut.expires_at < NOW();
```

### Verificar Políticas RLS de Profiles
```sql
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
```

---

## 🚀 Correções Imediatas Recomendadas

### 1. Adicionar Validação de URL Antes de Abrir

**Arquivo:** `src/pages/portal/PortalMeusProdutos.jsx`

**Linha 77-97:** Substituir função `handleAccess`:

```javascript
const handleAccess = (product) => {
  // Validar se URL existe
  if (!product.vercel_deployment_url) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'URL de acesso não configurada para este produto. Entre em contato com o suporte.',
    });
    return;
  }

  // Validar formato da URL
  try {
    new URL(product.vercel_deployment_url);
  } catch (e) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'URL de acesso inválida. Entre em contato com o suporte.',
    });
    return;
  }

  // Salvar productId no sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('app_product_id', product.id);
    sessionStorage.setItem('app_product_name', product.name);
  }
  
  // Abrir app
  const newWindow = window.open(product.vercel_deployment_url, '_blank');
  
  // Verificar se popup foi bloqueado
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    toast({
      variant: 'destructive',
      title: 'Popup Bloqueado',
      description: 'Por favor, permita popups para este site e tente novamente.',
    });
  }
};
```

### 2. Corrigir Verificação de Testes Expirados

**Arquivo:** `src/pages/portal/PortalTestes.jsx`

**Linha 18-63:** Adicionar função de atualização e modificar query:

```javascript
// Adicionar função para atualizar testes expirados
const updateExpiredTrials = async () => {
  if (!user) return;
  
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('user_trials')
    .update({ is_active: false })
    .lt('expires_at', now)
    .eq('is_active', true)
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Erro ao atualizar testes expirados:', error);
  }
};

useEffect(() => {
  const fetchActiveTrials = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Atualizar testes expirados primeiro
      await updateExpiredTrials();
      
      // Buscar apenas testes realmente ativos
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_trials')
        .select(`
          *,
          registered_apps:app_id (...)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', now) // Adicionar esta verificação
        .order('started_at', { ascending: false });

      if (error) throw error;

      setTrials(data || []);
    } catch (error) {
      console.error('Erro ao buscar testes:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar seus testes.',
      });
    } finally {
      setLoading(false);
    }
  };

  fetchActiveTrials();
}, [user, toast]);
```

---

## 📝 Notas Importantes

1. **Aplicar Migration é OBRIGATÓRIO** para resolver o problema do email admin
2. **Verificar URLs no banco** é essencial para aplicações carregarem
3. **Testes expirados** devem ser atualizados automaticamente
4. **Popup blockers** podem impedir aplicações de abrirem
5. **Aplicações web** devem verificar acesso ao carregar

---

**Última atualização:** 2025-01-10  
**Status:** Aguardando aplicação das correções



