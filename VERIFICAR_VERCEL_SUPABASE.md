# ✅ Verificação de Conexão Vercel ↔ Supabase

## 🔍 Como Verificar se a Vercel está Conectada Corretamente

### 📋 Checklist de Verificação

#### 1. **Variáveis de Ambiente na Vercel**

A conexão funciona através de variáveis de ambiente. Você precisa configurar no painel da Vercel:

**Acesse:** https://vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

**Variáveis necessárias:**
```
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

**Importante:**
- ✅ Configure para **Production**, **Preview** e **Development**
- ✅ Nomes exatos: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- ⚠️ Se não configurar, o código usará valores fallback hardcoded

---

#### 2. **Como o Código Funciona**

O arquivo `src/lib/customSupabaseClient.js` tem lógica de fallback:

```javascript
// Tenta usar variáveis de ambiente primeiro
// Se não existirem, usa valores hardcoded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83';
```

**Comportamento:**
- ✅ Se variáveis de ambiente existirem na Vercel → usa elas
- ⚠️ Se não existirem → usa valores hardcoded (funciona, mas não é ideal)

---

#### 3. **Verificar se Está Funcionando**

**Opção 1: Testar no Site em Produção**
1. Acesse seu site na Vercel
2. Abra o Console do Navegador (F12)
3. Tente fazer login
4. Verifique se há erros de conexão com Supabase

**Opção 2: Verificar Build Logs**
1. Vercel Dashboard → Deployments
2. Abra o último deploy
3. Verifique os logs de build
4. Procure por erros relacionados ao Supabase

**Opção 3: Testar Variáveis de Ambiente**
No console do navegador em produção, execute:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Se mostrar `undefined`, as variáveis não estão configuradas na Vercel.

---

## ⚙️ Como Configurar Corretamente

### Passo 1: Acessar Configurações da Vercel

1. Vá para: https://vercel.com/dashboard
2. Selecione seu projeto
3. Clique em **Settings**
4. Clique em **Environment Variables**

### Passo 2: Adicionar Variáveis

Clique em **Add New** e adicione:

**Variável 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://wwwwyuwighdehmvnolrl.supabase.co`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**Variável 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83`
- Environments: ✅ Production, ✅ Preview, ✅ Development

### Passo 3: Fazer Novo Deploy

Após adicionar as variáveis:
1. Vá para **Deployments**
2. Clique nos três pontos do último deploy
3. Selecione **Redeploy**
4. Aguarde o deploy completar

---

## 🔴 Problemas Comuns

### Problema 1: Variáveis não configuradas
**Sintoma:** Site funciona, mas usa valores hardcoded  
**Solução:** Configure as variáveis no painel da Vercel

### Problema 2: Nome incorreto das variáveis
**Sintoma:** Variáveis não são reconhecidas  
**Solução:** Verifique se os nomes são EXATAMENTE:
- `VITE_SUPABASE_URL` (com VITE_ no início!)
- `VITE_SUPABASE_ANON_KEY` (com VITE_ no início!)

### Problema 3: Variáveis não aplicadas após configuração
**Sintoma:** Mudou as variáveis, mas ainda não funciona  
**Solução:** Faça um novo deploy (as variáveis só são aplicadas em novos deploys)

### Problema 4: Erro de CORS ou conexão
**Sintoma:** Erros no console sobre CORS ou conexão recusada  
**Solução:** Verifique as configurações do Supabase:
1. Vá para Supabase Dashboard → Settings → API
2. Verifique se o URL do seu site está na lista de URLs permitidas

---

## ✅ Resumo

**Status Atual:**
- ✅ Código tem fallback seguro (funciona mesmo sem variáveis)
- ⚠️ **Recomendado:** Configurar variáveis de ambiente na Vercel
- ✅ Credenciais atualizadas no código

**Próximo Passo:**
1. Verificar se as variáveis estão configuradas na Vercel
2. Se não estiverem, configurá-las seguindo os passos acima
3. Fazer um novo deploy

---

## 🆘 Precisa de Ajuda?

Se ainda houver problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs de deploy na Vercel
3. Teste localmente com arquivo `.env` para garantir que funciona

