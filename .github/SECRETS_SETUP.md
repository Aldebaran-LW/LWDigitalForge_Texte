# 🔐 Configuração de Secrets - GitHub Actions

Este arquivo contém as instruções para configurar os secrets necessários para o deploy automático.

⚠️ **IMPORTANTE:** Este arquivo NÃO deve conter os valores reais dos tokens. Use apenas como referência.

## 📋 Secrets Necessários

### **1. Secrets do Vercel**

Configure em: GitHub → Settings → Secrets and variables → Actions → New repository secret

| Nome do Secret | Descrição | Valor |
|----------------|-----------|-------|
| `VERCEL_TOKEN` | Token de acesso do Vercel | `vck_1P8uFQFKdNmIqOwWD5JMgOpcEwCRV07Tgf3JIC9iwoyjotbYHJ3hW1m3` |
| `VERCEL_ORG_ID` | ID da organização (obter após primeiro deploy) | _A ser obtido após primeiro deploy manual_ |
| `VERCEL_PROJECT_ID` | ID do projeto (obter após primeiro deploy) | _A ser obtido após primeiro deploy manual_ |

### **2. Secrets de Ambiente (Build)**

| Nome do Secret | Descrição | Valor |
|----------------|-----------|-------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://wwwwyuwighdehmvnolrl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | _Obter do dashboard do Supabase_ |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Chave pública do Mercado Pago | _Obter do dashboard do Mercado Pago_ |

### **3. Secrets do Supabase (Edge Functions)**

Configure no Supabase Dashboard: Project Settings → Edge Functions → Secrets

| Nome do Secret | Descrição | Valor |
|----------------|-----------|-------|
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token do Mercado Pago | _Obter do dashboard do Mercado Pago_ |
| `SITE_URL` | URL base do site | `https://seu-site.vercel.app` |

## 🚀 Passo a Passo

### **Passo 1: Configurar Secrets do Vercel no GitHub**

1. Acesse: `https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions`
2. Clique em **New repository secret**
3. Adicione cada secret:

   ```
   Nome: VERCEL_TOKEN
   Valor: vck_1P8uFQFKdNmIqOwWD5JMgOpcEwCRV07Tgf3JIC9iwoyjotbYHJ3hW1m3
   ```

### **Passo 2: Obter VERCEL_ORG_ID e VERCEL_PROJECT_ID**

1. Instale o Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Faça login:
   ```bash
   vercel login
   ```

3. Faça o primeiro deploy:
   ```bash
   vercel
   ```

4. Após o deploy, o arquivo `.vercel/project.json` será criado com os IDs:
   ```json
   {
     "orgId": "team_xxxxx",
     "projectId": "prj_xxxxx"
   }
   ```

5. Adicione esses IDs como secrets no GitHub:
   - `VERCEL_ORG_ID` = valor de `orgId`
   - `VERCEL_PROJECT_ID` = valor de `projectId`

### **Passo 3: Configurar Secrets de Ambiente**

Adicione os secrets de ambiente necessários para o build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MERCADOPAGO_PUBLIC_KEY`

### **Passo 4: Configurar Secrets no Supabase**

1. Acesse o Supabase Dashboard
2. Vá em **Project Settings** → **Edge Functions** → **Secrets**
3. Adicione:
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `SITE_URL` (opcional)

## ✅ Verificação

Após configurar todos os secrets:

1. Faça um push para a branch `main`
2. Verifique em **Actions** se o workflow está executando
3. Verifique os logs para garantir que não há erros

## 🔒 Segurança

- ⚠️ **NUNCA** commite tokens ou secrets no código
- ⚠️ **NUNCA** compartilhe tokens publicamente
- ✅ Use sempre GitHub Secrets para valores sensíveis
- ✅ Use Supabase Secrets para Edge Functions

