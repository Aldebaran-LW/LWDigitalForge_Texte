# 📥 Como Importar JSON do Workflow no n8n

## 🚀 Método Rápido (3 Passos)

### **1. Abrir n8n**
- Acesse a URL do seu n8n (ex: `n8n-xxxx.onrender.com`)
- Faça login

### **2. Importar Workflow**
1. Clique no menu (☰) → **"Workflows"**
2. Clique em **"Import from File"** (ou botão de upload)
3. Selecione o arquivo: `n8n-workflow-liberacao-simples.json`
4. Clique em **"Import"**

### **3. Configurar Credenciais**
- O workflow precisa das credenciais do Supabase
- Configure conforme `GUIA_N8N_WORKFLOW.md`

---

## 📋 Passo a Passo Detalhado

### **Passo 1: Localizar o Arquivo JSON**

O arquivo está em:
```
LWDigitalForge_Texte/n8n-workflow-liberacao-simples.json
```

### **Passo 2: No n8n**

1. **Menu** (☰) no canto superior esquerdo
2. Clique em **"Workflows"**
3. Clique em **"Import from File"** (ícone de pasta/upload)
4. **Selecione o arquivo** `n8n-workflow-liberacao-simples.json`
5. Clique em **"Import"**

### **Passo 3: Verificar Importação**

- O workflow aparecerá na lista
- Clique nele para abrir
- Verifique se todos os nodes estão presentes

### **Passo 4: Configurar Credenciais**

O workflow precisa acessar o Supabase:

1. Clique em qualquer node que use Supabase
2. Clique em **"Credential to connect with"**
3. Clique em **"Create New"**
4. Selecione **"Supabase"** (ou "HTTP Header Auth")
5. Preencha:
   - **Host:** `wwwwyuwighdehmvnolrl.supabase.co`
   - **Service Role Secret:** (cole sua service role key)
6. Salve

---

## 🔄 Alternativa: Copiar e Colar

Se não conseguir importar arquivo:

1. Abra `n8n-workflow-liberacao-simples.json` no editor
2. Copie todo o conteúdo (Ctrl+A, Ctrl+C)
3. No n8n: **Workflows** → **Import** → **"Paste JSON"**
4. Cole o conteúdo (Ctrl+V)
5. Clique em **"Import"**

---

## ⚠️ Se a Importação Não Funcionar

**Crie manualmente** seguindo `GUIA_N8N_WORKFLOW.md`:

- ✅ Mais confiável
- ✅ Você entende cada passo
- ✅ Pode ajustar conforme necessário

---

## ✅ Depois de Importar

1. ✅ Verificar se workflow foi importado
2. ✅ Configurar credenciais do Supabase
3. ✅ Testar manualmente (Execute Workflow)
4. ✅ Ativar workflow (toggle no topo)

---

**Arquivo para importar:** `n8n-workflow-liberacao-simples.json`
