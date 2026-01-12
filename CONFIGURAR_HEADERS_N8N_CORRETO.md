# ✅ Configurar Headers Corretamente no n8n

## 🎯 Método Mais Simples: Headers Diretos no Node

### **Passo 1: No Node HTTP Request**

1. Clique no node **"Atualizar Todos Usuários"**
2. Em **"Authentication"**, mude para **"None"** ou **"No Auth"**

### **Passo 2: Configurar Headers Manualmente**

1. Certifique-se que **"Send Headers"** está **ativado** (verde)
2. Em **"Header Parameters"**, adicione/edite cada header:

**Header 1:**
- **Name:** `apikey`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs`

**Header 2:**
- **Name:** `Authorization`
- **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs`

**Header 3:**
- **Name:** `Content-Type`
- **Value:** `application/json`

**Header 4:**
- **Name:** `Prefer`
- **Value:** `return=minimal`

### **Passo 3: Configurar URL e Method**

- **URL:** `https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_all_users_liberado_status`
- **Method:** `POST`

### **Passo 4: Salvar e Testar**

1. Clique em **"Save"**
2. Clique em **"Execute step"** para testar
3. Deve retornar status 200 ou 204

---

## 🔄 Alternativa: Usar Custom Authentication

Se preferir usar credenciais:

1. Cancele as credenciais de Header Auth que você criou
2. No n8n, vá em **"Credentials"** → **"Add Credential"**
3. Procure por **"Custom Authentication"** ou **"Custom Auth"**
4. Configure:
   - **Name:** `Supabase Headers`
   - Adicione os headers lá
5. No node, selecione essa credencial

**Mas o método de headers diretos é mais simples!**

---

## ✅ Resumo

**Método Recomendado:**
- ✅ Authentication: **None**
- ✅ Headers: Configure diretamente no node
- ✅ Mais simples e direto

**Não precisa criar credenciais separadas!**

---

**Configure os headers diretamente no node HTTP Request - é mais fácil!** 🎯
