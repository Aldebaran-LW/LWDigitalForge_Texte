# 📋 Guia: Workflow de Liberação Manual no n8n

## 🎯 Objetivo

Workflow para liberar acesso manualmente para usuários que estão:
- **Testando** (TRIAL)
- **Assinando** (MONTHLY ou ANNUAL)
- **Vitalício** (LIFETIME)

---

## 📥 Como Usar

### **1. Importar o Workflow**

1. No n8n, vá em **Workflows** → **Import from File**
2. Selecione: `n8n-workflow-liberacao-manual.json`
3. O workflow será importado

---

### **2. Executar Manualmente**

1. Clique no botão **"Executar fluxo de trabalho"** (Execute workflow)
2. Na tela de input do **Manual Trigger**, preencha os dados no formato JSON:

**Campos necessários:**
- **`email`**: Email do usuário (ex: `usuario@email.com`)
- **`app_id`**: ID do app (UUID) ou nome do app (ex: `JornadaPro`)
- **`tipo`**: Tipo de acesso:
  - `TRIAL` - Para trial/teste
  - `MONTHLY` - Assinatura mensal
  - `ANNUAL` - Assinatura anual
  - `LIFETIME` - Compra vitalícia
- **`dias`** (opcional): Duração em dias (para trial ou duração personalizada)

**Exemplo de JSON para o Manual Trigger:**
```json
{
  "email": "usuario@email.com",
  "app_id": "JornadaPro",
  "tipo": "TRIAL",
  "dias": 14
}
```

**OU você pode usar o node "Coletar Dados" para definir valores padrão:**
- Clique no node "Coletar Dados"
- Edite os campos para definir valores padrão ou usar expressões

---

### **3. Exemplos de Uso**

#### **Criar Trial de 14 dias:**
```json
{
  "email": "usuario@email.com",
  "app_id": "123e4567-e89b-12d3-a456-426614174000",
  "tipo": "TRIAL",
  "dias": 14
}
```

#### **Criar Assinatura Mensal:**
```json
{
  "email": "usuario@email.com",
  "app_id": "JornadaPro",
  "tipo": "MONTHLY"
}
```

#### **Criar Assinatura Anual:**
```json
{
  "email": "usuario@email.com",
  "app_id": "123e4567-e89b-12d3-a456-426614174000",
  "tipo": "ANNUAL"
}
```

#### **Criar Compra Vitalícia:**
```json
{
  "email": "usuario@email.com",
  "app_id": "JornadaPro",
  "tipo": "LIFETIME"
}
```

#### **Criar Assinatura com Duração Personalizada (30 dias):**
```json
{
  "email": "usuario@email.com",
  "app_id": "JornadaPro",
  "tipo": "MONTHLY",
  "dias": 30
}
```

---

## 🔄 Fluxo do Workflow

1. **Manual Trigger** → Inicia o workflow manualmente (recebe JSON com email, app_id, tipo, dias)
2. **Coletar Dados** → Coleta os dados de entrada do Manual Trigger
3. **Buscar Usuário** → Busca o usuário por email no Supabase (retorna array)
4. **Mesclar Usuário** → Mescla dados do usuário com dados anteriores (extrai primeiro item do array)
5. **Buscar App** → Busca o app por ID ou nome no Supabase (retorna array)
6. **Mesclar App** → Mescla dados do app com dados anteriores (extrai primeiro item do array)
7. **Verificar Tipo** → Verifica se é TRIAL ou COMPRA
8. **Preparar Trial** → Calcula datas para trial (se tipo = TRIAL)
9. **Preparar Compra** → Calcula datas para compra (se tipo = MONTHLY/ANNUAL/LIFETIME)
10. **Criar Trial** → Insere na tabela `user_trials` (se tipo = TRIAL)
11. **Criar Compra** → Insere na tabela `user_purchases` (se tipo = COMPRA)
12. **Sucesso** → Retorna resultado da operação

---

## ⚙️ Configuração dos Nodes

### **Node "Coletar Dados"**

Coleta os dados de entrada. Você pode modificar para usar um formulário webhook ou outros métodos de entrada.

