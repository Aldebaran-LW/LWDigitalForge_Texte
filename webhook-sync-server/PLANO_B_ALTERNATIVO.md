# 🔄 Plano B: Servidor Webhook Alternativo

## Se supabase-py continuar dando erro...

### **Opção: Usar requests direto (sem SDK supabase-py)**

```python
# app.py (versão alternativa)
from flask import Flask, request, jsonify
from pymongo import MongoClient
import requests
import os
from datetime import datetime

app = Flask(__name__)

# Configuração
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
MONGODB_URI = os.environ.get('MONGODB_URI')

# MongoDB
mongo_client = MongoClient(MONGODB_URI)

# Headers para Supabase
def get_supabase_headers():
    return {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }

# Função para consultar Supabase via REST API
def query_supabase(table, filters=None):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    params = filters or {}
    response = requests.get(url, headers=get_supabase_headers(), params=params)
    return response.json()

# Exemplo de uso
def get_all_apps():
    return query_supabase('registered_apps', {'is_active': 'eq.true'})

def get_user_purchases(user_id, app_id):
    return query_supabase('user_purchases', {
        'user_id': f'eq.{user_id}',
        'app_id': f'eq.{app_id}',
        'status': 'eq.APPROVED'
    })

def get_user_trials(user_id, app_id):
    return query_supabase('user_trials', {
        'user_id': f'eq.{user_id}',
        'app_id': f'eq.{app_id}',
        'is_active': 'eq.true'
    })

# Resto do código igual...
```

**Vantagens:**
- ✅ Sem dependências problemáticas
- ✅ Mais controle
- ✅ Funciona 100%

**Se precisar, posso gerar o arquivo completo!**
