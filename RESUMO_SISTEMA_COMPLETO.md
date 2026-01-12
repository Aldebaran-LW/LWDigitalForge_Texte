# 🏗️ Sistema Completo de Sincronização Automática

## 🎯 Visão Geral

Sistema **robusto, automático e inteligente** que sincroniza acesso de usuários entre Supabase e MongoDB em tempo real.

---

## 📊 Arquitetura Final

```
┌─────────────────────────────────────────────────────────┐
│                    SITE PRINCIPAL                        │
│            (LWDigitalForge - Supabase)                   │
│                                                          │
│  • Cadastro de usuários                                 │
│  • E-commerce (venda de apps)                           │
│  • Tabelas: user_purchases, user_trials                 │
│  • profiles.is_liberado → acesso ao SITE                │
└────────────┬────────────────────────────────────────────┘
             │
             │ WEBHOOK (tempo real)
             ↓
┌─────────────────────────────────────────────────────────┐
│              SERVIDOR DE SINCRONIZAÇÃO                   │
│               (Python Flask - Render)                    │
│                                                          │
│  • Recebe webhooks do Supabase                          │
│  • Detecta novos apps automaticamente                   │
│  • Sincroniza has_access para MongoDB                   │
│  • Logs completos                                       │
│  • API para n8n                                         │
└────────────┬────────────────────────────────────────────┘
             │
             │ ATUALIZA
             ↓
┌─────────────────────────────────────────────────────────┐
│                 APPS (MongoDB)                           │
│                                                          │
│  • JornadaPro → jornadapro database                     │
│  • Outros apps → databases automáticas                  │
│  • Collection: user_access                              │
│    - user_id, app_id, has_access, expires_at           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Acesso

### 1. Usuário se Cadastra no Site

```
Usuário → Cadastro → Supabase (profiles)
  ↓
is_liberado = TRUE (automático)
  ↓
Pode acessar /portal (site principal)
```

### 2. Usuário Compra/Trial de um App

```
Admin/Sistema → Cria em user_purchases ou user_trials
  ↓
Supabase → Dispara Webhook
  ↓
Servidor Python (Render)
  ↓
Busca dados no Supabase
  ↓
Calcula has_access (LIFETIME, MONTHLY, ANNUAL, TRIAL)
  ↓
Detecta MongoDB correto (jornadapro, etc)
  ↓
Atualiza collection user_access
  ↓
App verifica MongoDB → Acesso liberado! ✅
```

### 3. Novo App é Criado

```
Admin → Cria em registered_apps (Supabase)
  ↓
Servidor de Sincronização
  ↓
Endpoint /apps detecta automaticamente
  ↓
Próxima sincronização já inclui o novo app
  ↓
Nenhuma reconfiguração necessária! 🎉
```

---

## 🗂️ Estrutura de Dados

### Supabase (Fonte da Verdade)

#### profiles
```sql
- id (UUID)
- email (TEXT)
- is_liberado (BOOLEAN) → Acesso ao SITE PRINCIPAL
- data_vencimento (TIMESTAMP) → Quando expira acesso ao SITE
- role (TEXT) → USER, ADMIN
```

#### registered_apps
```sql
- id (UUID)
- name (TEXT)
- is_active (BOOLEAN)
- vercel_deployment_url (TEXT)
```

#### user_purchases
```sql
- id (UUID)
- user_id (UUID)
- app_id (UUID)
- purchase_type (TEXT) → LIFETIME, MONTHLY, ANNUAL
- status (TEXT) → APPROVED, PENDING
- expires_at (TIMESTAMP)
```

#### user_trials
```sql
- id (UUID)
- user_id (UUID)
- app_id (UUID)
- is_active (BOOLEAN)
- expires_at (TIMESTAMP)
```

### MongoDB (Cache Sincronizado)

#### user_access (em cada database de app)
```javascript
{
  _id: "user_id_app_id",
  user_id: "uuid",
  app_id: "uuid",
  app_name: "JornadaPro",
  has_access: true,
  access_type: "LIFETIME", // ou MONTHLY, ANNUAL, TRIAL
  expires_at: "2099-01-01T00:00:00Z",
  updated_at: "2026-01-13T...",
  synced_from: "webhook"
}
```

---

## 🛠️ Componentes do Sistema

### 1. Servidor Webhook (Python Flask)

**Arquivo:** `webhook-sync-server/app.py`

**Funcionalidades:**
- ✅ Recebe webhooks do Supabase (tempo real)
- ✅ Sincroniza usuário específico
- ✅ Sincronização completa (todos os usuários)
- ✅ Detecta apps automaticamente
- ✅ Logs detalhados
- ✅ API para n8n

**Endpoints:**
- `GET /` - Health check
- `GET /health` - Status (Supabase + MongoDB)
- `GET /apps` - Listar apps detectados
- `GET /logs?limit=50` - Ver logs de sincronização
- `POST /webhook/user-purchase` - Receber webhook (purchases)
- `POST /webhook/user-trial` - Receber webhook (trials)
- `POST /sync/user/<user_id>` - Sync manual de usuário
- `POST /sync/full` - Sync completo (requer auth)

### 2. Webhooks Supabase

**Configuração:**
- Webhook 1: `user_purchases` (INSERT, UPDATE) → `/webhook/user-purchase`
- Webhook 2: `user_trials` (INSERT, UPDATE) → `/webhook/user-trial`

### 3. n8n Workflows (Opcional - Backup)

**Workflow 1: Sync Manual**
- Trigger: Manual
- Action: POST `/sync/full`

**Workflow 2: Sync Agendado (Backup)**
- Trigger: Schedule (a cada hora)
- Action: POST `/sync/full`
- Propósito: Fallback caso webhook falhe

---

## 🚀 Deploy

### Render (Servidor Webhook)

```yaml
# webhook-sync-server/render.yaml
services:
  - type: web
    name: lwdigitalforge-sync-server
    env: docker
    plan: free
    envVars:
      - SUPABASE_URL
      - SUPABASE_SERVICE_ROLE_KEY
      - MONGODB_URI
      - WEBHOOK_SECRET
      - SYNC_API_KEY
