# 🔐 Guia: Corrigir Erro de Credenciais do Supabase

## 🔍 Diagnóstico do Problema

Se você está recebendo erros relacionados a credenciais do Supabase, siga este guia para identificar e corrigir o problema.

---

## 📋 Verificação Rápida

### 1. Verificar Credenciais no Código

O arquivo `src/lib/customSupabaseClient.js` está usando:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83';
```

**Problema comum**: A chave anon key pode estar expirada ou incorreta.

---

## ✅ Solução: Obter Credenciais Corretas

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com/
2. Faça login na sua conta
3. Selecione o projeto: `LW_Digital_Forge / principal PRODUÇÃO`

### Passo 2: Obter as Credenciais

1. No menu lateral, clique em **Settings** (Configurações)
2. Clique em **API**
3. Você verá duas seções importantes:

#### **Project URL**
```
https://wwwwyuwighdehmvnolrl.supabase.co
```
✅ Esta deve corresponder à URL no código

#### **Project API keys**

**anon / public key** (esta é a que você precisa):
- Esta é a chave pública que pode ser usada no frontend
- Procure por: `anon` ou `public` key
- Formato: `sb_publishable_...` ou `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**service_role key** (NÃO use no frontend):
- Esta chave é apenas para backend/Edge Functions
- ⚠️ **NUNCA** exponha esta chave no frontend

---

## 🔧 Como Corrigir

### Opção 1: Usar Variáveis de Ambiente (Recomendado)

1. **Crie um arquivo `.env` na raiz do projeto** (se não existir):

```bash
# .env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

2. **Substitua `sua_chave_anon_aqui`** pela chave anon que você copiou do Supabase Dashboard

3. **Reinicie o servidor de desenvolvimento**:
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### Opção 2: Atualizar Valores Hardcoded (Temporário)

Se você não quiser usar `.env` por enquanto, edite `src/lib/customSupabaseClient.js`:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_AQUI';
```

⚠️ **Atenção**: Não commite credenciais no código! Use variáveis de ambiente.

---

## 🧪 Testar as Credenciais

### Teste 1: Verificar no Console do Navegador

1. Abra o app no navegador (http://localhost:3001)
2. Abra o Console (F12)
3. Digite:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');
```

### Teste 2: Testar Conexão

No console do navegador:
```javascript
import { supabase } from './src/lib/customSupabaseClient.js';
supabase.from('profiles').select('count').then(console.log);
```

Se funcionar, as credenciais estão corretas.

---

## ⚠️ Erros Comuns

### Erro: "Invalid API key"

**Causa**: A chave anon key está incorreta ou expirada.

**Solução**:
1. Acesse o Supabase Dashboard
2. Vá em Settings > API
3. Copie a chave `anon` / `public` novamente
4. Atualize no `.env` ou no código

### Erro: "Failed to fetch"

**Causa**: URL do Supabase incorreta ou problema de CORS.

**Solução**:
1. Verifique se a URL está correta: `https://wwwwyuwighdehmvnolrl.supabase.co`
2. Verifique se não há espaços extras
3. Verifique se está usando `https://` (não `http://`)

### Erro: "JWT expired" ou "Invalid JWT"

**Causa**: A chave anon key expirou ou foi regenerada.

**Solução**:
1. Acesse o Supabase Dashboard
2. Vá em Settings > API
3. Se necessário, regenere a chave anon
4. Atualize no `.env` ou no código

---

## 📝 Checklist de Verificação

- [ ] Acessei o Supabase Dashboard
- [ ] Verifiquei a URL do projeto (Settings > API)
- [ ] Copiei a chave `anon` / `public` correta
- [ ] Criei/atualizei o arquivo `.env` na raiz do projeto
- [ ] Adicionei `VITE_SUPABASE_URL` no `.env`
- [ ] Adicionei `VITE_SUPABASE_ANON_KEY` no `.env`
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Testei a conexão no console do navegador
- [ ] Verifiquei que o `.env` está no `.gitignore` (não commitar credenciais!)

---

## 🔒 Segurança

### ⚠️ IMPORTANTE: Nunca Faça Isso

- ❌ **NÃO** commite o arquivo `.env` no Git
- ❌ **NÃO** use a `service_role` key no frontend
- ❌ **NÃO** compartilhe credenciais em chats ou emails
- ❌ **NÃO** deixe credenciais hardcoded no código em produção

### ✅ Boas Práticas

- ✅ Use variáveis de ambiente (`.env`)
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Use apenas a chave `anon` / `public` no frontend
- ✅ Use `service_role` apenas em Edge Functions/backend
- ✅ Revogue e regenere chaves se expostas acidentalmente

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com/
- **Settings > API**: https://app.supabase.com/project/wwwwyuwighdehmvnolrl/settings/api
- **Documentação Supabase**: https://supabase.com/docs/guides/auth

---

## 📞 Se Ainda Não Funcionar

1. Verifique se o projeto Supabase está ativo
2. Verifique se não há problemas de rede/firewall
3. Verifique os logs do Supabase Dashboard para erros
4. Tente regenerar as chaves no Supabase Dashboard

---

**Última atualização**: 2025-01-06
