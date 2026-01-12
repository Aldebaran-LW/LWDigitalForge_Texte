# ✅ Guia: Validação Automática de Liberação nos Workflows n8n

## 🎯 Objetivo

Os workflows agora **validam automaticamente** a liberação dos apps usando as tabelas do Supabase:
- `user_trials` - Trials ativos
- `user_purchases` - Compras/assinaturas
- `registered_apps` - Apps cadastrados (valida se está ativo)
- `profiles` - Status de liberação do usuário

---

## 🔄 Workflow Automático (Já Funciona)

O workflow `n8n-workflow-liberacao-simples.json` já utiliza a função RPC:
- **`update_all_users_liberado_status()`** - Atualiza todos os usuários
- Esta função usa `calculate_user_liberado_status()` que valida:
  1. Compras LIFETIME
  2. Compras MONTHLY/ANNUAL ativas
  3. Trials ativos

---

## 🔄 Workflow Manual Validado (NOVO)

O workflow `n8n-workflow-liberacao-manual-validado.json` agora inclui:

### **Validações ANTES de Criar:**

1. **Buscar Usuário** → Valida se usuário existe e busca status atual (`is_liberado`, `data_vencimento`)
2. **Buscar App** → Valida se app existe e se está ativo (`is_active`)
3. **Verificar Trial Existente** → Verifica se já existe trial ativo na tabela `user_trials`
4. **Verificar Compra Existente** → Verifica se já existe compra ativa na tabela `user_purchases`
5. **Validar Trial/Compra** → Mostra aviso se já existe acesso ativo

### **Validações DEPOIS de Criar:**

1. **Criar Trial/Compra** → Insere na tabela correspondente
2. **Atualizar Liberação** → Chama `update_user_liberado_status()` para recalcular
3. **Verificar Liberação** → Busca o status atualizado em `profiles` para confirmar

---

## 📊 Tabelas Utilizadas

### **1. `user_trials`**
- Verifica trials ativos: `is_active = true` e `expires_at > NOW()`
- Usado para validar se já existe trial antes de criar novo

### **2. `user_purchases`**
- Verifica compras ativas: `status = 'APPROVED'` e `expires_at > NOW()` (ou LIFETIME)
- Usado para validar se já existe compra antes de criar nova

### **3. `registered_apps`**
- Valida se app existe e está ativo: `is_active = true`
- Usado para garantir que só cria acesso para apps ativos

### **4. `profiles`**
- Armazena status de liberação: `is_liberado` e `data_vencimento`
- Atualizado automaticamente pelos triggers após criar trial/compra

---

## 🔍 Funções RPC Utilizadas

### **`calculate_user_liberado_status(p_user_id)`**
Valida a liberação verificando:
1. **LIFETIME** → Se tem compra vitalícia
2. **MONTHLY/ANNUAL** → Se tem assinatura ativa (não expirada)
3. **TRIAL** → Se tem trial ativo (não expirado)

### **`update_user_liberado_status(p_user_id)`**
Atualiza `is_liberado` e `data_vencimento` na tabela `profiles` baseado nas validações acima.

### **`update_all_users_liberado_status()`**
Atualiza todos os usuários (usado pelo workflow automático).

---

## ✅ Fluxo de Validação Completo

```
1. Buscar Usuário
   ↓
2. Validar se usuário existe
   ↓
3. Buscar App
   ↓
4. Validar se app existe e está ativo
   ↓
5. Verificar Tipo (TRIAL ou COMPRA)
   ↓
6. Verificar se já existe trial/compra ativo
   ↓
7. Mostrar aviso se já existe (mas continua)
   ↓
8. Preparar dados (calcular datas)
   ↓
9. Criar trial/compra na tabela
   ↓
10. Atualizar liberação (chama RPC)
    ↓
11. Verificar liberação atualizada
    ↓
12. Retornar resultado
```

---

## 🛡️ Validações Implementadas

### **Validação 1: Usuário Existe**
- Busca em `profiles` por email
- Se não encontrar, retorna erro

### **Validação 2: App Existe e Está Ativo**
- Busca em `registered_apps` por ID ou nome
- Valida se `is_active = true`
- Se não encontrar ou inativo, retorna erro

### **Validação 3: Trial Existente**
- Busca em `user_trials`:
  - `user_id = X`
  - `app_id = Y`
  - `is_active = true`
  - `expires_at > NOW()`
- Se encontrar, mostra aviso mas continua

### **Validação 4: Compra Existente**
- Busca em `user_purchases`:
  - `user_id = X`
  - `app_id = Y`
  - `status = 'APPROVED'`
  - `expires_at > NOW()` (ou LIFETIME)
- Se encontrar, mostra aviso mas continua

### **Validação 5: Liberação Atualizada**
- Após criar, chama `update_user_liberado_status()`
- Verifica se `is_liberado` e `data_vencimento` foram atualizados corretamente

---

## 📝 Exemplo de Uso

**Input:**
```json
{
  "email": "usuario@email.com",
  "app_id": "JornadaPro",
  "tipo": "TRIAL",
  "dias": 14
}
```

**Processo:**
1. Busca usuário → Encontrado
2. Busca app → Encontrado e ativo
3. Verifica trial existente → Não encontrado
4. Cria trial na tabela `user_trials`
5. Atualiza liberação → Chama RPC
6. Verifica liberação → `is_liberado = true`, `data_vencimento = 2026-01-25`

**Output:**
```json
{
  "status": "✅ Liberação criada e validada com sucesso!",
  "detalhes": "...",
  "liberacao": {
    "is_liberado": true,
    "data_vencimento": "2026-01-25T00:00:00.000Z"
  }
}
```

---

## 🔧 Triggers Automáticos do Supabase

Os triggers do Supabase atualizam automaticamente `is_liberado` e `data_vencimento` quando:
- **INSERT** em `user_trials`
- **UPDATE** em `user_trials`
- **DELETE** em `user_trials`
- **INSERT** em `user_purchases`
- **UPDATE** em `user_purchases`
- **DELETE** em `user_purchases`

Mas o workflow também chama manualmente `update_user_liberado_status()` para garantir que está correto.

---

## ✅ Vantagens

1. **Validação Completa** → Verifica todas as tabelas antes de criar
2. **Prevenção de Duplicatas** → Avisa se já existe acesso ativo
3. **Validação Pós-Criação** → Confirma que liberação foi atualizada
4. **Uso das Funções RPC** → Utiliza a mesma lógica do sistema
5. **Sincronização** → Garante que `profiles` está sempre atualizado

---

**Os workflows agora validam automaticamente usando as tabelas do Supabase!** ✅
