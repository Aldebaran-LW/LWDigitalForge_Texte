# 🔧 Corrigir Erro: "access to env vars denied" no n8n

## ❌ Problema

O erro `[ERROR: access to env vars denied]` aparece porque o n8n não tem acesso às variáveis de ambiente do Render dessa forma.

## ✅ Solução: Configurar Valores Diretamente

### **1. Corrigir URL**

No campo **URL**, substitua:
```
https://{{ $env.SUPABASE_URL }}/rest/v1/rpc/update_all_users_liberado_status
```

Por:
```
https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_all_users_liberado_status
```

### **2. Mudar Method para POST**

1. No campo **Method**, mude de **GET** para **POST**

### **3. Configurar Headers Manualmente**

1. Certifique-se que **"Send Headers"** está **ativado** (verde)
2. Em **"Header Parameters"**, configure:

**Adicione/Edite os headers:**

| Name | Value |
|------|-------|
| `apikey` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs` |
| `Authorization` | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs` |
| `Content-Type` | `application/json` |
| `Prefer` | `return=minimal` |

### **4. Remover/Desabilitar Authentication Genérica**

1. Em **"Authentication"**, mude de **"Generic Credential Type"** para **"None"** ou **"No Auth"**
2. (Os headers já têm a autenticação necessária)

### **5. Salvar e Testar**

1. Clique em **"Save"** no node
2. Clique em **"Execute step"** para testar
3. Verifique se retorna status 200 ou 204 (sucesso)

---

## 📋 Resumo das Correções

- ✅ URL: Use o valor direto (sem `{{ $env }}`)
- ✅ Method: Mude para **POST**
- ✅ Headers: Configure manualmente com os valores reais
- ✅ Authentication: Desabilite (use None/No Auth)

---

## 🧪 Testar

1. Clique em **"Execute step"** no node
2. Verifique o OUTPUT (lado direito)
3. Deve mostrar status 200 ou 204
4. Se der erro, verifique os logs

---

## ✅ Depois de Corrigir

1. Salve o workflow
2. Teste o workflow completo (Execute Workflow)
3. Ative o workflow (toggle no topo)

---

**Agora deve funcionar sem erros!** 🎉
