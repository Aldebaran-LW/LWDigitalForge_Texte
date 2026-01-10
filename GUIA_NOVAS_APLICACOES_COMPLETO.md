# 🚀 Guia Completo: Configurar Nova Aplicação com Verificação de Assinatura

## 📋 Checklist para Nova Aplicação

Este guia mostra **exatamente** o que fazer para configurar uma nova aplicação com o sistema de verificação de assinatura.

---

## ✅ Passo 1: Copiar Arquivos Essenciais

### Arquivos que TODA aplicação precisa ter:

1. **`app/api/verify-subscription/route.js`** (ou equivalente)
   - API route para verificação server-side com cache
   
2. **`lib/subscription-service.js`** (ou equivalente)
   - Serviço que chama a API route local
   
3. **`hooks/use-subscription.js`** (ou equivalente)
   - Hook React para verificar assinatura nos componentes
   
4. **`hooks/use-require-auth.js`** (ou equivalente)
   - Hook que combina autenticação + verificação de assinatura
   
5. **`app/assinatura-necessaria/page.js`** (ou equivalente)
   - Página para quando usuário não tem assinatura ativa

### 📁 Estrutura de Arquivos:

```
nova-aplicacao/
├── app/
│   ├── api/
│   │   └── verify-subscription/
│   │       └── route.js          ← Copiar
│   └── assinatura-necessaria/
│       └── page.js                ← Copiar
├── lib/
│   └── subscription-service.js    ← Copiar
└── hooks/
    ├── use-subscription.js        ← Copiar
    └── use-require-auth.js        ← Copiar
```

**Fonte:** Copiar do projeto `Ponto_Diario-1-2` (já configurado)

---

## ✅ Passo 2: Configurar Variáveis de Ambiente

### 2.1. Criar Arquivo `.env.local`

Na raiz da nova aplicação, crie `.env.local`:

```env
# ========================================
# SUPABASE - Configuração (SEMPRE as mesmas)
# ========================================

NEXT_PUBLIC_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs

# ========================================
# APLICAÇÃO - Configuração (ÚNICO POR APP)
# ========================================

# ⚠️ IMPORTANTE: Este é o UUID ÚNICO desta aplicação!
# Como encontrar: Portal Admin → Produtos → Editar → ID
# OU: Supabase → Table Editor → registered_apps → coluna "id"
NEXT_PUBLIC_PRODUCT_ID=UUID-DESTA-APLICACAO-AQUI

# ========================================
# OPCIONAL
# ========================================

NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
NEXT_PUBLIC_PORTAL_URL=https://www.lwdigitalforge.com
NEXT_PUBLIC_SUBSCRIPTION_URL=https://www.lwdigitalforge.com/portal/produtos
```

### 2.2. Encontrar o PRODUCT_ID Único da Nova Aplicação

**IMPORTANTE:** Cada aplicação precisa do seu próprio UUID!

#### Opção 1: Portal Admin (Recomendado)

1. Acesse: `https://lwdigitalforge.com/admin/produtos`
2. Faça login como admin
3. **Crie um novo produto** ou encontre o produto desta aplicação
4. Clique em "Editar"
5. Copie o **ID** (UUID)

#### Opção 2: Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. **Table Editor** → `registered_apps`
3. Se o produto não existe, **crie um novo registro**:
   - `name`: Nome da aplicação (ex: "Nova App")
   - `slug`: slug da aplicação (ex: "nova-app")
   - `vercel_deployment_url`: URL de deploy (ex: "https://nova-app.vercel.app")
4. Copie o **id** gerado automaticamente

#### Opção 3: SQL

```sql
-- Ver todos os produtos
SELECT id, name, slug, vercel_deployment_url 
FROM registered_apps;

-- OU criar novo produto
INSERT INTO registered_apps (name, slug, vercel_deployment_url)
VALUES ('Nova App', 'nova-app', 'https://nova-app.vercel.app')
RETURNING id;
```

**Copie o UUID retornado e use como `NEXT_PUBLIC_PRODUCT_ID`!**

---

## ✅ Passo 3: Configurar na Vercel

### 3.1. Identificar Projeto Correto

