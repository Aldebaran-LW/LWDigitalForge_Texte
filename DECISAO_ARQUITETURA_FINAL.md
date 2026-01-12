# 🎯 Decisão de Arquitetura: Qual Caminho Seguir?

## 📊 Situação Atual

### **Problema:**
- `is_liberado` e `data_vencimento` em `profiles` → **confuso**
- 3 tabelas para controle de acesso → **redundante**
- Sincronização entre Supabase e MongoDB → **complexo**

### **Tabelas Atuais:**
1. `profiles.is_liberado` + `profiles.data_vencimento` ← Confuso
2. `user_purchases` ← Compras/Assinaturas
3. `user_trials` ← Trials
4. `user_product_access` ← Redundante (pode remover)

---

## 🎯 3 Caminhos Possíveis

### **Opção 1: SIMPLIFICAR (Recomendado) 🥇**

#### **Arquitetura:**
```
Supabase = ÚNICA FONTE DA VERDADE
  ↓
Apps consultam DIRETAMENTE
  - user_purchases
  - user_trials
```

#### **Vantagens:**
- ✅ **Simples** - apenas 2 tabelas
- ✅ **Tempo real** - sem atraso
- ✅ **Sem sincronização** - não quebra
- ✅ **Fácil debug** - uma fonte só

#### **Desvantagens:**
- ⚠️ Apps precisam ter acesso ao Supabase
- ⚠️ Mais queries ao Supabase

#### **Mudanças Necessárias:**
```sql
-- 1. Remover colunas confusas (OPCIONAL)
ALTER TABLE profiles DROP COLUMN is_liberado;
ALTER TABLE profiles DROP COLUMN data_vencimento;

-- 2. Dropar tabela redundante
DROP TABLE IF EXISTS user_product_access;
```

#### **Código do App:**
```javascript
// Apenas verificar user_purchases e user_trials
async function hasAccess(userId, appId) {
  const purchase = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('status', 'APPROVED')
    .single();
  
  if (purchase) return true;

  const trial = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  return !!trial;
}
```

---

### **Opção 2: GITHUB ACTIONS (Sincronização Automática) 🔄**

#### **Arquitetura:**
```
Supabase (fonte da verdade)
  ↓
GitHub Actions (a cada hora)
  ↓
MongoDB/Outros (cache local)
```

#### **Vantagens:**
- ✅ **Grátis** - GitHub Actions tem limite generoso
- ✅ **Confiável** - roda automaticamente
- ✅ **Simples** - apenas um script Python

#### **Desvantagens:**
- ⚠️ **Delay** - atualiza a cada hora (não é tempo real)
- ⚠️ **Duplicação** - dados em 2 lugares

#### **Implementação:**
```yaml
# .github/workflows/sync-access.yml
name: Sync User Access
on:
  schedule:
    - cron: '0 * * * *'  # A cada hora
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install pymongo supabase
      - run: python scripts/sync-access.py
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

```python
# scripts/sync-access.py
from supabase import create_client
from pymongo import MongoClient
import os

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])
mongo = MongoClient(os.environ['MONGODB_URI'])

# Buscar todos com acesso
purchases = supabase.table('user_purchases').select('*').eq('status', 'APPROVED').execute()

# Atualizar MongoDB
for p in purchases.data:
    mongo.jornadapro.user_access.update_one(
        {'user_id': p['user_id'], 'app_id': p['app_id']},
        {'$set': {'has_access': True}},
        upsert=True
    )
```

---

### **Opção 3: WEBHOOK + PYTHON (Render) (Tempo Real) ⚡**

#### **Arquitetura:**
```
Supabase Webhook
  ↓ (em tempo real)
Python Flask (Render)
  ↓
MongoDB (atualiza)
```

#### **Vantagens:**
- ✅ **Tempo real** - atualiza na hora
- ✅ **Eficiente** - só atualiza quando muda

#### **Desvantagens:**
- ⚠️ **Mais complexo** - precisa hospedar na Render
- ⚠️ **Custo** - Render pode cobrar (plano grátis limitado)
- ⚠️ **Manutenção** - mais um serviço para manter

#### **Implementação:**
```python
# webhook_server.py (hospedar na Render)
from flask import Flask, request
from pymongo import MongoClient
import os

app = Flask(__name__)
mongo = MongoClient(os.environ['MONGODB_URI'])

@app.route('/webhook/user-access', methods=['POST'])
def sync_access():
    data = request.json
    record = data['record']
    
    mongo.jornadapro.user_access.update_one(
        {'user_id': record['user_id'], 'app_id': record['app_id']},
        {'$set': {'has_access': record['status'] == 'APPROVED'}},
        upsert=True
    )
    
    return {'success': True}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Configurar no Supabase:**
1. Database → Webhooks → Create Webhook
2. Table: `user_purchases`
3. Events: INSERT, UPDATE
4. URL: `https://seu-app.render.com/webhook/user-access`

---

## 🤔 Comparação

| Critério | Opção 1 (Simples) | Opção 2 (GitHub) | Opção 3 (Webhook) |
|----------|-------------------|------------------|-------------------|
| **Complexidade** | 🟢 Muito Simples | 🟡 Médio | 🔴 Complexo |
| **Tempo Real** | 🟢 Sim | 🔴 Não (1h) | 🟢 Sim |
| **Custo** | 🟢 Grátis | 🟢 Grátis | 🟡 Pode ter custo |
| **Manutenção** | 🟢 Baixa | 🟡 Média | 🔴 Alta |
| **Confiabilidade** | 🟢 Alta | 🟢 Alta | 🟡 Média |
| **Duplicação** | 🟢 Não | 🔴 Sim | 🔴 Sim |

---

## 🎯 Recomendação

### **Para 90% dos casos: OPÇÃO 1 (Simples) 🥇**

**Por quê?**
1. Apps web sempre têm acesso ao Supabase
2. Tempo real sem complexidade
3. Sem sincronização = sem bugs
4. Fácil de debugar

### **Use Opção 2 (GitHub Actions) SE:**
- MongoDB precisa ter os dados localmente
- Acesso a Supabase é lento/caro
- Atualização a cada hora é aceitável

### **Use Opção 3 (Webhook) SE:**
- Precisa de tempo real absoluto
- MongoDB é a base principal
- Tem budget para Render

---

## 📋 Próximos Passos

### **Se escolher Opção 1 (Recomendado):**

1. **Corrigir usuários bloqueados:**
```sql
UPDATE profiles
SET is_liberado = TRUE, data_vencimento = '2099-01-01'
WHERE email IN ('admin@lwdigitalforge.com', 'lucas05willian@hotmail.com');
```

2. **Remover colunas confusas (OPCIONAL):**
```sql
ALTER TABLE profiles DROP COLUMN is_liberado;
ALTER TABLE profiles DROP COLUMN data_vencimento;
```

3. **Atualizar apps para verificar apenas:**
   - `user_purchases`
   - `user_trials`

---

### **Se escolher Opção 2 (GitHub Actions):**

1. Criar `scripts/sync-access.py`
2. Criar `.github/workflows/sync-access.yml`
3. Adicionar secrets no GitHub
4. Testar manualmente

---

### **Se escolher Opção 3 (Webhook):**

1. Criar app Flask
2. Deploy na Render
3. Configurar webhook no Supabase
4. Testar envio

---

## 🚀 Qual Você Escolhe?

**Digite:**
- `1` para Opção 1 (Simples - Recomendado)
- `2` para Opção 2 (GitHub Actions)
- `3` para Opção 3 (Webhook Render)

Ou me diga qual faz mais sentido para você! 🎯
