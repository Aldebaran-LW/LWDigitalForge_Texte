# 🔗 Integração N8N - Verificação de Acesso

## 📖 Visão Geral

Este documento descreve a integração do webhook n8n para verificação de acesso aos produtos no frontend da aplicação LWDigitalForge.

**Data de Implementação:** 2025-01-15  
**Status:** ✅ Implementado e Pronto para Teste

---

## 🎯 Objetivo

Verificar acesso dos usuários aos produtos através do webhook n8n antes de permitir acesso, criando notificações automáticas quando o acesso for negado.

---

## 🏗️ Arquitetura

```
Frontend (Portal/App)
    ↓
[checkAccessViaN8N()]
    ↓
Webhook N8N (Render)
    ↓
Supabase API
    ↓
Verifica: user_purchases + user_trials
    ↓
Resposta: {hasAccess: true/false, reason, redirectUrl}
    ↓
Frontend
    ├─ Se hasAccess: true → Abre aplicação
    └─ Se hasAccess: false → Cria notificação + Redireciona
```

---

## 📁 Estrutura de Arquivos

### **Arquivo Principal**

**`src/lib/n8nAccessCheck.js`**
- Funções de integração com n8n
- Funções de criação de notificações

### **Arquivos que Usam a Integração**

1. **`src/pages/portal/PortalMeusProdutos.jsx`**
   - Verifica acesso quando usuário clica em "Acessar Aplicação"

2. **`src/components/ProtectedProductRoute.jsx`**
   - Verifica acesso quando aplicação carrega diretamente pela URL

### **Workflow N8N**

**`n8n-workflow-verificar-acesso-API-SUPABASE.json`**
- Workflow completo do n8n
- Deve ser importado no Render

---

## 🔧 Configuração

### **1. Variáveis de Ambiente no Render (n8n)**

```bash
SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### **2. URL do Webhook**

```javascript
const n8nWebhookUrl = 'https://n8n-a8kh.onrender.com/webhook/verificar-acesso-jornadapro';
```

### **3. Tabelas Supabase Utilizadas**

- `user_purchases` - Compras e assinaturas
- `user_trials` - Períodos de teste
- `contact_messages` - Notificações (criadas automaticamente)

---

## 📚 Documentação Relacionada

### **Documentação Completa**
- [`IMPLEMENTACAO_N8N_COMPLETA.md`](./IMPLEMENTACAO_N8N_COMPLETA.md) - Guia completo de implementação
- [`CHANGELOG_INTEGRACAO_N8N.md`](./CHANGELOG_INTEGRACAO_N8N.md) - Registro de mudanças

### **Análises e Diagnósticos**
- [`ANALISE_FLUXO_ACESSO_N8N.md`](./ANALISE_FLUXO_ACESSO_N8N.md) - Análise detalhada do fluxo

### **Guias de Configuração**
- [`GUIA_USAR_API_SUPABASE_N8N.md`](./GUIA_USAR_API_SUPABASE_N8N.md) - Como usar a API Supabase no n8n
- [`GUIA_TESTE_WEBHOOK_N8N.md`](./GUIA_TESTE_WEBHOOK_N8N.md) - Como testar o webhook

---

## 🚀 Como Usar

### **No Portal do Cliente**

Quando o usuário clica em "Acessar Aplicação", o sistema automaticamente:
1. Chama o webhook n8n
2. Verifica se tem acesso
3. Se sim: abre aplicação
4. Se não: cria notificação e redireciona

### **Acesso Direto pela URL**

Quando a aplicação carrega diretamente:
1. `ProtectedProductRoute` verifica acesso via n8n
2. Se não tiver acesso: redireciona para `/portal/produtos`
3. Notificação é criada automaticamente

---

## 🔔 Sistema de Notificações

Notificações são criadas automaticamente na tabela `contact_messages` quando acesso é negado:

| Motivo | Subject | Descrição |
|--------|---------|-----------|
| Teste Expirado | "Período de Teste Expirado" | Trial expirou, precisa assinatura |
| Assinatura Expirada | "Renovação de Assinatura Necessária" | Assinatura precisa renovação |
| Acesso Revogado | "Acesso Revogado pelo Administrador" | Admin revogou acesso |
| Sem Acesso | "Acesso Negado - Assinatura Necessária" | Não possui assinatura/trial |

---

## ✅ Checklist de Deploy

- [ ] Reimportar workflow n8n atualizado no Render
- [ ] Verificar variáveis de ambiente no Render
- [ ] Testar acesso negado (sem assinatura)
- [ ] Testar acesso liberado (com assinatura/trial)
- [ ] Verificar notificações sendo criadas
- [ ] Verificar redirecionamentos funcionando

---

## 🐛 Troubleshooting

### **Erro: "Erro ao verificar acesso"**
- Verificar se webhook n8n está ativo no Render
- Verificar se variáveis de ambiente estão configuradas
- Verificar logs do n8n no Render

### **Notificações não aparecem**
- Verificar RLS na tabela `contact_messages`
- Verificar se usuário está autenticado
- Verificar se `createAccessDeniedNotification()` está sendo chamada

### **Redirecionamento não funciona**
- Verificar se `redirectUrl` está correto no workflow n8n
- Verificar se `navigate()` está sendo chamado corretamente

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar documentação completa em `IMPLEMENTACAO_N8N_COMPLETA.md`
2. Verificar logs do n8n no Render
3. Verificar logs do Supabase
4. Verificar console do navegador

---

## 🔗 Links Úteis

- **n8n no Render:** https://n8n-a8kh.onrender.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Portal do Cliente:** https://www.lwdigitalforge.com/portal

---

**Última Atualização:** 2025-01-15
