# 🔍 VERIFICAÇÃO: MongoDB Sincronizado?

## ❓ O QUE PODE ESTAR ERRADO:

Mesmo com todos os acessos corretos no **Supabase**, se o **MongoDB** (usado pela aplicação JornadaPro) não estiver sincronizado, você ainda não terá acesso.

---

## 🧪 TESTE 1: Verificar se o Webhook está funcionando

### **No PowerShell:**

```powershell
# 1. Verificar saúde do servidor
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/health" -Method Get

# 2. Ver logs recentes
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=20" -Method Get

# 3. Ver apps detectados
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/apps" -Method Get

# 4. FORÇAR sincronização COMPLETA
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
}
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/full" -Method Post -Headers $headers
```

---

## 🧪 TESTE 2: Verificar Webhooks no Supabase

### **1. Abra o Supabase Dashboard:**
https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/database/hooks

### **2. Verifique se os webhooks estão ativos:**

Devem existir **2 webhooks**:

#### ✅ Webhook 1: `sync_user_purchases`
- **Tabela:** `user_purchases`
- **Eventos:** INSERT, UPDATE
- **URL:** `https://lwdigitalforge-texte.onrender.com/webhook/purchases`
- **HTTP Headers:**
  ```
  x-webhook-secret: 321315424ecf5d3818f56724b97fb04e
  ```

#### ✅ Webhook 2: `sync_user_trials`
- **Tabela:** `user_trials`
- **Eventos:** INSERT, UPDATE
- **URL:** `https://lwdigitalforge-texte.onrender.com/webhook/trials`
- **HTTP Headers:**
  ```
  x-webhook-secret: 321315424ecf5d3818f56724b97fb04e
  ```

### **3. Se os webhooks não existirem, CRIE-OS:**

Execute este SQL no Supabase SQL Editor:

```sql
-- CRIAR WEBHOOK PARA user_purchases
SELECT supabase_url || '/functions/v1/http-request' AS url
FROM (SELECT current_setting('app.settings.supabase_url', true) AS supabase_url) AS sub;

-- Se não funcionar, use o painel UI do Supabase
```

---

## 🧪 TESTE 3: Verificar MongoDB diretamente

### **Opção A: Se você tem acesso ao MongoDB Atlas:**

1. Acesse: https://cloud.mongodb.com/
2. Navegue até o cluster `JornadaPro`
3. Abra a coleção `user_access`
4. Busque por:
   ```json
   {
     "user_id": "28793cc3-b3bb-4536-897b-8c37251992c4"
   }
   ```
   (Substitua pelo seu `user_id`)

### **Opção B: Via código Python (se tiver acesso):**

```python
from pymongo import MongoClient

uri = "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)

db = client['jornadapro_db']
collection = db['user_access']

# Buscar seu usuário
user = collection.find_one({"user_id": "28793cc3-b3bb-4536-897b-8c37251992c4"})
print(user)
```

**Resultado esperado:**
```json
{
  "_id": "...",
  "user_id": "28793cc3-b3bb-4536-897b-8c37251992c4",
  "app_id": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "has_access": true,
  "access_type": "TRIAL",
  "last_updated": "2026-01-13T..."
}
```

---

## 🔥 SOLUÇÃO RÁPIDA: Forçar sincronização AGORA

### **Execute no PowerShell:**

```powershell
# 1. Forçar sincronização completa
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
}
$response = Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/full" -Method Post -Headers $headers

# 2. Ver resultado
$response | ConvertTo-Json -Depth 10
```

**Resultado esperado:**
```json
{
  "status": "success",
  "synced_count": 7,
  "errors": []
}
```

---

## 🧪 TESTE 4: Verificar Frontend atualizado

### **Seu `ProtectedProductRoute.jsx` está atualizado?**

```bash
cd c:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte
git status
```

### **Se houver mudanças não commitadas:**

```bash
git pull origin main
```

---

## ❓ QUAL TESTE EXECUTAR PRIMEIRO?

**EXECUTE NESTA ORDEM:**

1. ✅ **TESTE 1:** Forçar sincronização completa (1 minuto)
2. ✅ **TESTE 2:** Ver logs do servidor (ver se há erros)
3. ✅ **TESTE 3:** Verificar webhooks no Supabase
4. ✅ **TESTE 4:** Tentar acessar a aplicação novamente

---

## 🎯 APÓS EXECUTAR, ME MOSTRE:

1. Resultado do comando `sync/full`
2. Logs do servidor (`/logs`)
3. Se conseguiu acessar a aplicação
4. Se não, qual erro aparece no console do navegador (F12)

---

**Execute o TESTE 1 agora e me mostre o resultado!** 🚀
