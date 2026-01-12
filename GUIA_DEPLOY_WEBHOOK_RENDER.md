# 🚀 Guia: Deploy do Sistema de Sincronização Automática na Render

## 🎯 O que vamos fazer

Criar um **servidor webhook automático** que:
- ✅ Sincroniza Supabase → MongoDB em **tempo real**
- ✅ Detecta **novos apps automaticamente**
- ✅ Funciona com **n8n** (endpoints API)
- ✅ Logs completos
- ✅ **100% automático**

---

## 📋 Pré-requisitos

Você precisa ter:
1. ✅ Conta no [Render](https://render.com) (grátis)
2. ✅ Supabase URL e Service Role Key
3. ✅ MongoDB URI (do JornadaPro)
4. ✅ Código criado (já está na pasta `webhook-sync-server/`)

---

## 🚀 PASSO 1: Preparar o Repositório

### 1.1. Commit e Push

```bash
git add .
git commit -m "feat: Sistema automático de sincronização webhook"
git push origin main
```

---

## 🌐 PASSO 2: Deploy na Render

### 2.1. Criar Novo Web Service

1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub: `LWDigitalForge_Texte`
4. Configure:
   - **Name:** `lwdigitalforge-sync-server`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `webhook-sync-server`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Plan:** Free

### 2.2. Configurar Variáveis de Ambiente

Clique em **"Advanced"** e adicione:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://wwwwyuwighdehmvnolrl.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (seu service role key) |
| `MONGODB_URI` | `mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority` |
| `WEBHOOK_SECRET` | Clique em **"Generate"** |
| `SYNC_API_KEY` | Clique em **"Generate"** |
| `PORT` | `5000` |

### 2.3. Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (3-5 minutos)
3. Anote a URL: `https://lwdigitalforge-sync-server.onrender.com`

---

## 🔗 PASSO 3: Configurar Webhooks no Supabase

### 3.1. Criar Webhook para user_purchases

1. Acesse: [Supabase Dashboard → Database → Webhooks](https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/database/hooks)
2. Clique em **"Create a new hook"** → **"HTTP Request"**
3. Configure:
   - **Name:** `sync_user_purchases`
   - **Table:** `user_purchases`
   - **Events:** ✅ INSERT, ✅ UPDATE
   - **Type:** `HTTP Request`
   - **Method:** `POST`
   - **URL:** `https://lwdigitalforge-sync-server.onrender.com/webhook/user-purchase`
   - **HTTP Headers:**
     ```
     Content-Type: application/json
     ```
4. Clique em **"Create webhook"**

### 3.2. Criar Webhook para user_trials

Repita o processo:
- **Name:** `sync_user_trials`
- **Table:** `user_trials`
- **Events:** ✅ INSERT, ✅ UPDATE
- **URL:** `https://lwdigitalforge-sync-server.onrender.com/webhook/user-trial`

---

## 🧪 PASSO 4: Testar o Sistema

### 4.1. Health Check

Acesse no navegador:
```
https://lwdigitalforge-sync-server.onrender.com/health
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  "supabase": "connected",
  "mongodb": "connected",
  "timestamp": "2026-01-13T..."
}
```

### 4.2. Listar Apps Detectados

```
https://lwdigitalforge-sync-server.onrender.com/apps
```

**Deve mostrar todos os apps ativos do Supabase!**

### 4.3. Sincronização Manual (Primeira Vez)

Use o n8n ou curl:

```bash
curl -X POST https://lwdigitalforge-sync-server.onrender.com/sync/full \
  -H "Authorization: Bearer SEU_SYNC_API_KEY" \
  -H "Content-Type: application/json"
```

**Substitua `SEU_SYNC_API_KEY`** pelo valor gerado no Render (Environment → SYNC_API_KEY).

---

## 🔄 PASSO 5: Integrar com n8n (Opcional)

### 5.1. Workflow n8n para Sync Manual

Crie um novo workflow no n8n:

```json
{
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://lwdigitalforge-sync-server.onrender.com/sync/full",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{$env.SYNC_API_KEY}}"
            }
          ]
        }
      },
      "name": "Sync Full",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Sync Full", "type": "main", "index": 0}]]
    }
  }
}
```

### 5.2. Workflow n8n Agendado (Backup Hourly)

Caso o webhook falhe, tenha um backup:

```json
{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 1}]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://lwdigitalforge-sync-server.onrender.com/sync/full",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{$env.SYNC_API_KEY}}"
            }
          ]
        }
      },
      "name": "Sync Full Hourly",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    }
  ]
}
```

---

## 📊 PASSO 6: Monitorar Logs

### 6.1. Ver Últimos 50 Logs

```
https://lwdigitalforge-sync-server.onrender.com/logs?limit=50
```

### 6.2. Logs do Render

1. Acesse: https://dashboard.render.com
2. Clique no serviço `lwdigitalforge-sync-server`
3. Vá para **"Logs"**
4. Veja logs em tempo real

---

## 🎯 Como Funciona (Fluxo Completo)

### Cenário 1: Usuário Compra um App

```
1. Admin cria compra em user_purchases (via Portal Admin)
   ↓
2. Supabase detecta INSERT
   ↓
3. Webhook envia para: /webhook/user-purchase
   ↓
4. Servidor Python:
   - Busca user_purchases do usuário
   - Busca user_trials do usuário
   - Determina has_access = true/false
   - Detecta qual MongoDB usar (jornadapro, etc)
   - Atualiza collection user_access
   ↓
5. JornadaPro verifica MongoDB → Usuário tem acesso! ✅
```

### Cenário 2: Trial Expira

```
1. user_trials.expires_at < NOW()
   ↓
2. Próxima sincronização detecta expiração
   ↓
3. Atualiza MongoDB: has_access = false
   ↓
4. JornadaPro bloqueia acesso ❌
```

### Cenário 3: Novo App é Criado

```
1. Admin cria app em registered_apps
   ↓
2. Endpoint /apps automaticamente detecta
   ↓
3. Próxima sincronização já inclui o novo app
   ↓
4. Sistema funciona sem reconfiguração! 🎉
```

---

## 🔧 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Health check básico |
| `/health` | GET | Status completo (Supabase + MongoDB) |
| `/apps` | GET | Listar todos os apps ativos |
| `/logs?limit=50` | GET | Ver logs de sincronização |
| `/webhook/user-purchase` | POST | Receber webhook do Supabase (purchases) |
| `/webhook/user-trial` | POST | Receber webhook do Supabase (trials) |
| `/sync/user/<user_id>` | POST | Sincronizar usuário específico |
| `/sync/full` | POST | Sincronização completa (requer auth) |

---

## ✅ Checklist Final

- [ ] Deploy na Render concluído
- [ ] Variáveis de ambiente configuradas
- [ ] Health check retorna "healthy"
- [ ] Endpoint `/apps` lista apps
- [ ] Webhook `user_purchases` criado no Supabase
- [ ] Webhook `user_trials` criado no Supabase
- [ ] Sincronização manual `/sync/full` testada
- [ ] Logs aparecem em `/logs`
- [ ] n8n workflow criado (opcional)
- [ ] Teste: criar compra → verificar MongoDB atualizado

---

## 🎉 Pronto!

Agora você tem um **sistema automático, inteligente e robusto** que:
- ✅ Sincroniza em **tempo real**
- ✅ Detecta **novos apps automaticamente**
- ✅ Integra com **n8n**
- ✅ **Logs completos**
- ✅ **Fallback** (se webhook falhar, n8n faz sync horário)

**Nada mais vai quebrar!** 🚀
