# 🚀 GUIA RÁPIDO: Verificação Completa de Acesso

## 🎯 OBJETIVO:
Verificar se o MongoDB está sincronizado com o Supabase e corrigir automaticamente.

---

## ✅ OPÇÃO 1: Script Python Automático (RECOMENDADO)

### **Passo 1: Instalar dependências**

```powershell
cd C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte
pip install pymongo supabase
```

### **Passo 2: Executar o script**

```powershell
python verificar_sincronizacao_mongodb.py
```

### **Resultado esperado:**

```
================================================================================
🔍 VERIFICAÇÃO DE SINCRONIZAÇÃO SUPABASE → MONGODB
================================================================================

📡 Conectando ao Supabase...
✅ Conectado ao Supabase!

📡 Conectando ao MongoDB...
✅ Conectado ao MongoDB!

🔍 Buscando usuários no Supabase...
✅ Encontrados 7 usuários no Supabase

================================================================================
📊 VERIFICAÇÃO POR USUÁRIO:
================================================================================

👤 lucas005wfj@gmail.com (ADMIN)
   ID: 28793cc3-b3bb-4536-897b-8c37251992c4
   Supabase: ✅ TEM ACESSO (TRIAL)
   MongoDB:  ✅ TEM ACESSO (TRIAL)
   Status:   ✅ SINCRONIZADO

👤 lwdigitalforge@gmail.com (ADMIN)
   ID: 52c476c6-4edd-4f61-8f5e-599e067d6bc1
   Supabase: ✅ TEM ACESSO (LIFETIME)
   MongoDB:  ✅ TEM ACESSO (LIFETIME)
   Status:   ✅ SINCRONIZADO

...

================================================================================
📊 RESUMO:
================================================================================
✅ Sincronizados:       7
🔄 Atualizados/Criados: 0
❌ Sem acesso:          0
📊 Total:               7

✅ TUDO JÁ ESTAVA SINCRONIZADO!
```

---

## ✅ OPÇÃO 2: Via API REST (PowerShell)

### **Passo 1: Forçar sincronização completa**

```powershell
$headers = @{
    "Authorization" = "Bearer b835e3f27925c1db60f2f25d163d9d92"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/sync/full" -Method Post -Headers $headers

# Ver resultado
$response | ConvertTo-Json -Depth 10
```

### **Passo 2: Ver logs de sincronização**

```powershell
Invoke-RestMethod -Uri "https://lwdigitalforge-texte.onrender.com/logs?limit=30" -Method Get | ConvertTo-Json -Depth 10
```

---

## ✅ OPÇÃO 3: Verificação Manual via Supabase + MongoDB Atlas

### **Passo 1: Verificar Supabase** (já fizemos)

✅ Todos os 7 usuários têm acesso válido no Supabase

### **Passo 2: Verificar MongoDB Atlas**

1. Acesse: https://cloud.mongodb.com/
2. Login com credenciais da conta
3. Navegue até o cluster `JornadaPro`
4. Abra o database `jornadapro_db`
5. Abra a collection `user_access`
6. Execute a query:

```javascript
{
  "app_id": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}
```

**Deve retornar 7 documentos, algo como:**

```json
[
  {
    "_id": "...",
    "user_id": "28793cc3-b3bb-4536-897b-8c37251992c4",
    "app_id": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
    "has_access": true,
    "access_type": "TRIAL",
    "last_updated": "2026-01-13T..."
  },
  {
    "_id": "...",
    "user_id": "52c476c6-4edd-4f61-8f5e-599e067d6bc1",
    "app_id": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
    "has_access": true,
    "access_type": "LIFETIME",
    "last_updated": "2026-01-13T..."
  },
  ...
]
```

**Se houver menos de 7 documentos ou algum com `has_access: false`, execute a OPÇÃO 1 ou 2.**

---

## ❓ SE AINDA NÃO CONSEGUIR ACESSAR

### **1. Verificar qual usuário você está usando:**

Execute no Supabase SQL Editor:

```sql
SELECT 
  id, 
  email, 
  role,
  is_liberado
FROM profiles
WHERE email = 'SEU_EMAIL_AQUI@gmail.com';
```

### **2. Verificar se o `ProtectedProductRoute.jsx` está atualizado:**

```powershell
cd C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte
git status
git log --oneline -5
```

**Deve mostrar os últimos commits incluindo:**
- `fix: remove is_liberado check from ProtectedProductRoute for access validation`

### **3. Verificar no navegador (F12 → Console):**

1. Acesse a aplicação: https://jornadapro.lwdigitalforge.com
2. Abra o Console (F12)
3. Procure por erros relacionados a:
   - `ProtectedProductRoute`
   - `access denied`
   - `401 Unauthorized`
   - `403 Forbidden`

### **4. Testar com seu usuário específico:**

Qual email você está usando para tentar acessar?

Execute este SQL substituindo pelo SEU email:

```sql
-- Verificar TUDO sobre seu acesso
WITH user_info AS (
  SELECT id, email, full_name, role, is_liberado
  FROM profiles
  WHERE email = 'SEU_EMAIL@gmail.com'
)
SELECT 
  u.email,
  u.role,
  u.is_liberado,
  
  -- Compras
  COALESCE(
    (SELECT json_agg(json_build_object(
      'type', purchase_type,
      'status', status,
      'expires_at', expires_at
    ))
    FROM user_purchases
    WHERE user_id = u.id
      AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'),
    '[]'::json
  ) as purchases,
  
  -- Trials
  COALESCE(
    (SELECT json_agg(json_build_object(
      'is_active', is_active,
      'expires_at', expires_at
    ))
    FROM user_trials
    WHERE user_id = u.id
      AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'),
    '[]'::json
  ) as trials

FROM user_info u;
```

---

## 🎯 CHECKLIST DE DIAGNÓSTICO:

- [ ] Executei o script Python (`verificar_sincronizacao_mongodb.py`)
- [ ] Todos os usuários estão sincronizados no MongoDB
- [ ] Verifiquei meu email/senha no login
- [ ] Abri o console do navegador (F12) e não há erros 401/403
- [ ] Verifiquei que o `ProtectedProductRoute.jsx` foi atualizado
- [ ] Fiz logout e login novamente
- [ ] Limpei o cache do navegador (Ctrl+Shift+Delete)

---

## 🆘 SE TUDO ISSO FALHAR:

**Me envie:**
1. Screenshot do console do navegador (F12) ao tentar acessar
2. Qual email você está usando para login
3. Resultado do script Python ou do comando `/sync/full`
4. Se há alguma mensagem de erro específica

---

**Execute a OPÇÃO 1 (Script Python) primeiro e me mostre o resultado completo!** 🚀