**✅ CORRETO:** Projeto da **NOVA APLICAÇÃO**
- Exemplo: `nova-app`, `minha-aplicacao`, etc.

**❌ ERRADO:** Projeto do portal principal ou outras aplicações

### 3.2. Adicionar Variáveis

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione o projeto da nova aplicação**
3. **Settings** → **Environment Variables**
4. **Adicione as mesmas 4 variáveis:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_PRODUCT_ID` (⚠️ UUID ÚNICO desta aplicação!)

5. **Marque todas para:** ✅ Production, ✅ Preview, ✅ Development
6. **Faça Redeploy** após adicionar

---

## ✅ Passo 4: Integrar no Código

### 4.1. Proteger Rotas

Use o hook `useRequireAuth` nas páginas que precisam de assinatura:

```jsx
// app/dashboard/page.js
'use client'
import { useRequireAuth } from '@/hooks/use-require-auth'

export default function DashboardPage() {
  const { user, empresa, loading, hasAccess } = useRequireAuth(true)
  
  if (loading) return <div>Carregando...</div>
  
  if (!hasAccess) {
    // useRequireAuth já redireciona para /assinatura-necessaria
    return null
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Seu conteúdo aqui */}
    </div>
  )
}
```

### 4.2. Verificar Assinatura Manualmente

Se precisar verificar em outros lugares:

```jsx
'use client'
import { useSubscription } from '@/hooks/use-subscription'

export default function MeuComponente() {
  const { user } = useAuth() // Seu hook de autenticação
  const { hasAccess, isSubscriber, isTrial, loading } = useSubscription(user?.id)
  
  if (loading) return <div>Verificando assinatura...</div>
  
  if (!hasAccess) {
    return <div>Assinatura necessária</div>
  }
  
  return <div>Conteúdo protegido</div>
}
```

### 4.3. Middleware (Next.js)

O middleware deve permitir que as rotas protegidas passem (verificação é feita no componente):

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const publicRoutes = ['/login', '/auth/callback', '/assinatura-necessaria']
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Rotas protegidas passam, verificação é feita no componente
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## ✅ Passo 5: Configurar Portal Principal

### 5.1. Registrar Aplicação no Portal

No portal principal (`LWDigitalForge_Texte`), certifique-se de que:

1. **Produto criado** na tabela `registered_apps` do Supabase
2. **Campo `vercel_deployment_url`** preenchido com a URL da aplicação
3. **Campo `slug`** único para identificação

### 5.2. Portal Salva appId no sessionStorage

Quando o usuário clica em "Acessar Aplicação" no portal, o código já salva:

```javascript
// No portal principal (já implementado)
sessionStorage.setItem('app_product_id', productId)
window.open(product.vercel_deployment_url, '_blank')
```

A aplicação lê automaticamente do `sessionStorage` ou usa `NEXT_PUBLIC_PRODUCT_ID` como fallback.

---

## ✅ Passo 6: Testar

### 6.1. Testar Localmente

```bash
npm run dev
```

No console do navegador (F12):
```javascript
console.log('Product ID:', process.env.NEXT_PUBLIC_PRODUCT_ID)
// Deve mostrar o UUID da aplicação
```

### 6.2. Testar API Route

```
http://localhost:3000/api/verify-subscription?userId=xxx&appId=UUID-DA-APLICACAO
```

Deve retornar:
```json
{
  "hasAccess": true/false,
  "isSubscriber": true/false,
  "isTrial": true/false,
  "cached": false
}
```

### 6.3. Testar Fluxo Completo

1. **Criar usuário de teste** no Supabase
2. **Criar assinatura/trial** para esse usuário:
   ```sql
   INSERT INTO user_purchases (user_id, app_id, status, expires_at)
   VALUES ('user-uuid', 'app-uuid', 'active', '2026-12-31');
   
   -- OU trial
   INSERT INTO user_trials (user_id, app_id, expires_at)
   VALUES ('user-uuid', 'app-uuid', '2026-12-31');
   ```
3. **Fazer login** na aplicação
4. **Verificar acesso** - deve permitir acesso
5. **Remover assinatura** - deve redirecionar para `/assinatura-necessaria`

---

## 📊 Checklist Final para Nova Aplicação

### Arquivos Copiados:

- [ ] `app/api/verify-subscription/route.js`
- [ ] `lib/subscription-service.js`
- [ ] `hooks/use-subscription.js`
- [ ] `hooks/use-require-auth.js`
- [ ] `app/assinatura-necessaria/page.js`

### Configuração:

- [ ] Criado arquivo `.env.local`
- [ ] Configurado `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Configurado `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configurado `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Criado/Encontrado produto** no Supabase (`registered_apps`)
- [ ] Configurado `NEXT_PUBLIC_PRODUCT_ID` com UUID ÚNICO desta aplicação

