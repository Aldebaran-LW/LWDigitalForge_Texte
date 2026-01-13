# 🔗 Passo a Passo: Configurar Webhooks no Supabase

## ✅ SISTEMA JÁ FUNCIONANDO:
- ✅ Servidor online: https://lwdigitalforge-texte.onrender.com
- ✅ 5 usuários sincronizados
- ✅ MongoDB atualizado
- ✅ Apps detectados automaticamente

---

## 🎯 AGORA: Fazer Sincronização Automática (Webhooks)

### **PASSO 1: Acessar Webhooks no Supabase**

👉 **Link direto:** https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/database/hooks

Ou navegue:
1. Dashboard → Seu projeto
2. Menu lateral → **Database** → **Webhooks**

---

### **PASSO 2: Criar Webhook #1 (user_purchases)**

1. Clique em **"Create a new hook"**
2. Selecione **"HTTP Request"**
3. Preencha:

```
Name: sync_user_purchases
Table: user_purchases
Events: ✅ INSERT, ✅ UPDATE
Type: HTTP Request
Method: POST
URL: https://lwdigitalforge-texte.onrender.com/webhook/user-purchase
```

4. **HTTP Headers** (clique em "Add Header"):
```
Content-Type: application/json
```

5. Clique em **"Create webhook"**

---

### **PASSO 3: Criar Webhook #2 (user_trials)**

1. Clique em **"Create a new hook"** novamente
2. Selecione **"HTTP Request"**
3. Preencha:

```
Name: sync_user_trials
Table: user_trials
Events: ✅ INSERT, ✅ UPDATE
Type: HTTP Request
Method: POST
URL: https://lwdigitalforge-texte.onrender.com/webhook/user-trial
```

4. **HTTP Headers**:
```
Content-Type: application/json
```

5. Clique em **"Create webhook"**

---

### **PASSO 4: Verificar Webhooks Criados**

Você deve ver na lista:

```
✅ sync_user_purchases
   Table: user_purchases
   Events: INSERT, UPDATE
   Status: Active
   
✅ sync_user_trials  
   Table: user_trials
   Events: INSERT, UPDATE
   Status: Active
```

---

## 🧪 PASSO 5: TESTAR Webhook (Tempo Real!)

### **Criar uma compra de teste:**

Vá para **SQL Editor** no Supabase e execute:

```sql
-- Ver seus usuários
SELECT id, email FROM profiles LIMIT 5;

-- Criar compra de teste (escolha um user_id da query acima)
INSERT INTO user_purchases (
  user_id,
  app_id,
  purchase_type,
  status,
  payment_method,
  amount_paid,
  purchased_at
) VALUES (
  '52c476c6-4edd-4f61-8f5e-599e067d6bc1',  -- SUBSTITUIR por um user_id válido
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432',  -- JornadaPro
  'MONTHLY',
  'APPROVED',
  'TEST_WEBHOOK',
  6500,
  NOW()
);
```

### **Ver webhook disparar:**

No PowerShell:
```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=1" -Method Get | ConvertTo-Json -Depth 3
```

**Deve mostrar:**
```json
{
  "logs": [
    {
      "user_id": "52c476c6-4edd-4f61-8f5e-599e067d6bc1",
      "app_name": "JornadaPro",
      "has_access": true,
      "access_type": "MONTHLY",
      "timestamp": "2026-01-13T00:48:..."
    }
  ]
}
```

**SE APARECER ISSO = WEBHOOK FUNCIONOU EM TEMPO REAL!** 🎉

---

## 📊 Monitorar Webhooks

### **Ver Logs do Render (Tempo Real):**
1. https://dashboard.render.com
2. Clique no serviço `lwdigitalforge-texte`
3. Vá para **"Logs"**
4. Procure por:
   - `📥 Webhook recebido: user_purchase`
   - `✅ Sincronizado: user_id → JornadaPro (acesso: true)`

### **Ver Logs do Webhook:**
```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=20" -Method Get | ConvertTo-Json -Depth 3
```

---

## 🎉 Resultado Final

Após configurar os webhooks, você terá:

```
┌─────────────────────────────────────┐
│   SUPABASE                          │
│   user_purchases: INSERT/UPDATE     │
└────────┬────────────────────────────┘
         │
         │ WEBHOOK (< 1 segundo!)
         ↓
┌─────────────────────────────────────┐
│   SERVIDOR PYTHON                   │
│   Recebe notificação                │
│   Sincroniza MongoDB                │
└────────┬────────────────────────────┘
         │
         │ ATUALIZA
         ↓
┌─────────────────────────────────────┐
│   MONGODB jornadapro                │
│   user_access atualizado!           │
└─────────────────────────────────────┘
         │
         │ VERIFICA
         ↓
┌─────────────────────────────────────┐
│   APP JORNADAPRO                    │
│   Usuário tem acesso! ✅            │
└─────────────────────────────────────┘
```

**SINCRONIZAÇÃO EM TEMPO REAL!** ⚡

---

## 📋 Checklist Final:

- [x] Servidor online e funcionando
- [x] Health check: healthy
- [x] Apps detectados: JornadaPro
- [x] Sync full: 5 usuários sincronizados
- [x] MongoDB atualizado
- [ ] **→ Webhook sync_user_purchases criado**
- [ ] **→ Webhook sync_user_trials criado**
- [ ] **→ Teste de webhook em tempo real**
- [ ] Importar workflows n8n (backup)

---

**Configure os 2 webhooks agora e me confirme quando finalizar!** 🚀

Depois vamos testar o webhook em tempo real! 🔥
