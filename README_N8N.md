# 🚀 Quick Start: n8n para Liberação Automática

## ⚡ Começar em 5 Minutos (n8n Cloud)

### **1. Criar Conta**
- Acesse: https://app.n8n.io
- Crie conta gratuita

### **2. Criar Workflow**

Siga o guia: **`GUIA_N8N_WORKFLOW.md`**

Ou use a versão simplificada:

1. **Cron Trigger** (a cada hora)
2. **HTTP Request:**
   - POST: `https://wwwwyuwighdehmvnolrl.supabase.co/rest/v1/rpc/update_all_users_liberado_status`
   - Headers: `apikey` e `Authorization: Bearer {Service Role Key}`

### **3. Ativar**
- Salve o workflow
- Ative o toggle "Active"

---

## 📚 Documentação Completa

- **`GUIA_N8N_LIBERACAO.md`** - Guia completo (Cloud, Render, Hostinger)
- **`GUIA_N8N_WORKFLOW.md`** - Passo a passo do workflow
- **`GUIA_N8N_RAPIDO.md`** - Guia rápido de 5 minutos

---

## 🔑 Credenciais Necessárias

- **Supabase Service Role Key** (não anon key!)
- Encontre em: Supabase Dashboard → Settings → API → service_role

---

## ✅ Checklist

- [ ] Conta n8n criada
- [ ] Workflow criado
- [ ] Service Role Key configurada
- [ ] Workflow testado manualmente
- [ ] Workflow ativado

---

**Pronto! O workflow executará automaticamente a cada hora.**
