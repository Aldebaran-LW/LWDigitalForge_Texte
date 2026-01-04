# ✅ Checklist Deploy Vercel

## 📋 Verificação da Configuração

### ✅ 1. Arquivo `vercel.json`
- ✅ **Status:** OK
- ✅ Proxy configurado para `/api/check-subscription`
- ✅ Rewrite para SPA (todas rotas → `/index.html`)

```json
{
  "rewrites": [
    {
      "source": "/api/check-subscription",
      "destination": "https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### ✅ 2. Script de Build
- ✅ **Status:** OK
- ✅ Script `build` configurado no `package.json`
- ✅ Comando: `node tools/generate-llms.js || true && vite build`

### ✅ 3. Variáveis de Ambiente (IMPORTANTE!)

⚠️ **Verifique se estas variáveis estão configuradas no Vercel:**

#### Variáveis Obrigatórias:

1. **VITE_SUPABASE_URL**
   - Valor: `https://wwwwyuwighdehmvnolrl.supabase.co`
   - Onde configurar: Vercel Dashboard → Project Settings → Environment Variables

2. **VITE_SUPABASE_ANON_KEY**
   - Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA`
   - Onde configurar: Vercel Dashboard → Project Settings → Environment Variables

#### Variáveis Opcionais (já têm fallback):

- `VITE_SUPABASE_FUNCTION_URL` - Tem fallback, não obrigatório

---

## 🔧 Como Configurar Variáveis no Vercel

1. Acesse: [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em: **Settings** → **Environment Variables**
4. Adicione as variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Marque para: **Production**, **Preview**, **Development**
6. Clique em **Save**
7. **IMPORTANTE:** Faça um novo deploy após adicionar variáveis

---

## 🚀 Comandos de Deploy

### Opção 1: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy de produção
vercel --prod
```

### Opção 2: Deploy via Git (Recomendado)

1. Faça push para o branch `main`:
   ```bash
   git push origin main
   ```

2. Vercel detecta automaticamente e faz deploy
3. Configure variáveis de ambiente no dashboard antes

---

## ✅ Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `vercel.json` está correto
- [ ] Build local funciona (`npm run build`)
- [ ] Testes passam (se houver)
- [ ] Código commitado e push feito
- [ ] Variáveis configuradas para Production, Preview e Development

---

## 🧪 Testar Build Localmente

Antes de fazer deploy, teste o build:

```bash
# Instalar dependências
npm install

# Testar build
npm run build

# Testar preview do build
npm run preview
```

Se o build funcionar localmente, deve funcionar no Vercel.

---

## ⚠️ Problemas Comuns

### 1. Variáveis de Ambiente Não Configuradas
**Sintoma:** App não conecta ao Supabase
**Solução:** Adicione as variáveis no Vercel Dashboard

### 2. Build Falha
**Sintoma:** Erro no deploy
**Solução:** Teste `npm run build` localmente primeiro

### 3. Proxy Não Funciona
**Sintoma:** `/api/check-subscription` retorna 404
**Solução:** Verifique se `vercel.json` está na raiz do projeto

### 4. Rotas Não Funcionam (404)
**Sintoma:** Páginas retornam 404
**Solução:** Verifique se o rewrite `/(.*)` → `/index.html` está configurado

---

## 📝 Status Atual

### ✅ Configuração OK

- ✅ `vercel.json` configurado corretamente
- ✅ Script de build configurado
- ✅ Proxy para API configurado
- ✅ Rewrite para SPA configurado

### ⚠️ Ação Necessária

- ⚠️ **Verificar variáveis de ambiente no Vercel Dashboard**
- ⚠️ **Adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` se não existirem**

---

## 🎯 Próximos Passos

1. Verifique se as variáveis estão no Vercel
2. Se não estiverem, adicione-as
3. Faça deploy (via Git push ou Vercel CLI)
4. Teste o site em produção
5. Verifique se o proxy `/api/check-subscription` funciona

---

## ✅ Conclusão

**Status:** Pronto para deploy! ✅

**Ação necessária:** Verificar/Configurar variáveis de ambiente no Vercel Dashboard.

