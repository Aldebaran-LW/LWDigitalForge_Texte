# 🔍 Verificar Variáveis de Ambiente

## 📋 Status Atual

### ✅ Secrets do Supabase (Edge Functions) - JÁ CONFIGURADOS

Os seguintes secrets já estão configurados no Dashboard do Supabase:

- ✅ `MERCADOPAGO_ACCESS_TOKEN_TESTE`
- ✅ `MERCADOPAGO_ACCESS_TOKEN`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`

---

## ❓ O Que Precisa Ser Verificado?

### 1. Secrets do Supabase (Edge Functions)

**Status:** ✅ **TUDO CONFIGURADO**

Os secrets necessários para a Edge Function `check-subscription` já estão presentes:
- ✅ `SUPABASE_URL` - Necessário para conectar ao Supabase
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Necessário para acessar o banco de dados

**⚠️ O secret do Google OAuth NÃO é necessário aqui** (é usado no frontend, não na Edge Function)

**Ação:** ✅ **Nenhuma ação necessária** - Tudo está configurado corretamente!

---

### 2. Variáveis de Ambiente na Vercel (Portal Principal)

**Projeto:** Portal Principal (LWDigitalForge_Texte)

Verifique na Vercel se estas variáveis estão configuradas:

#### Obrigatórias:
- ✅ `VITE_SUPABASE_URL` = `https://wwwwyuwighdehmvnolrl.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` = (chave anon do Supabase)
- ✅ `VITE_MERCADOPAGO_PUBLIC_KEY` = `APP_USR-a2044252-584b-4715-a558-bf11c837874a`

#### Opcionais (se usar webhooks):
- ⚠️ `SUPABASE_WEBHOOK_SECRET` = `21e38287-92bb-4260-940d-d543eec8ca17` (se usar webhooks)

**Como verificar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto do portal principal
3. **Settings** → **Environment Variables**
4. Verifique se as variáveis acima estão configuradas

**Ação:** ⚠️ **Verificar se todas as variáveis estão configuradas na Vercel**

---

### 3. Variáveis de Ambiente na Vercel (Aplicação JornadaPro)

**Projeto:** Ponto_Diario-1-2 (JornadaPro)

Verifique na Vercel se estas variáveis estão configuradas:

#### Obrigatórias:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://wwwwyuwighdehmvnolrl.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (chave anon do Supabase)
- ✅ `NEXT_PUBLIC_PRODUCT_ID` = `e8ff7872-dedb-405c-bf8a-f7901ac4b432`

#### Opcionais (se usar webhooks):
- ⚠️ `SUPABASE_WEBHOOK_SECRET` = `21e38287-92bb-4260-940d-d543eec8ca17` (se usar webhooks)

**Como verificar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto da aplicação JornadaPro
3. **Settings** → **Environment Variables**
4. Verifique se as variáveis acima estão configuradas

**Ação:** ⚠️ **Verificar se todas as variáveis estão configuradas na Vercel**

---

### 4. GitHub Secrets (para CI/CD)

**Repositório:** GitHub Actions

Se você usa GitHub Actions para deploy automático, verifique estes secrets:

#### Para Deploy no Supabase (se usar):
- ⚠️ `SUPABASE_ACCESS_TOKEN` = `sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12`
- ⚠️ `SUPABASE_PROJECT_REF` = `wwwwyuwighdehmvnolrl`
- ⚠️ `SUPABASE_DB_PASSWORD` = (senha do banco de dados)

**Como verificar:**
1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets
2. Verifique se os secrets acima estão configurados

**Ação:** ⚠️ **Verificar se você usa GitHub Actions e se os secrets estão configurados**

---

## ✅ Checklist Completo

### Supabase (Edge Functions Secrets):
- [x] `SUPABASE_URL` - ✅ Configurado
- [x] `SUPABASE_SERVICE_ROLE_KEY` - ✅ Configurado
- [x] `SUPABASE_ANON_KEY` - ✅ Configurado
- [x] `SUPABASE_DB_URL` - ✅ Configurado
- [x] `MERCADOPAGO_ACCESS_TOKEN` - ✅ Configurado

**Status:** ✅ **TUDO OK - Nenhuma ação necessária!**

---

### Vercel (Portal Principal):
- [ ] `VITE_SUPABASE_URL` - ⚠️ **VERIFICAR**
- [ ] `VITE_SUPABASE_ANON_KEY` - ⚠️ **VERIFICAR**
- [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` - ⚠️ **VERIFICAR**
- [ ] `SUPABASE_WEBHOOK_SECRET` - ⚠️ **VERIFICAR (se usar webhooks)**

**Ação:** ⚠️ **Verificar na Vercel**

---

### Vercel (Aplicação JornadaPro):
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - ⚠️ **VERIFICAR**
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ⚠️ **VERIFICAR**
- [ ] `NEXT_PUBLIC_PRODUCT_ID` - ⚠️ **VERIFICAR**
- [ ] `SUPABASE_WEBHOOK_SECRET` - ⚠️ **VERIFICAR (se usar webhooks)**

**Ação:** ⚠️ **Verificar na Vercel**

---

### GitHub Secrets:
- [ ] `SUPABASE_ACCESS_TOKEN` - ⚠️ **VERIFICAR (se usar GitHub Actions)**
- [ ] `SUPABASE_PROJECT_REF` - ⚠️ **VERIFICAR (se usar GitHub Actions)**
- [ ] `SUPABASE_DB_PASSWORD` - ⚠️ **VERIFICAR (se usar GitHub Actions)**

**Ação:** ⚠️ **Verificar no GitHub (se usar CI/CD)**

---

## 🎯 Resumo Final

### ✅ Supabase Secrets (Edge Functions):
**TUDO CONFIGURADO - Nenhuma ação necessária!**

### ⚠️ Vercel (Portal e Aplicações):
**VERIFICAR se todas as variáveis estão configuradas**

### ⚠️ GitHub Secrets:
**VERIFICAR se você usa GitHub Actions e se os secrets estão configurados**

---

**Recomendação: Verifique as variáveis na Vercel para garantir que tudo está funcionando corretamente!** ✅
