# ⚙️ Configurar Workflow Importado no n8n

## ✅ Workflow Importado com Sucesso!

Seu workflow foi importado e tem a estrutura correta:
- ✅ Cron Trigger (executa a cada hora)
- ✅ HTTP Request (chama função RPC)
- ✅ Verificação de Sucesso/Erro

---

## 🔧 Configurações Necessárias

### **1. Configurar Variáveis de Ambiente no n8n**

O workflow usa `{{ $env.SUPABASE_URL }}` e `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`.

**Opção A: Configurar no Render (Recomendado)**

As variáveis já estão configuradas no Render! Mas o n8n precisa acessá-las.

**Opção B: Configurar Diretamente no Workflow**

1. No node "Atualizar Todos Usuários"
2. Substitua `{{ $env.SUPABASE_URL }}` por:
   ```
   https://wwwwyuwighdehmvnolrl.supabase.co
   ```
3. Substitua `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}` por:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs
   ```

---

## 🔐 Método Recomendado: Usar Credenciais

### **Passo 1: Criar Credencial HTTP Header Auth**

1. No n8n, vá em **"Credentials"** (menu lateral)
2. Clique em **"Add Credential"**
3. Procure por **"HTTP Header Auth"** ou **"Header Auth"**
4. Configure:
   - **Name:** `Supabase Service Role`
   - **Header Name:** `apikey`
   - **Header Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs`
   - Adicione também:
     - **Header Name:** `Authorization`
     - **Header Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs`
5. Salve

### **Passo 2: Configurar Node HTTP Request**

1. Clique no node **"Atualizar Todos Usuários"**
2. Em **"URL"**, configure:
   ```
   https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_all_users_liberado_status
   ```
3. Em **"Authentication"**, selecione:
   - **Authentication:** `Header Auth`
   - **Credential:** `Supabase Service Role` (que você criou)
4. Em **"Headers"**, adicione:
   - **Content-Type:** `application/json`
   - **Prefer:** `return=minimal`
5. **Method:** `POST`
6. Salve o node

---

## 🧪 Testar Workflow

### **1. Teste Manual**

1. No workflow, clique em **"Execute Workflow"** (botão no topo)
2. Verifique os logs de cada node
3. Confirme que não há erros

### **2. Verificar Resultado**

- Se sucesso: Status code 200 ou 204
- Se erro: Verifique logs e mensagens de erro

### **3. Verificar no Supabase**

Execute no Supabase SQL Editor:
```sql
SELECT COUNT(*) FILTER (WHERE is_liberado = true) as liberados,
       COUNT(*) FILTER (WHERE is_liberado = false) as nao_liberados
FROM profiles;
```

---

## ✅ Ativar Workflow

1. Clique no toggle **"Inactive"** no canto superior direito
2. Mude para **"Active"**
3. O workflow executará automaticamente a cada hora

---

## 🔧 Troubleshooting

### **Erro: "Environment variable not found"**

**Solução:** Configure as variáveis diretamente no workflow (veja Opção B acima)

### **Erro: "401 Unauthorized"**

**Solução:** 
- Verifique se a Service Role Key está correta
- Verifique se os headers estão configurados corretamente

### **Erro: "404 Function not found"**

**Solução:**
- Verifique se a função `update_all_users_liberado_status` existe no Supabase
- Execute o SQL para criar a função se necessário

### **Workflow não executa automaticamente**

**Solução:**
- Verifique se o workflow está ativo
- Verifique configuração do cron
- Verifique logs do workflow

---

## 📝 Checklist Final

- [ ] Workflow importado
- [ ] URL configurada corretamente
- [ ] Credenciais/configuração de autenticação configurada
- [ ] Headers configurados
- [ ] Workflow testado manualmente
- [ ] Teste bem-sucedido
- [ ] Workflow ativado

---

**Agora seu workflow está pronto para executar automaticamente a cada hora!** 🎉