```

### Variáveis de Ambiente

| Variável | Onde Usar | Exemplo |
|----------|-----------|---------|
| `SUPABASE_URL` | Render, n8n | `https://wwwwyuwighdehmvnolrl.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Render, n8n | `eyJhbGciOiJIUzI1NiIs...` |
| `MONGODB_URI` | Render | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `WEBHOOK_SECRET` | Render | (gerado automaticamente) |
| `SYNC_API_KEY` | Render, n8n | (gerado automaticamente) |

---

## 🧪 Testes

### Teste 1: Health Check
```bash
curl https://lwdigitalforge-sync-server.onrender.com/health
```

**Esperado:** `{"status": "healthy", ...}`

### Teste 2: Listar Apps
```bash
curl https://lwdigitalforge-sync-server.onrender.com/apps
```

**Esperado:** Lista de apps ativos do Supabase

### Teste 3: Sincronização Manual
```bash
curl -X POST https://lwdigitalforge-sync-server.onrender.com/sync/full \
  -H "Authorization: Bearer SEU_SYNC_API_KEY"
```

**Esperado:** `{"success": true, "synced": X, ...}`

### Teste 4: Criar Compra e Verificar Sync

1. No Supabase, criar um registro em `user_purchases`:
```sql
INSERT INTO user_purchases (user_id, app_id, purchase_type, status)
VALUES ('user-uuid', 'app-uuid', 'LIFETIME', 'APPROVED');
```

2. Webhook deve disparar automaticamente

3. Verificar logs:
```bash
curl https://lwdigitalforge-sync-server.onrender.com/logs?limit=10
```

4. Verificar MongoDB:
```javascript
db.user_access.findOne({user_id: "user-uuid", app_id: "app-uuid"})
```

**Esperado:** `has_access: true`

---

## 📊 Monitoramento

### Logs em Tempo Real (Render)

1. Acesse: https://dashboard.render.com
2. Clique no serviço
3. Vá para "Logs"

**O que procurar:**
- `✅ Conectado ao Supabase`
- `✅ Conectado ao MongoDB`
- `🔄 Sincronizando acesso para usuário: ...`
- `✅ Sincronizado: user_id → app_name (acesso: true)`

### Logs via API

```bash
curl https://lwdigitalforge-sync-server.onrender.com/logs?limit=100
```

---

## 🔐 Segurança

### Webhook Signature (Futuro)

O servidor está preparado para verificar assinaturas:
```python
verify_webhook_signature(payload, signature)
```

### API Key para Sync Manual

Endpoint `/sync/full` requer autenticação:
```
Authorization: Bearer SEU_SYNC_API_KEY
```

---

## 🎯 Vantagens desta Arquitetura

| Característica | Benefício |
|----------------|-----------|
| **Tempo Real** | Webhooks atualizam MongoDB instantaneamente |
| **Automático** | Detecta novos apps sem reconfiguração |
| **Robusto** | Fallback com n8n (sync horário) |
| **Simples** | Apenas 1 servidor para manter |
| **Logs** | Debug fácil com histórico completo |
| **Escalável** | Suporta múltiplos apps e databases |
| **Grátis** | Render free tier + Supabase free tier |

---

## 🐛 Troubleshooting

### Problema: Webhook não dispara

**Solução:**
1. Verificar logs do Supabase (Database → Webhooks → Ver logs)
2. Testar manualmente:
```bash
curl -X POST https://lwdigitalforge-sync-server.onrender.com/webhook/user-purchase \
  -H "Content-Type: application/json" \
  -d '{"record": {"user_id": "test", "app_id": "test"}}'
```

### Problema: MongoDB não atualiza

**Solução:**
1. Verificar `MONGODB_URI` no Render
2. Ver logs: `/logs`
3. Testar conexão:
```bash
curl https://lwdigitalforge-sync-server.onrender.com/health
```

### Problema: Servidor offline (Render free tier)

**Solução:**
1. Render free tier hiberna após 15 min de inatividade
2. Usar n8n workflow agendado para manter ativo:
```
Schedule: A cada 10 minutos
Action: GET /health
```

---

## 📋 Checklist de Implementação

- [ ] Código criado em `webhook-sync-server/`
- [ ] Git commit e push
- [ ] Deploy na Render
- [ ] Variáveis de ambiente configuradas
- [ ] Webhooks criados no Supabase
- [ ] Health check testado
- [ ] Endpoint `/apps` retorna apps
- [ ] Sincronização manual testada
- [ ] Teste de compra → verificar MongoDB
- [ ] n8n workflow criado (opcional)
- [ ] Monitoramento configurado

---

## 🎉 Resultado Final

Sistema **100% automático** que:
- ✅ Sincroniza acesso em **tempo real**
- ✅ Detecta **novos apps sozinho**
- ✅ **Nunca quebra** (fallback com n8n)
- ✅ **Logs completos** para debug
- ✅ **Grátis** para rodar

**Problema resolvido de vez!** 🚀