**Campos:**
- `email`: Email do usuário
- `app_id`: ID ou nome do app
- `tipo`: Tipo de acesso (TRIAL, MONTHLY, ANNUAL, LIFETIME)
- `dias`: Duração em dias (opcional)

---

### **Node "Buscar Usuário"**

Busca o usuário na tabela `profiles` por email.

**Retorna (array):**
- `id`: ID do usuário
- `email`: Email do usuário
- `full_name`: Nome completo

---

### **Node "Mesclar Usuário"**

Mescla os dados do usuário com os dados anteriores. Extrai o primeiro item do array retornado pela busca.

**Adiciona aos dados:**
- `user_id`: ID do usuário
- `user_email`: Email do usuário
- `user_name`: Nome completo do usuário

---

### **Node "Buscar App"**

Busca o app na tabela `registered_apps` por ID ou nome.

**Retorna (array):**
- `id`: ID do app
- `name`: Nome do app
- `is_active`: Se o app está ativo
- `trial_period_days`: Período padrão de trial (se configurado)

---

### **Node "Mesclar App"**

Mescla os dados do app com os dados anteriores. Extrai o primeiro item do array retornado pela busca.

**Adiciona aos dados:**
- `app_id`: ID do app (substitui o app_id original)
- `app_name`: Nome do app
- `app_is_active`: Se o app está ativo
- `app_trial_period_days`: Período padrão de trial

---

### **Node "Verificar Tipo"**

Verifica se o tipo é `TRIAL`:
- **Se SIM** → Vai para "Preparar Trial"
- **Se NÃO** → Vai para "Preparar Compra"

---

### **Node "Preparar Trial"**

Calcula as datas para o trial:
- `started_at`: Data atual
- `expires_at`: Data atual + dias (ou padrão do app, ou 7 dias)
- `is_active`: `true`

---

### **Node "Preparar Compra"**

Calcula as datas para a compra:
- **LIFETIME**: `expires_at` = `2099-01-01` (não expira)
- **MONTHLY**: `expires_at` = Data atual + 1 mês (ou dias personalizados)
- **ANNUAL**: `expires_at` = Data atual + 1 ano (ou dias personalizados)
- `purchase_type`: Tipo da compra
- `status`: `APPROVED`

---

### **Node "Criar Trial"**

Insere o trial na tabela `user_trials` do Supabase.

**Campos inseridos:**
- `user_id`
- `app_id`
- `started_at`
- `expires_at`
- `is_active`

---

### **Node "Criar Compra"**

Insere a compra na tabela `user_purchases` do Supabase.

**Campos inseridos:**
- `user_id`
- `app_id`
- `purchase_type`
- `status`
- `expires_at`
- `created_at`

---

## ✅ Resultado

Após a execução, o workflow retorna:
- **Status**: ✅ Liberação criada com sucesso!
- **Detalhes**: JSON com os dados criados

**O usuário será liberado automaticamente** pelos triggers do Supabase que atualizam `is_liberado` e `data_vencimento` na tabela `profiles`.

---

## 🔧 Personalização

### **Adicionar Validações**

Você pode adicionar nodes de validação antes de criar o trial/compra:
- Verificar se usuário existe
- Verificar se app existe
- Verificar se já tem trial/compra ativo

### **Adicionar Notificações**

Você pode adicionar nodes para enviar notificações:
- Email para o usuário
- Slack/Discord
- Webhook personalizado

### **Usar Webhook em vez de Manual Trigger**

Para usar via API, substitua o "Manual Trigger" por um "Webhook" node.

---

## 📝 Notas

- O workflow usa **Service Role Key** para ter acesso total ao Supabase
- Os triggers do Supabase atualizam automaticamente `is_liberado` e `data_vencimento`
- Você pode usar **ID do app** (UUID) ou **nome do app** (busca parcial)
- Se não especificar `dias`, usa valores padrão:
  - **TRIAL**: Usa `trial_period_days` do app ou 7 dias
  - **MONTHLY**: 1 mês
  - **ANNUAL**: 1 ano
  - **LIFETIME**: Não expira

---

**Pronto para usar!** 🚀
