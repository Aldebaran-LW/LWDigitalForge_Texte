# 🚀 Deploy Rápido - Edge Function check-subscription

## ⚠️ Instalação Global não Suportada

O Supabase CLI **não pode ser instalado globalmente** via `npm install -g`. 

Use uma das opções abaixo:

---

## ✅ Opção 1: Deploy via Dashboard (RECOMENDADO - Mais Rápido)

### Passo 1: Acessar o Dashboard
1. Abra: https://app.supabase.com/
2. Selecione o projeto: **wwwwyuwighdehmvnolrl**

### Passo 2: Edge Functions
1. No menu lateral, clique em **"Edge Functions"**
2. Se a função `check-subscription` já existir, clique nela para editar
3. Se não existir, clique em **"Create a new function"** e nomeie como `check-subscription`

### Passo 3: Copiar e Colar o Código
1. Abra o arquivo: `supabase/functions/check-subscription/index.ts` neste projeto
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole no editor** do Dashboard (Ctrl+V)
4. Clique em **"Deploy"** ou **"Save"**

✅ **Pronto!** A função será deployada automaticamente.

---

## ✅ Opção 2: Usar Token de Acesso

### Passo 1: Obter Token
1. Acesse: https://app.supabase.com/account/tokens
2. Clique em **"Generate new token"**
3. Dê um nome ao token (ex: "Deploy CLI")
4. **Copie o token gerado**

### Passo 2: Configurar e Deploy

**Windows PowerShell:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
npx supabase functions deploy check-subscription
```

**Windows CMD:**
```cmd
set SUPABASE_ACCESS_TOKEN=seu_token_aqui
npx supabase functions deploy check-subscription
```

---

## ✅ Opção 3: Instalar Supabase CLI Localmente (via Scoop)

Se você usa Windows, pode instalar via Scoop:

```powershell
# Instalar Scoop (se não tiver)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Instalar Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Fazer login (abre navegador)
supabase login

# Fazer deploy
supabase functions deploy check-subscription
```

---

## ✅ Opção 4: Usar npx sem Instalação (com Token)

Esta é a forma mais simples se você tiver o token:

```powershell
# 1. Obter token em: https://app.supabase.com/account/tokens
# 2. Executar:
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl
```

---

## 📋 Verificação Pós-Deploy

Após o deploy, teste a função:

```powershell
# Testar a função
curl -X POST https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test\",\"email\":\"test@test.com\",\"appId\":\"e8ff7872-dedb-405c-bf8a-f7901ac4b432\"}'
```

Ou use o script de teste:
```powershell
npm run test:check-subscription:prod
```

---

## ⚠️ Importante: Nova Versão Exige appId

A função atualizada **exige** o parâmetro `appId` ou `productId`:

```json
{
  "userId": "uuid-do-usuario",
  "email": "email@exemplo.com",
  "appId": "uuid-do-app"  // ← OBRIGATÓRIO
}
```

---

## 🎯 Recomendação Final

**Para deploy rápido agora:** Use a **Opção 1 (Dashboard)** - é a mais simples e não requer instalação de nada.

Para automação futura: Configure o token (Opção 2) ou instale via Scoop (Opção 3).

