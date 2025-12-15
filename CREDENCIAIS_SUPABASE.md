# 🔐 Credenciais do Supabase - Configuração Correta

## 📋 Credenciais Atualizadas

### Para Frontend (Variáveis de Ambiente)

```env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
```

### Para Backend/CLI (Access Token)

```env
SUPABASE_ACCESS_TOKEN=sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

---

## ⚠️ Importante: Diferença Entre as Chaves

### `VITE_SUPABASE_ANON_KEY` (Frontend)
- **Formato**: JWT (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
- **Uso**: Frontend/Cliente (pode ser exposta no navegador)
- **Onde usar**: `src/lib/customSupabaseClient.js`
- **Variável**: `VITE_SUPABASE_ANON_KEY`

### `SUPABASE_ACCESS_TOKEN` (Backend/CLI)
- **Formato**: `sb_publishable_...`
- **Uso**: Backend, Edge Functions, CLI, MCP
- **Onde usar**: Edge Functions, scripts, MCP config
- **Variável**: `SUPABASE_ACCESS_TOKEN`

---

## 🔧 Como Configurar

### 1. Arquivo `.env` (Desenvolvimento Local)

Crie/atualize o arquivo `.env` na raiz do projeto:

```env
# Supabase - Frontend
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA

# Supabase - Backend/CLI
SUPABASE_ACCESS_TOKEN=sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

### 2. Vercel (Produção)

No Vercel Dashboard > Settings > Environment Variables, adicione:

**Variável 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://wwwwyuwighdehmvnolrl.supabase.co`
- Environment: Production, Preview, Development

**Variável 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA`
- Environment: Production, Preview, Development

**Variável 3 (para Edge Functions):**
- Name: `SUPABASE_ACCESS_TOKEN`
- Value: `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83`
- Environment: Production, Preview, Development

### 3. Firebase Hosting (Se usar)

Configure via Firebase Console ou crie `.env.production`:

```env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
```

---

## ✅ Verificação

### Teste Local

1. Atualize o arquivo `.env` com as credenciais acima
2. Reinicie o servidor: `npm run dev`
3. No console do navegador (F12):
   ```javascript
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'OK' : 'FALTANDO');
   ```

### Teste em Produção

Após configurar no Vercel e fazer redeploy:
1. Acesse https://www.lwdigitalforge.com
2. Abra o Console (F12)
3. Verifique se as variáveis estão carregadas

---

## 🔒 Segurança

- ✅ `VITE_SUPABASE_ANON_KEY` (JWT) pode ser exposta no frontend
- ✅ `SUPABASE_ACCESS_TOKEN` (sb_publishable) é para backend/CLI
- ❌ **NUNCA** exponha a `service_role` key no frontend
- ❌ **NUNCA** commite o arquivo `.env` no Git

---

## 📝 Notas

- O código foi atualizado com a chave anon correta (JWT) como fallback
- O `env.example.txt` foi atualizado com as credenciais corretas
- Certifique-se de atualizar o `.env` local e as variáveis no Vercel

---

**Última atualização**: 2025-01-06
