# 🔍 Diagnóstico: Variáveis de Ambiente na Vercel

## 📊 Teste no Console do Navegador

Execute estes comandos no console do navegador (F12) do seu site em produção:

```javascript
// Teste 1: Verificar URL do Supabase
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);

// Teste 2: Verificar ANON_KEY do Supabase
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Teste 3: Verificar se está usando fallback
console.log('Usando fallback?', !import.meta.env.VITE_SUPABASE_URL);
```

---

## ✅ Interpretação dos Resultados

### Cenário 1: Variáveis Configuradas Corretamente ✅

**Resultado esperado:**
```
VITE_SUPABASE_URL: https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY: sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
Usando fallback? false
```

**Significado:**
- ✅ Variáveis estão configuradas na Vercel
- ✅ Site está usando variáveis de ambiente
- ✅ Tudo funcionando corretamente!

---

### Cenário 2: Variáveis NÃO Configuradas ⚠️

**Resultado esperado:**
```
VITE_SUPABASE_URL: undefined
VITE_SUPABASE_ANON_KEY: undefined
Usando fallback? true
```

**Significado:**
- ⚠️ Variáveis NÃO estão configuradas na Vercel
- ⚠️ Site está usando valores fallback hardcoded
- ✅ Site ainda funciona (graças ao fallback)
- 📝 **Ação:** Configure as variáveis na Vercel (veja instruções abaixo)

---

### Cenário 3: Variáveis Parcialmente Configuradas ⚠️

**Resultado esperado:**
```
VITE_SUPABASE_URL: https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY: undefined
```

**Significado:**
- ⚠️ Apenas uma variável está configurada
- ⚠️ A outra está usando fallback
- 📝 **Ação:** Configure a variável faltante na Vercel

---

## 🔧 Como Configurar as Variáveis na Vercel

### Passo 1: Acessar o Painel
1. Vá para: https://vercel.com/dashboard
2. Selecione seu projeto
3. Clique em **Settings** (Configurações)
4. Clique em **Environment Variables** (Variáveis de Ambiente)

### Passo 2: Adicionar Variáveis

**Variável 1:**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://wwwwyuwighdehmvnolrl.supabase.co`
- **Environments:** Marque todas (Production, Preview, Development)

**Variável 2:**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83`
- **Environments:** Marque todas (Production, Preview, Development)

### Passo 3: Fazer Novo Deploy

⚠️ **IMPORTANTE:** Variáveis de ambiente só são aplicadas em **novos deploys**!

1. Vá para **Deployments**
2. Clique nos **três pontos** (⋯) do último deploy
3. Selecione **Redeploy**
4. Aguarde o deploy completar
5. Teste novamente no console

---

## 🧪 Teste Completo de Conexão

Após configurar as variáveis e fazer o redeploy, teste a conexão completa:

```javascript
// No console do navegador
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Teste de conexão
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro de conexão:', error);
  } else {
    console.log('✅ Conexão com Supabase OK!', data);
  }
});
```

---

## 📋 Checklist Rápido

- [ ] Executei os testes no console
- [ ] Verifiquei o resultado (undefined ou valor?)
- [ ] Se undefined, configurei as variáveis na Vercel
- [ ] Fiz um novo deploy após configurar
- [ ] Testei novamente após o deploy
- [ ] Verifiquei se a conexão funciona

---

## 🆘 Problemas Comuns

### Problema: Variáveis ainda undefined após configurar
**Solução:** 
- Verifique se fez um novo deploy
- Verifique se os nomes das variáveis estão EXATOS (com VITE_ no início)
- Verifique se marcou os ambientes corretos (Production, Preview, Development)

### Problema: Erro de CORS
**Solução:**
- Verifique no Supabase Dashboard → Settings → API
- Adicione o URL do seu site na lista de URLs permitidas

### Problema: Site não funciona
**Solução:**
- O fallback hardcoded deve manter o site funcionando
- Verifique os logs do console para erros específicos
- Verifique se as credenciais estão corretas

---

## ✅ Resumo

**Status Atual do Código:**
- ✅ Tem fallback seguro (funciona mesmo sem variáveis)
- ✅ Credenciais atualizadas
- ⚠️ Recomendado configurar variáveis na Vercel

**Próximo Passo:**
1. Execute os testes no console
2. Se mostrar `undefined`, configure as variáveis
3. Faça um novo deploy
4. Teste novamente
