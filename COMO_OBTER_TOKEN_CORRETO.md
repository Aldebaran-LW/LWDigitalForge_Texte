# 🔑 Como Obter o Token Correto

## ⚠️ Erro: "Invalid access token format"

Se você viu essa mensagem, o token que você colou **não está no formato correto**.

## ✅ Formato Correto do Token

O Access Token do Supabase CLI deve:
- ✅ Começar com `sbp_`
- ✅ Ter aproximadamente 40-50 caracteres
- ✅ Exemplo: `sbp_0102030405060708091011121314151617181920`

## 📝 Passo a Passo para Obter o Token Correto

### 1. Acesse a Página de Tokens

Abra no navegador:
```
https://supabase.com/dashboard/account/tokens
```

### 2. Faça Login

Se não estiver logado, faça login na sua conta Supabase.

### 3. Gere um Novo Token

1. Clique no botão **"Generate New Token"** (ou "Criar Novo Token")
2. Dê um nome descritivo: `CLI Deploy Token`
3. **NÃO precisa selecionar permissões especiais** - deixe como está
4. Clique em **"Generate Token"** (ou "Gerar Token")

### 4. Copie o Token

⚠️ **IMPORTANTE:** O token aparece **APENAS UMA VEZ**!

- O token deve começar com `sbp_`
- Copie o token **COMPLETO** (não apenas parte dele)
- Cole no PowerShell quando o script pedir

### 5. Exemplo Visual

```
Token gerado:
sbp_0102030405060708091011121314151617181920
     ↑
     Deve começar assim!
```

## ❌ Tokens que NÃO Funcionam

- ❌ `sb_publishable_...` (Publishable Key - para frontend)
- ❌ `eyJhbGciOiJIUzI1NiIs...` (Anon Key - JWT)
- ❌ Qualquer token que não comece com `sbp_`

## ✅ Token que Funciona

- ✅ `sbp_0102030405060708091011121314151617181920` (Access Token do CLI)

## 🔄 Se Você Perdeu o Token

Se você perdeu ou não copiou o token:
1. Vá para: https://supabase.com/dashboard/account/tokens
2. Delete o token antigo (se quiser)
3. Gere um **novo token**
4. **Copie imediatamente** (aparece só uma vez!)

## 📋 Checklist

Antes de colar o token, verifique:

- [ ] O token começa com `sbp_`?
- [ ] O token tem aproximadamente 40-50 caracteres?
- [ ] Você copiou o token completo?
- [ ] Você obteve o token em: https://supabase.com/dashboard/account/tokens?

## 🎯 Próximo Passo

Depois de obter o token correto:

```powershell
.\DEPLOY_COM_TOKEN.ps1
```

Quando pedir, cole o token que começa com `sbp_`.










