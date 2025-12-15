# 🔧 Corrigir Problema: Produção Não Funciona

## 🔍 Problema Identificado

- ✅ **Localhost funciona**: http://localhost:3001/
- ❌ **Produção não funciona**: https://www.lwdigitalforge.com/

---

## 🎯 Causas Prováveis

### 1. Variáveis de Ambiente Não Configuradas em Produção
O mais comum: as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) não estão configuradas no ambiente de produção (Vercel/Firebase Hosting).

### 2. Build Não Atualizado
O build de produção pode estar desatualizado ou não ter as últimas mudanças.

### 3. URLs Não Configuradas no Supabase
A URL de produção pode não estar nas Redirect URLs do Supabase.

---

## ✅ Solução Passo a Passo

### Passo 1: Verificar/Configurar Variáveis de Ambiente no Vercel

Se você está usando **Vercel**:

1. **Acesse o Vercel Dashboard**:
   - https://vercel.com/dashboard
   - Selecione o projeto `LWDigitalForge_Texte` (ou nome do seu projeto)

2. **Vá em Settings > Environment Variables**:
   - Clique em **Settings** (Configurações)
   - Clique em **Environment Variables** (Variáveis de Ambiente)

3. **Adicione as Variáveis**:
   - Clique em **Add New**
   - Adicione cada variável:

   **Variável 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://wwwwyuwighdehmvnolrl.supabase.co`
   - **Environment**: Selecione todas (Production, Preview, Development)

   **Variável 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83` (ou a chave correta do Supabase)
   - **Environment**: Selecione todas (Production, Preview, Development)

4. **Salve e Faça Redeploy**:
   - Clique em **Save**
   - Vá em **Deployments**
   - Clique nos três pontos do último deployment
   - Selecione **Redeploy**

---

### Passo 2: Verificar/Configurar Variáveis de Ambiente no Firebase Hosting

Se você está usando **Firebase Hosting**:

1. **Via Firebase Console** (se usar Firebase Functions):
   - Acesse: https://console.firebase.google.com/
   - Selecione o projeto
   - Vá em Functions > Config
   - Adicione as variáveis de ambiente

2. **Via Arquivo `.env.production`** (para build local):
   - Crie um arquivo `.env.production` na raiz do projeto:
   ```env
   VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```
   - Faça build: `npm run build`
   - Deploy: `firebase deploy --only hosting`

---

### Passo 3: Verificar URLs no Supabase

1. **Acesse o Supabase Dashboard**:
   - https://app.supabase.com/
   - Vá em **Authentication** > **URL Configuration**

2. **Verifique/Adicione a URL de Produção**:
   - **Site URL**: `https://www.lwdigitalforge.com`
   - **Redirect URLs**: Certifique-se de ter:
     ```
     https://www.lwdigitalforge.com/**
     https://www.lwdigitalforge.com/auth/callback
     ```

3. **Salve as alterações**

---

### Passo 4: Fazer Novo Build e Deploy

#### Se usar Vercel:

```bash
# Fazer build local para testar
npm run build

# Verificar se o build funciona
npm run preview

# Se funcionar, faça push para o GitHub
git add .
git commit -m "fix: adicionar variáveis de ambiente para produção"
git push
```

O Vercel fará deploy automaticamente.

#### Se usar Firebase Hosting:

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 🧪 Testar em Produção

### 1. Verificar Variáveis de Ambiente no Console

No navegador, acesse https://www.lwdigitalforge.com e abra o Console (F12):

```javascript
// Verificar se as variáveis estão carregadas
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key presente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Se aparecer `undefined`**: As variáveis não estão configuradas em produção.

### 2. Verificar Erros no Console

Procure por erros como:
- `Invalid API key`
- `Failed to fetch`
- `VITE_SUPABASE_URL is not defined`

---

## 🔍 Diagnóstico Detalhado

### Verificar se o Build Está Correto

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Verificar arquivos gerados**:
   - Verifique se a pasta `dist` foi criada
   - Abra `dist/index.html` e verifique se há referências às variáveis

3. **Preview local**:
   ```bash
   npm run preview
   ```
   - Acesse http://localhost:3000
   - Teste se funciona

### Verificar Logs de Deploy

**No Vercel**:
- Vá em Deployments
- Clique no último deployment
- Verifique os logs de build
- Procure por erros relacionados a variáveis de ambiente

**No Firebase**:
- Verifique os logs do Firebase Hosting
- Procure por erros de build

---

## ⚠️ Problemas Comuns

### Problema 1: Variáveis Não Estão Disponíveis em Produção

**Sintoma**: App funciona localmente mas não em produção.

**Solução**:
1. Configure as variáveis no Vercel/Firebase
2. Faça redeploy
3. Verifique se as variáveis estão sendo usadas no build

### Problema 2: Build Antigo

**Sintoma**: Mudanças não aparecem em produção.

**Solução**:
1. Faça um novo build: `npm run build`
2. Faça deploy novamente
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Problema 3: CORS ou URLs Não Configuradas

**Sintoma**: Erros de CORS ou redirect_uri_mismatch.

**Solução**:
1. Adicione a URL de produção nas Redirect URLs do Supabase
2. Verifique se a Site URL está configurada corretamente

---

## 📋 Checklist de Correção

- [ ] Configurei variáveis de ambiente no Vercel/Firebase
- [ ] Adicionei `VITE_SUPABASE_URL` em produção
- [ ] Adicionei `VITE_SUPABASE_ANON_KEY` em produção
- [ ] Fiz redeploy após configurar variáveis
- [ ] Verifiquei URLs no Supabase (Site URL e Redirect URLs)
- [ ] Adicionei `https://www.lwdigitalforge.com/**` nas Redirect URLs
- [ ] Testei build local (`npm run build`)
- [ ] Testei preview local (`npm run preview`)
- [ ] Verifiquei console do navegador em produção
- [ ] Verifiquei logs de deploy

---

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Firebase Console**: https://console.firebase.google.com/
- **Supabase URL Configuration**: https://app.supabase.com/project/wwwwyuwighdehmvnolrl/auth/url-configuration

---

## 🚀 Próximos Passos

1. **Configure as variáveis de ambiente no seu provedor de hosting** (Vercel/Firebase)
2. **Faça redeploy**
3. **Teste em produção**
4. **Verifique o console do navegador** para erros

---

**Última atualização**: 2025-01-06
