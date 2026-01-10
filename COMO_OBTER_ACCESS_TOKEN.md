# 🔑 Como Obter o Access Token do Supabase

## ⚠️ Importante

As chaves que você forneceu são:
- ✅ **Publishable Key** (`sb_publishable_...`) - Para uso no frontend
- ✅ **Anon Key** - Para uso no frontend
- ❌ **NÃO são o Access Token** necessário para deploy

## 🎯 O que você precisa

Para fazer deploy de Edge Functions, você precisa do **Access Token** do Supabase CLI.

## 📝 Passo a Passo

### 1. Acesse o Dashboard do Supabase

1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto: `wwwwyuwighdehmvnolrl`

### 2. Acesse as Configurações de Tokens

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **Access Tokens** (ou vá direto para: https://supabase.com/dashboard/account/tokens)

### 3. Criar um Novo Token

1. Clique em **Generate New Token**
2. Dê um nome descritivo (ex: "CLI Deploy Token")
3. Selecione as permissões necessárias:
   - ✅ **Read** (para listar projetos)
   - ✅ **Write** (para fazer deploy)
4. Clique em **Generate Token**
5. **⚠️ IMPORTANTE:** Copie o token imediatamente! Ele só aparece uma vez.

### 4. Usar o Token

**Opção A: Variável de Ambiente (Recomendado)**

No PowerShell:
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
npx supabase functions deploy check-subscription
```

**Opção B: Login Interativo**

```powershell
npx supabase login
# Isso vai pedir o token ou abrir navegador
```

## 🔒 Segurança

- ⚠️ **NUNCA** commite o Access Token no Git
- ⚠️ **NUNCA** compartilhe o token publicamente
- ✅ Use variáveis de ambiente
- ✅ Adicione ao `.gitignore` se necessário

## 📋 Exemplo Completo

```powershell
# 1. Configurar token (substitua pelo seu token real)
$env:SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxxxxxxxxxxxxx"

# 2. Fazer deploy
npx supabase functions deploy check-subscription

# 3. Testar
npm run test:check-subscription:prod
```

## 🆘 Alternativa: Usar o Dashboard

Se não conseguir o Access Token, você pode fazer deploy manualmente pelo Dashboard:

1. Acesse: https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/functions
2. Clique em **Create Function**
3. Cole o conteúdo de `supabase/functions/check-subscription/index.ts`
4. Configure o nome: `check-subscription`

Mas o método via CLI é mais recomendado! ✅










