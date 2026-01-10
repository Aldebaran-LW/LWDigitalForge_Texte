# 🔑 Diferença Entre os Tokens

## ❌ O que você tem agora:

```
sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

**Isso é um PUBLISHABLE KEY** - usado no frontend, NÃO para deploy!

## ✅ O que você precisa:

```
sbp_0102030405060708091011121314151617181920
```

**Isso é um ACCESS TOKEN** - usado para deploy via CLI!

---

## 📊 Comparação

| Tipo | Formato | Para que serve | Onde usar |
|------|---------|----------------|-----------|
| **Publishable Key** | `sb_publishable_...` | Frontend | Aplicação React |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIs...` | Frontend | Aplicação React |
| **Access Token** | `sbp_...` | CLI/Deploy | Deploy de funções |

---

## 🎯 Como Obter o Access Token Correto

### Passo 1: Acesse a Página de Tokens

Abra no navegador:
```
https://supabase.com/dashboard/account/tokens
```

**⚠️ IMPORTANTE:** Não é a página de API Keys, é a página de **Access Tokens**!

### Passo 2: Gere um Novo Token

1. Você verá uma seção chamada **"Access Tokens"** ou **"Personal Access Tokens"**
2. Clique em **"Generate New Token"** ou **"Create New Token"**
3. Dê um nome: `CLI Deploy`
4. Clique em **"Generate"** ou **"Create"**

### Passo 3: Copie o Token

O token que aparece deve:
- ✅ Começar com `sbp_` (não `sb_publishable_`)
- ✅ Ter cerca de 40-50 caracteres
- ✅ Exemplo: `sbp_0102030405060708091011121314151617181920`

---

## 🔍 Onde Está a Diferença?

### Publishable Key (o que você tem):
```
sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
     ↑
     Tem "publishable" no meio
```

### Access Token (o que você precisa):
```
sbp_0102030405060708091011121314151617181920
    ↑
    Só "sbp_" sem "publishable"
```

---

## 📝 Passo a Passo Visual

1. **Acesse:** https://supabase.com/dashboard/account/tokens

2. **Procure por:** Seção "Access Tokens" ou "Personal Access Tokens"

3. **Clique em:** "Generate New Token" ou botão similar

4. **Nome:** Digite `CLI Deploy Token`

5. **Gere:** Clique em "Generate" ou "Create"

6. **Copie:** O token que começa com `sbp_` (não `sb_publishable_`)

---

## ✅ Depois de Obter o Token Correto

Execute novamente:

```powershell
.\DEPLOY_COM_TOKEN.ps1
```

E cole o token que começa com `sbp_` (não `sb_publishable_`).

---

## 🆘 Ainda Não Encontrou?

Se você não encontrar a opção "Generate New Token":

1. Certifique-se de estar em: https://supabase.com/dashboard/account/tokens
2. Procure por "Personal Access Tokens" ou "API Tokens"
3. Pode estar em uma aba ou seção diferente
4. Se não encontrar, tente: https://supabase.com/dashboard/account/tokens/new

---

**🎯 Lembre-se: O token correto começa com `sbp_` (3 letras), não `sb_publishable_`!**










