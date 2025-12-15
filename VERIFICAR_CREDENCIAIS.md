# 🔍 Verificação de Credenciais do Supabase

## 📋 Status Atual

**Chave configurada no `.env`:**
```
VITE_SUPABASE_ANON_KEY=sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

**URL configurada:**
```
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
```

---

## ✅ Como Verificar se a Chave Está Correta

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com/
2. Faça login
3. Selecione o projeto: `LW_Digital_Forge / principal PRODUÇÃO`

### Passo 2: Verificar a Chave Anon/Public

1. Vá em **Settings** (Configurações) > **API**
2. Procure pela seção **Project API keys**
3. Localize a chave **anon** ou **public** (não a service_role!)
4. Compare com a chave no seu `.env`:
   - ✅ Se for igual → A chave está correta
   - ❌ Se for diferente → Atualize o `.env` com a chave correta

### Passo 3: Verificar a URL

1. Na mesma página (Settings > API)
2. Verifique o **Project URL**
3. Deve ser: `https://wwwwyuwighdehmvnolrl.supabase.co`
4. Se for diferente, atualize no `.env`

---

## 🔧 Se a Chave Estiver Incorreta

### Atualizar o arquivo `.env`:

1. Abra o arquivo `.env` na raiz do projeto
2. Atualize a linha:
   ```env
   VITE_SUPABASE_ANON_KEY=nova_chave_copiada_do_supabase
   ```
3. Salve o arquivo
4. **Reinicie o servidor de desenvolvimento**:
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

---

## 🧪 Testar se Está Funcionando

### Teste Rápido no Console do Navegador:

1. Abra o app: http://localhost:3001
2. Abra o Console (F12)
3. Digite:
   ```javascript
   // Verificar se as variáveis estão carregadas
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Key presente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

### Teste de Conexão:

No console do navegador, tente:
```javascript
// Importar o cliente Supabase
const { supabase } = await import('/src/lib/customSupabaseClient.js');

// Testar uma query simples
supabase.from('profiles').select('count').then(result => {
  if (result.error) {
    console.error('❌ Erro:', result.error.message);
  } else {
    console.log('✅ Conexão OK!', result);
  }
});
```

---

## ⚠️ Erros Comuns e Soluções

### Erro: "Invalid API key"
- **Causa**: Chave incorreta ou expirada
- **Solução**: Copie a chave correta do Supabase Dashboard e atualize o `.env`

### Erro: "JWT expired"
- **Causa**: Chave expirada
- **Solução**: Regenere a chave no Supabase Dashboard e atualize o `.env`

### Erro: "Failed to fetch"
- **Causa**: URL incorreta ou problema de CORS
- **Solução**: Verifique se a URL está correta e começa com `https://`

---

## 📝 Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Verifiquei a chave anon/public em Settings > API
- [ ] Comparei com a chave no `.env`
- [ ] Se diferente, atualizei o `.env` com a chave correta
- [ ] Verifiquei a URL do projeto
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Testei a conexão no console do navegador

---

## 🔗 Link Direto

**Settings > API do seu projeto:**
https://app.supabase.com/project/wwwwyuwighdehmvnolrl/settings/api

---

**Última atualização**: 2025-01-06
