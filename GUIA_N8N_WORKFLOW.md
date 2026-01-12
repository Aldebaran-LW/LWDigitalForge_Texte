# 📋 Guia: Workflow n8n - Passo a Passo

## 🎯 Workflow Simplificado (Recomendado)

Este guia mostra como criar o workflow manualmente no n8n (mais confiável que importar JSON).

---

## 📝 Passo a Passo: Criar Workflow Manualmente

### **1. Criar Novo Workflow**

1. No n8n, clique em "Workflows" → "Add Workflow"
2. Dê um nome: "Liberação Automática"

### **2. Adicionar Trigger Cron**

1. Clique em "+" para adicionar node
2. Procure por "Cron"
3. Selecione "Schedule Trigger"
4. Configure:
   - **Trigger Times:** Every hour (ou o intervalo desejado)
   - **Timezone:** America/Sao_Paulo

### **3. Adicionar HTTP Request (Atualizar Todos)**

1. Clique em "+" após o node Cron
2. Procure por "HTTP Request"
3. Configure:

**General:**
- **Method:** POST
- **URL:** `https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_all_users_liberado_status`

**Authentication:**
- **Authentication:** Header Auth (ou Generic Credential Type)
- **Name:** `apikey`
- **Value:** `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}` (ou sua service role key)
- Adicione também:
  - **Name:** `Authorization`
  - **Value:** `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`

**Headers:**
- **Content-Type:** `application/json`
- **Prefer:** `return=minimal`

**Body:**
- Deixe vazio (a função não precisa parâmetros)

**Options:**
- Marque "Continue On Fail" (para não parar em caso de erro)

### **4. Adicionar IF Node (Verificar Sucesso)**

1. Após HTTP Request, adicione node "IF"
2. Configure:
   - **Condition:** `statusCode equals 200` (ou `statusCode equals 204`)

### **5. Adicionar Set Nodes (Sucesso/Erro)**

1. No caminho "true" do IF, adicione "Set"
   - Adicione campo: `status` = `✅ Sucesso`

2. No caminho "false" do IF, adicione "Set"
   - Adicione campo: `status` = `❌ Erro`
   - Adicione campo: `error` = `{{ $json.error }}`

---

## 🔐 Configurar Variáveis de Ambiente

No n8n, configure estas variáveis:

1. Vá em "Settings" → "Environment Variables" (ou use credentials)
2. Adicione:
   - `SUPABASE_URL`: `https://wwwwyuwighdehmvnolrl.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (sua service role key)

**OU** use Credentials:

1. Vá em "Credentials" → "Add Credential"
2. Escolha "Generic Credential Type"
3. Adicione campos:
   - `service_role_key`: (cole sua key)

---

## 🔄 Workflow Alternativo: Usar Função RPC Individual

Se a função `update_all_users_liberado_status` não funcionar, use este workflow:

### **1. Cron Trigger** (igual ao anterior)

### **2. HTTP Request - Buscar Usuários**

- **Method:** GET
- **URL:** `https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/profiles?select=id`
- **Headers:**
  - `apikey`: Service Role Key
  - `Authorization`: `Bearer {Service Role Key}`

### **3. Split In Batches**

- **Batch Size:** 10

### **4. Loop Over Items**

- Use "Code" node para processar cada item

### **5. HTTP Request - Atualizar Cada Usuário**

- **Method:** POST
- **URL:** `https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_user_liberado_status`
- **Body (JSON):**
  ```json
  {
    "p_user_id": "{{ $json.id }}"
  }
  ```

---

## ✅ Testar Workflow

1. Clique em "Execute Workflow" (botão no topo)
2. Verifique os logs de cada node
3. Confirme que não há erros
4. Verifique no Supabase se `is_liberado` foi atualizado

---

## 🔧 Troubleshooting

### **Erro 401 (Unauthorized)**
- Verifique se está usando Service Role Key (não anon key)
- Verifique se os headers estão corretos

### **Erro 404 (Function not found)**
- Verifique se a função existe no Supabase
- Execute o SQL para criar a função se necessário

### **Erro 500 (Internal Server Error)**
- Verifique logs do Supabase
- Verifique se a função está funcionando (teste no SQL Editor)

---

## 📝 Notas Importantes

1. **Use Service Role Key** - Necessário para ignorar RLS
2. **Função RPC** - Mais eficiente que atualizar usuário por usuário
3. **Continue On Fail** - Configure para não parar em caso de erro
4. **Logs** - Sempre verifique os logs de execução

---

## 🎯 Próximos Passos

1. Criar workflow no n8n
2. Configurar variáveis/credentials
3. Testar manualmente
4. Ativar workflow
5. Monitorar execuções

---

**O workflow simplificado é mais confiável e fácil de manter!**
