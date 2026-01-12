# 🏗️ Arquitetura Simples: Sincronização Automática

## ❌ Problema Atual

A arquitetura está **confusa**:
- `is_liberado` e `data_vencimento` em `profiles` → confunde com acesso aos apps
- Lógica duplicada entre Supabase e MongoDB
- Múltiplas fontes da verdade

## ✅ Solução Proposta: FONTE ÚNICA DA VERDADE

### **📊 Supabase = Fonte da Verdade**

Apenas **2 tabelas** definem acesso:
1. `user_purchases` → Compras (MONTHLY, ANNUAL, LIFETIME)
2. `user_trials` → Trials ativos

**REMOVER:**
- ❌ `is_liberado` (não serve mais)
- ❌ `data_vencimento` (não serve mais)
- ❌ `user_product_access` (redundante)

### **🔄 Apps verificam DIRETAMENTE o Supabase**

Cada aplicação (JornadaPro, etc) verifica:

```javascript
// lib/subscription-service.js
export async function hasAccess(userId, appId) {
  // 1. Verificar user_purchases (LIFETIME, MONTHLY, ANNUAL)
  const purchase = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('status', 'APPROVED')
    .or('purchase_type.eq.LIFETIME,expires_at.gt.' + new Date().toISOString());
  
  if (purchase.data?.length > 0) return true;

  // 2. Verificar user_trials
  const trial = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString());
  
  if (trial.data?.length > 0) return true;

  return false;
}
```

**Pronto!** Sem sincronização, sem confusão.

---

## 🔄 Se Precisar Sincronizar MongoDB (Opcional)

### **Opção 1: Webhook Supabase → Python (Render)**

```python
# webhook_sync.py (hospedar na Render)
from flask import Flask, request
from pymongo import MongoClient
import os

app = Flask(__name__)
mongo_client = MongoClient(os.environ['MONGODB_URI'])
db = mongo_client['jornadapro']

@app.route('/sync-user-access', methods=['POST'])
def sync_user_access():
    data = request.json
    user_id = data['record']['user_id']
    app_id = data['record']['app_id']
    
    # Verificar acesso no Supabase (via API)
    has_access = check_supabase_access(user_id, app_id)
    
    # Atualizar MongoDB
    db.user_access.update_one(
        {'user_id': user_id, 'app_id': app_id},
        {'$set': {'has_access': has_access, 'updated_at': datetime.now()}},
        upsert=True
    )
    
    return {'success': True}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Configurar Webhook no Supabase:**
1. Supabase Dashboard → Database → Webhooks
2. Criar webhook para `user_purchases` e `user_trials` (INSERT, UPDATE)
3. URL: `https://seu-app.render.com/sync-user-access`

---

### **Opção 2: GitHub Actions (Cron Job)**

```yaml
# .github/workflows/sync-mongo-access.yml
name: Sync MongoDB Access

on:
  schedule:
    - cron: '0 * * * *'  # A cada hora
  workflow_dispatch:  # Manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install pymongo supabase requests
      
      - name: Sync Access
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
        run: python scripts/sync-mongo-access.py
```

```python
# scripts/sync-mongo-access.py
import os
from pymongo import MongoClient
from supabase import create_client

# Conectar Supabase
supabase = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_KEY']
)

# Conectar MongoDB
mongo = MongoClient(os.environ['MONGODB_URI'])
db = mongo['jornadapro']

def sync_all_users():
    # 1. Buscar todos os usuários com acesso
    purchases = supabase.table('user_purchases').select('*').eq('status', 'APPROVED').execute()
    trials = supabase.table('user_trials').select('*').eq('is_active', True).execute()
    
    # 2. Criar lista de acesso
    access_list = {}
    
    for p in purchases.data:
        key = f"{p['user_id']}_{p['app_id']}"
        access_list[key] = {
            'user_id': p['user_id'],
            'app_id': p['app_id'],
            'type': p['purchase_type'],
            'expires_at': p.get('expires_at'),
            'has_access': True
        }
    
    for t in trials.data:
        key = f"{t['user_id']}_{t['app_id']}"
        if t['expires_at'] > datetime.now().isoformat():
            access_list[key] = {
                'user_id': t['user_id'],
                'app_id': t['app_id'],
                'type': 'TRIAL',
                'expires_at': t['expires_at'],
                'has_access': True
            }
    
    # 3. Atualizar MongoDB
    for key, access in access_list.items():
        db.user_access.update_one(
            {'_id': key},
            {'$set': access},
            upsert=True
        )
    
    print(f"✅ Sincronizados {len(access_list)} acessos")

if __name__ == '__main__':
    sync_all_users()
```

---

### **Opção 3: Vercel Edge Function (Agente IA)**

```typescript
// api/sync-access.ts (Vercel)
import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  // 1. Buscar mudanças no Supabase
  const { data: purchases } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('status', 'APPROVED')
  
  // 2. Conectar MongoDB
  const mongo = new MongoClient(process.env.MONGODB_URI!)
  await mongo.connect()
  const db = mongo.db('jornadapro')
  
  // 3. Sincronizar
  for (const purchase of purchases) {
    await db.collection('user_access').updateOne(
      { user_id: purchase.user_id, app_id: purchase.app_id },
      { $set: { has_access: true, updated_at: new Date() } },
      { upsert: true }
    )
  }
  
  await mongo.close()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**Configurar Cron Job na Vercel:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/sync-access",
    "schedule": "0 * * * *"
  }]
}
```

---

## 🎯 Recomendação Final

### **🥇 Melhor Solução: SEM SINCRONIZAÇÃO**

**Apps verificam Supabase diretamente:**
- ✅ Sem duplicação de dados
- ✅ Sempre atualizado em tempo real
- ✅ Sem sincronização para quebrar
- ✅ Fonte única da verdade

**Quando usar sincronização:**
- ⚠️ Apenas se o MongoDB for usado para outras coisas também
- ⚠️ Se precisar de queries complexas no MongoDB

---

## 📋 Ações Imediatas

### **1. Corrigir Usuários com FALSE**

```sql
-- Liberar os 2 usuários que estão bloqueados
UPDATE profiles
SET is_liberado = TRUE, data_vencimento = '2099-01-01'
WHERE email IN ('admin@lwdigitalforge.com', 'lucas05willian@hotmail.com');
```

### **2. Simplificar Arquitetura (Opcional)**

```sql
-- REMOVER colunas confusas (CUIDADO: irreversível!)
ALTER TABLE profiles DROP COLUMN is_liberado;
ALTER TABLE profiles DROP COLUMN data_vencimento;

-- Agora acesso é APENAS via user_purchases/user_trials
```

### **3. Atualizar Código dos Apps**

Remover qualquer verificação de `is_liberado`, usar apenas:
- `user_purchases` (para compras)
- `user_trials` (para trials)

---

## 🚀 Qual Você Prefere?

1. **Arquitetura Simples** (apps verificam Supabase diretamente) ← **RECOMENDADO**
2. **GitHub Actions** (sincronização a cada hora)
3. **Webhook Python Render** (sincronização em tempo real)
4. **Vercel Edge Function** (sincronização agendada)

**Me diga qual você quer implementar!** 🎯
