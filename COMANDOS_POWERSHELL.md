# 🪟 Comandos para PowerShell (Windows)

## ⚠️ Importante: curl no PowerShell é diferente!

No PowerShell, use `Invoke-RestMethod` ao invés de `curl`.

---

## 🧪 TESTES NO POWERSHELL:

### **1. Health Check**
```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/health" -Method Get
```

---

### **2. Listar Apps**
```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/apps" -Method Get
```

---

### **3. Sincronização Manual (Full Sync)**
```powershell
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/full" -Method Post -Headers $headers
```

---

### **4. Ver Logs**
```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=10" -Method Get
```

---

### **5. Sincronizar Usuário Específico**
```powershell
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
    "Content-Type" = "application/json"
}

$body = @{
    "app_id" = "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/user/SEU_USER_ID" -Method Post -Headers $headers -Body $body
```

---

## 🎯 Comandos Rápidos (Copie e Cole):

### **Teste Completo:**
```powershell
# 1. Health Check
Write-Host "=== HEALTH CHECK ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/health" -Method Get

# 2. Listar Apps
Write-Host "`n=== APPS DETECTADOS ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/apps" -Method Get

# 3. Sincronização Full
Write-Host "`n=== SYNC FULL ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/full" -Method Post -Headers $headers

# 4. Ver Logs
Write-Host "`n=== LOGS ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=10" -Method Get
```

---

## 📝 Alternativa: Usar Navegador

Se preferir, pode testar direto no navegador:

### **URLs que funcionam no navegador (GET):**
- https://lwdigitalforge-texte.onrender.com/health
- https://lwdigitalforge-texte.onrender.com/apps
- https://lwdigitalforge-texte.onrender.com/logs?limit=10

### **Para POST (sync/full), use:**
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **Thunder Client** (extensão VSCode)

---

## 🔧 Configurar Thunder Client no VSCode (Recomendado):

1. Abra VSCode
2. Instale extensão "Thunder Client"
3. Abra Thunder Client (ícone de raio na sidebar)
4. Nova Request:
   - Method: `POST`
   - URL: `https://lwdigitalforge-texte.onrender.com/sync/full`
   - Headers:
     - `Authorization`: `Bearer b835e3f27925c1db60f2f25d163d9d92`
     - `Content-Type`: `application/json`
5. Send

---

## 📋 Resposta Esperada:

### **Health Check:**
```json
{
  "status": "healthy",
  "supabase": "connected",
  "mongodb": "connected",
  "timestamp": "2026-01-13T..."
}
```

### **Apps:**
```json
{
  "success": true,
  "count": 2,
  "apps": [
    {
      "id": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
      "name": "JornadaPro",
      "is_active": true
    }
  ]
}
```

### **Sync Full:**
```json
{
  "success": true,
  "total_users": 5,
  "synced": 5,
  "failed": 0
}
```

### **Logs:**
```json
{
  "success": true,
  "count": 5,
  "logs": [
    {
      "user_id": "...",
      "app_name": "JornadaPro",
      "has_access": true,
      "access_type": "LIFETIME"
    }
  ]
}
```
