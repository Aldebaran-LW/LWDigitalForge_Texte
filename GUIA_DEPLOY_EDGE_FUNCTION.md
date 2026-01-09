# 🚀 Guia de Deploy da Edge Function check-subscription

## ❌ Problema Atual

O Supabase CLI não está instalado ou não está autenticado. Você precisa fazer uma das seguintes opções:

---

## ✅ Opção 1: Instalar Supabase CLI e Fazer Login (Recomendado)

### Passo 1: Instalar Supabase CLI

```powershell
# Via npm (requer Node.js instalado)
npm install -g supabase

# Ou use npx (não requer instalação global)
npx supabase --version
```

### Passo 2: Fazer Login

```powershell
npx supabase login
```

Isso abrirá o navegador para você fazer login com sua conta Supabase e autorizar o CLI.

### Passo 3: Linkar o Projeto (se necessário)

```powershell
npx supabase link --project-ref wwwwyuwighdehmvnolrl
```

### Passo 4: Fazer Deploy

```powershell
npx supabase functions deploy check-subscription
```

---

## ✅ Opção 2: Usar Token de Acesso Direto

Se você já tem um `SUPABASE_ACCESS_TOKEN`, pode configurar como variável de ambiente:

### Windows PowerShell:

```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
npx supabase functions deploy check-subscription
```

### Windows CMD:

```cmd
set SUPABASE_ACCESS_TOKEN=seu_token_aqui
npx supabase functions deploy check-subscription
```

### Como obter o Access Token:

1. Acesse: https://app.supabase.com/account/tokens
2. Clique em "Generate new token"
3. Copie o token gerado
4. Use como variável de ambiente (não commit no Git!)

---

## ✅ Opção 3: Deploy Manual via Dashboard do Supabase

### Passo 1: Acesse o Dashboard

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto: `wwwwyuwighdehmvnolrl`

### Passo 2: Vá para Edge Functions

1. No menu lateral, clique em **"Edge Functions"**
2. Clique em **"Create a new function"** (se não existir) ou edite a função existente

### Passo 3: Upload do Código

1. Abra o arquivo: `supabase/functions/check-subscription/index.ts`
2. Copie TODO o conteúdo do arquivo
3. Cole no editor do Dashboard
4. Clique em **"Deploy"**

### Passo 4: Configurar Secrets (se necessário)

A função usa automaticamente:
- `SUPABASE_URL` (automático)
- `SUPABASE_SERVICE_ROLE_KEY` (automático)

**Geralmente não é necessário configurar secrets manualmente**, mas se precisar:

1. No Dashboard, vá em **"Project Settings"** → **"Edge Functions"** → **"Secrets"**
2. Adicione os secrets necessários (mas eles já devem estar disponíveis automaticamente)

---

## ✅ Opção 4: Via GitHub Actions (Automático)

Se você já configurou GitHub Actions, pode fazer commit e push para a branch `main`:

```powershell
git add supabase/functions/check-subscription/index.ts
git commit -m "Atualizar check-subscription para sistema híbrido"
git push origin main
```

O GitHub Actions fará o deploy automaticamente (se configurado corretamente).

---

## 🔍 Verificação Pós-Deploy

Após o deploy, teste a função:

### Via Script NPM:

```powershell
npm run test:check-subscription:prod
```

### Via cURL:

```powershell
curl -X POST https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"seu-user-id\",\"email\":\"seu-email@exemplo.com\",\"appId\":\"e8ff7872-dedb-405c-bf8a-f7901ac4b432\"}'
```

### Resposta Esperada:

```json
{
  "hasAccess": true,
  "isSubscriber": false,
  "isTrial": false,
  "subscriptionStatus": "none",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "appName": "JornadaPro",
  "appSlug": "jornadapro",
  "message": "Usuário não tem acesso ao app \"JornadaPro\" (ID: e8ff7872-dedb-405c-bf8a-f7901ac4b432)"
}
```

---

## 📋 Checklist de Deploy

- [ ] Supabase CLI instalado OU token de acesso configurado
- [ ] Autenticado no Supabase (`supabase login`)
- [ ] Código atualizado em `supabase/functions/check-subscription/index.ts`
- [ ] Deploy executado com sucesso
- [ ] Função testada após deploy
- [ ] Verificação de que a função retorna `appId` na resposta

---

## 🆘 Troubleshooting

### Erro: "Access token not provided"

**Solução:**
```powershell
npx supabase login
```

Ou configure a variável:
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token"
```

### Erro: "Function not found"

**Solução:** Certifique-se de estar no diretório raiz do projeto e que o arquivo existe:
```
supabase/functions/check-subscription/index.ts
```

### Erro: "Permission denied"

**Solução:** Verifique se você tem permissões de deploy no projeto Supabase.

### Erro: "Project not linked"

**Solução:**
```powershell
npx supabase link --project-ref wwwwyuwighdehmvnolrl
```

---

## 🔗 URLs da Função

Após o deploy, a função estará disponível em:

- **Edge Function direta:**
  ```
  https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
  ```

- **Via proxy (se configurado):**
  ```
  https://lwdigitalforge.com/api/check-subscription
  ```

---

## 📝 Mudanças Importantes na Nova Versão

⚠️ **ATENÇÃO**: A função agora **EXIGE** o parâmetro `appId` ou `productId`!

### Antes:
```json
{
  "userId": "...",
  "email": "..."
}
```

### Agora (Obrigatório):
```json
{
  "userId": "...",
  "email": "...",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}
```

A função agora verifica acesso **específico ao app**, não acesso geral!

---

## 📚 Documentação Adicional

- **README da função:** `supabase/functions/check-subscription/README.md`
- **Código da função:** `supabase/functions/check-subscription/index.ts`
- **Documentação do banco:** `ESTRUTURA_BANCO_DADOS_SITE_PRINCIPAL.md`

