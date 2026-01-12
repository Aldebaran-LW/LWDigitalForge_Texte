# 📥 Guia: Como Importar Workflow JSON no n8n

## 🎯 Método 1: Importar do Arquivo (Recomendado)

### **Passo 1: Acessar n8n**
1. Acesse a URL do seu n8n no Render (ex: `n8n-xxxx.onrender.com`)
2. Faça login com:
   - Usuário: `admin`
   - Senha: `LW_Digital_Forge/123`

### **Passo 2: Abrir Menu de Importação**
1. No dashboard do n8n, clique no menu (☰) no canto superior esquerdo
2. Clique em **"Workflows"**
3. Clique no botão **"Import from File"** ou **"Import"** (ícone de upload)

### **Passo 3: Selecionar Arquivo**
1. Clique em **"Choose File"** ou **"Selecionar arquivo"**
2. Navegue até a pasta do projeto:
   ```
   LWDigitalForge_Texte/
   ```
3. Selecione o arquivo:
   ```
   n8n-workflow-liberacao-simples.json
   ```
4. Clique em **"Open"** ou **"Abrir"**

### **Passo 4: Importar**
1. O n8n mostrará uma prévia do workflow
2. Clique em **"Import"** ou **"Importar"**
3. O workflow será criado e você será redirecionado para editá-lo

---

## 🎯 Método 2: Copiar e Colar JSON

### **Passo 1: Abrir Arquivo JSON**
1. Abra o arquivo `n8n-workflow-liberacao-simples.json` no seu editor
2. Selecione todo o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)

### **Passo 2: Importar no n8n**
1. No n8n, vá em **"Workflows"** → **"Import"**
2. Procure por opção **"Import from URL"** ou **"Paste JSON"**
3. Cole o JSON copiado (Ctrl+V)
4. Clique em **"Import"**

---

## 🎯 Método 3: Criar Manualmente (Mais Confiável)

Se a importação não funcionar, crie manualmente seguindo `GUIA_N8N_WORKFLOW.md`.

**Vantagens:**
- ✅ Mais confiável
- ✅ Você entende cada passo
- ✅ Pode ajustar conforme necessário

---

## ⚙️ Depois de Importar

### **1. Configurar Credenciais do Supabase**

O workflow precisa das credenciais do Supabase:

1. No workflow, clique em qualquer node que use Supabase
2. Clique em **"Credential to connect with"**
3. Clique em **"Create New"**
4. Selecione **"Supabase"**
5. Preencha:
   - **Host:** `wwwwyuwighdehmvnolrl.supabase.co`
   - **Service Role Secret:** (cole sua service role key)
   - Clique em **"Save"**

### **2. Verificar Configuração**

1. Verifique se todos os nodes estão configurados
2. Verifique se as credenciais estão conectadas
3. Teste o workflow manualmente (Execute Workflow)

### **3. Ativar Workflow**

1. Clique no toggle **"Inactive"** no canto superior direito
2. Mude para **"Active"**
3. O workflow executará automaticamente conforme o cron configurado

---

## 🔧 Troubleshooting

### **Erro: "Invalid workflow JSON"**
- Verifique se o arquivo JSON está completo
- Tente criar manualmente seguindo `GUIA_N8N_WORKFLOW.md`

### **Erro: "Credential not found"**
- Configure as credenciais do Supabase (veja acima)
- Verifique se a Service Role Key está correta

### **Workflow não executa**
- Verifique se está ativo (toggle no topo)
- Verifique configuração do cron
- Verifique logs do workflow

---

## 📝 Arquivos Disponíveis

Você tem 2 arquivos JSON disponíveis:

1. **`n8n-workflow-liberacao-simples.json`** ⭐ (Recomendado)
   - Workflow simplificado
   - Mais fácil de usar
   - Chama função RPC diretamente

2. **`n8n-workflow-liberacao.json`**
   - Workflow mais complexo
   - Processa usuário por usuário
   - Use se o simples não funcionar

---

## ✅ Checklist

- [ ] n8n acessível e logado
- [ ] Arquivo JSON localizado
- [ ] Workflow importado
- [ ] Credenciais do Supabase configuradas
- [ ] Workflow testado manualmente
- [ ] Workflow ativado

---

**Dica:** Se a importação der problema, crie manualmente seguindo `GUIA_N8N_WORKFLOW.md` - é mais confiável!
