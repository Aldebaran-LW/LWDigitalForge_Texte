# 🔗 Guia: Configurar URLs Autorizadas no Supabase

## 📍 Localização no Painel do Supabase

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - URL: https://app.supabase.com/
   - Faça login na sua conta

2. **Selecione seu Projeto**
   - Clique no projeto: `lwdigitalforge` (ou o nome do seu projeto)

3. **Navegue até Authentication**
   - No menu lateral esquerdo, clique em **Authentication**
   - Ou acesse diretamente: `https://app.supabase.com/project/[seu-project-id]/auth/url-configuration`

4. **Vá em URL Configuration**
   - No menu de Authentication, clique em **URL Configuration**
   - Esta é a seção onde você configura as URLs autorizadas

---

## ⚙️ Configurações Necessárias

### 1. Site URL
**O que é**: A URL principal do seu site em produção

**Onde configurar**: Campo **Site URL**

**Valor recomendado**:
```
https://lwdigitalforge.web.app
```
ou
```
https://lwdigitalforge.firebaseapp.com
```
(Use a URL do seu Firebase Hosting ou Vercel)

**Para desenvolvimento local**:
```
http://localhost:3000
```

---

### 2. Redirect URLs
**O que é**: Lista de URLs permitidas para redirecionamento após autenticação

**Onde configurar**: Campo **Redirect URLs** (lista, uma por linha)

**URLs que você DEVE adicionar**:

#### Para Produção:
```
https://lwdigitalforge.web.app/**
https://lwdigitalforge.web.app/auth/callback
https://lwdigitalforge.web.app/*
```

#### Para Desenvolvimento Local:
```
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/*
```

#### URL do Supabase (sempre necessária):
```
https://wwwwyuwighdehmvnolrl.supabase.co/auth/v1/callback
```

**Formato completo recomendado**:
```
https://lwdigitalforge.web.app/**
https://lwdigitalforge.web.app/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/callback
https://wwwwyuwighdehmvnolrl.supabase.co/auth/v1/callback
```

---

## 📝 Exemplo Visual da Configuração

```
┌─────────────────────────────────────────────────────────┐
│  Authentication > URL Configuration                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Site URL:                                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ https://lwdigitalforge.web.app                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Redirect URLs:                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ https://lwdigitalforge.web.app/**                 │ │
│  │ https://lwdigitalforge.web.app/auth/callback      │ │
│  │ http://localhost:3000/**                          │ │
│  │ http://localhost:3000/auth/callback               │ │
│  │ https://wwwwyuwighdehmvnolrl.supabase.co/auth/... │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Save]                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Onde Cada URL é Usada

### Site URL
- Usado como URL padrão para redirecionamentos
- Usado em emails de confirmação
- Usado como fallback quando nenhuma redirect URL específica é fornecida

### Redirect URLs
- **`/auth/callback`**: Página de callback após login OAuth (Google, etc.)
- **`/**`**: Permite redirecionamento para qualquer rota do seu app
- **`/*`**: Similar ao anterior, permite qualquer sub-rota

---

## ⚠️ Importante

### 1. Use `**` para Permitir Sub-rotas
O padrão `**` permite que qualquer sub-rota seja usada para redirecionamento:
- ✅ `https://lwdigitalforge.web.app/portal/meus-produtos`
- ✅ `https://lwdigitalforge.web.app/admin/dashboard`
- ✅ `https://lwdigitalforge.web.app/auth/callback`

### 2. Sempre Inclua a URL do Supabase
A URL `https://[seu-project-ref].supabase.co/auth/v1/callback` é necessária para o fluxo OAuth funcionar.

### 3. Para Desenvolvimento Local
Adicione sempre as URLs de `localhost` para poder testar localmente:
- `http://localhost:3000/**`
- `http://localhost:3000/auth/callback`

### 4. Salve as Configurações
Após adicionar as URLs, **clique em "Save"** para salvar as alterações.

---

## 🧪 Como Testar

### 1. Teste Local
```bash
npm run dev
```
- Acesse: `http://localhost:3000`
- Tente fazer login com Google
- Verifique se o redirecionamento funciona

### 2. Teste em Produção
- Acesse: `https://lwdigitalforge.web.app`
- Tente fazer login com Google
- Verifique se o redirecionamento funciona

### 3. Verificar no Console
Se houver erro de redirecionamento, você verá no console do navegador:
```
Error: redirect_uri_mismatch
```

Isso significa que a URL não está na lista de Redirect URLs permitidas.

---

## 🔧 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URL de redirecionamento não está na lista de Redirect URLs permitidas.

**Solução**:
1. Verifique qual URL está sendo usada (veja no console do navegador)
2. Adicione essa URL exata na lista de Redirect URLs
3. Salve as configurações
4. Tente novamente

### Erro: "Invalid redirect URL"

**Causa**: A URL não está no formato correto ou não está autorizada.

**Solução**:
1. Verifique se a URL começa com `http://` ou `https://`
2. Verifique se não há espaços extras
3. Use `**` para permitir sub-rotas
4. Certifique-se de que salvou as configurações

### Login Funciona Localmente mas Não em Produção

**Causa**: URLs de produção não estão configuradas.

**Solução**:
1. Adicione as URLs de produção na lista de Redirect URLs
2. Configure a Site URL para a URL de produção
3. Salve as configurações

---

## 📋 Checklist de Configuração

- [ ] Acessei o Supabase Dashboard
- [ ] Naveguei até Authentication > URL Configuration
- [ ] Configurei a Site URL (produção)
- [ ] Adicionei Redirect URLs de produção
- [ ] Adicionei Redirect URLs de desenvolvimento (localhost)
- [ ] Adicionei a URL do Supabase callback
- [ ] Salvei as configurações
- [ ] Testei login localmente
- [ ] Testei login em produção

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com/
- **Documentação Supabase Auth**: https://supabase.com/docs/guides/auth
- **URL Configuration Docs**: https://supabase.com/docs/guides/auth/url-configuration

---

**Última atualização**: 2025-01-06