### Vercel:

- [ ] Identificado projeto correto na Vercel
- [ ] Configuradas todas as variáveis na Vercel
- [ ] Variáveis marcadas para Production, Preview e Development
- [ ] Feito redeploy após configurar

### Integração:

- [ ] Rotas protegidas usando `useRequireAuth`
- [ ] Middleware configurado
- [ ] Página `/assinatura-necessaria` criada

### Portal:

- [ ] Produto registrado no portal (tabela `registered_apps`)
- [ ] `vercel_deployment_url` configurado
- [ ] Portal salva `app_product_id` no sessionStorage (já implementado)

### Testes:

- [ ] Testado localmente
- [ ] Testado API route
- [ ] Testado fluxo completo (login → acesso → sem assinatura → bloqueado)
- [ ] Testado na Vercel após deploy

---

## 🎯 Diferenças Entre Aplicações

### ✅ O que é IGUAL para todas as aplicações:

- `NEXT_PUBLIC_SUPABASE_URL` - Sempre o mesmo
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Sempre o mesmo
- `SUPABASE_SERVICE_ROLE_KEY` - Sempre o mesmo
- Arquivos de código (copiar do `Ponto_Diario-1-2`)

### ⚠️ O que é ÚNICO para cada aplicação:

- **`NEXT_PUBLIC_PRODUCT_ID`** - UUID diferente para cada app!
- **Nome do projeto na Vercel**
- **URL de deploy** (`vercel_deployment_url`)
- **Registro na tabela `registered_apps`**

---

## 📚 Referências

### Documentação Completa:

- **`GUIA_COMPLETO_APLICACOES.md`** - Guia completo original
- **`QUICK_START_APLICACOES.md`** - Guia rápido
- **`COMO_ENCONTRAR_PRODUCT_ID.md`** - Como encontrar UUID do produto
- **`CONFIGURACAO_COMPLETA_FINAL.md`** - Configuração completa (exemplo do Ponto_Diario)

### Exemplo Funcionando:

- **Projeto:** `Ponto_Diario-1-2`
- **PRODUCT_ID:** `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- **Referência:** Use este projeto como base para novas aplicações

---

## 🚀 Resumo: Configurar Nova Aplicação em 5 Minutos

1. ✅ **Copiar arquivos** do `Ponto_Diario-1-2` (5 arquivos)
2. ✅ **Criar produto** no Supabase (ou usar existente)
3. ✅ **Configurar `.env.local`** com UUID único do produto
4. ✅ **Configurar na Vercel** (mesmas variáveis, UUID diferente)
5. ✅ **Testar** e fazer deploy!

**Tudo pronto para futuras aplicações!** 🎉

---

## ❓ Dúvidas Frequentes

### "Preciso criar webhook para cada aplicação?"

**NÃO!** A verificação é direta no banco com cache. Não precisa de webhook.

### "Posso usar o mesmo PRODUCT_ID para várias aplicações?"

**NÃO!** Cada aplicação precisa do seu próprio UUID na tabela `registered_apps`.

### "E se eu esquecer de configurar o PRODUCT_ID?"

A aplicação vai tentar ler do `sessionStorage` (se vier do portal), mas se falhar, vai negar acesso. Sempre configure o `NEXT_PUBLIC_PRODUCT_ID`!

### "Preciso alterar algo no portal principal?"

Não! O portal já está preparado. Apenas certifique-se de que o produto existe na tabela `registered_apps`.

---

**Tudo documentado e pronto para replicar em novas aplicações!** ✅
