# ⚡ Guia Rápido: n8n - Começar em 5 Minutos

## 🚀 Opção Mais Rápida: n8n Cloud

### **1. Criar Conta (2 minutos)**

1. Acesse: https://app.n8n.io
2. Clique em "Start Free"
3. Faça login com Google/GitHub ou crie conta

### **2. Importar Workflow (1 minuto)**

1. No dashboard, clique no menu (☰) → "Workflows"
2. Clique em "Import from File" ou "Import from URL"
3. Cole o conteúdo do arquivo `n8n-workflow-liberacao.json`
4. Clique em "Import"

### **3. Configurar Credenciais (2 minutos)**

1. No workflow, clique em "Buscar Usuários" node
2. Clique em "Credential to connect with"
3. Clique em "Create New"
4. Selecione "Supabase"
5. Preencha:
   - **Host:** `wwwwyuwighdehmvnolrl.supabase.co`
   - **Service Role Secret:** (cole sua service role key do Supabase)
   - Clique em "Save"

6. Repita para os outros nodes que usam Supabase (se necessário)

### **4. Ativar Workflow (30 segundos)**

1. Clique no toggle "Inactive" no canto superior direito
2. Mude para "Active"
3. Pronto! O workflow executará automaticamente a cada hora

---

## 📋 Checklist Rápido

- [ ] Conta n8n criada
- [ ] Workflow importado
- [ ] Credenciais do Supabase configuradas
- [ ] Workflow ativado
- [ ] Teste manual executado (opcional)

---

## 🧪 Testar Manualmente

1. No workflow, clique em "Execute Workflow" (botão no topo)
2. Verifique os logs de cada node
3. Confirme que não há erros
4. Verifique no Supabase se `is_liberado` foi atualizado

---

## 🔧 Onde Encontrar Service Role Key

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings → API
4. Copie a chave "service_role" (não a anon key!)

---

## ⚠️ Importante

- Use **Service Role Key** (não anon key)
- Service Role Key ignora RLS (Row Level Security)
- Mantenha a chave secreta!

---

## 🎯 Pronto!

Agora o n8n executará automaticamente a cada hora e atualizará o status de liberação de todos os usuários.

---

## 📞 Próximos Passos (Opcional)

- Configurar notificações por email em caso de erro
- Ajustar frequência do cron (atualmente 1 hora)
- Adicionar mais lógica ao workflow
- Migrar para self-hosted se necessário
