# 📋 Guia: Colunas is_liberado e data_vencimento

## 🎯 Objetivo

Adicionar 2 colunas na tabela `profiles`:
1. **`is_liberado`** (BOOLEAN) - Indica se o usuário está liberado
2. **`data_vencimento`** (TIMESTAMP) - Data de vencimento da assinatura/trial

---

## 📊 Lógica das 3 Condições

O usuário está **liberado** (`is_liberado = true`) se **QUALQUER UMA** das condições for verdadeira:

### **CONDIÇÃO 1: Compra Vitalícia (LIFETIME)**
- `user_purchases` com `purchase_type = 'LIFETIME'` e `status = 'APPROVED'`
- **data_vencimento:** `2099-01-01 00:00:00+00`

### **CONDIÇÃO 2: Assinatura Ativa (MONTHLY/ANNUAL)**
- `user_purchases` com `purchase_type IN ('MONTHLY', 'ANNUAL')` e `status = 'APPROVED'` e `expires_at > NOW()`
- **data_vencimento:** `expires_at` da assinatura

### **CONDIÇÃO 3: Trial Ativo**
- `user_trials` com `is_active = true` e `expires_at > NOW()`
- **data_vencimento:** `expires_at` do trial

---

## 📁 Arquivos Criados

### 1. **Migration SQL (para Supabase CLI)**
- **Arquivo:** `supabase/migrations/20250112000001_add_liberado_columns_profiles.sql`
- **Uso:** Para usar com `supabase db push`

### 2. **SQL para Executar Manualmente**
- **Arquivo:** `SQL_ADICIONAR_COLUNAS_LIBERADO.sql`
- **Uso:** Copiar e colar no SQL Editor do Supabase

---

## 🔧 Como Usar

### **PASSO 1: Executar SQL no Supabase**

1. Acesse o **Supabase Dashboard** → **SQL Editor**
2. Abra o arquivo `SQL_ADICIONAR_COLUNAS_LIBERADO.sql`
3. Copie e cole o conteúdo (⚠️ SEM os blocos markdown)
4. Clique em **Run**
5. Verifique se não há erros

### **PASSO 2: Verificar se Funcionou**

Execute estas queries para verificar:

```sql
-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('is_liberado', 'data_vencimento');

-- Ver usuários com as novas colunas
SELECT id, email, is_liberado, data_vencimento
FROM public.profiles
LIMIT 5;
```

---

## ⚙️ Funcionalidades

### **1. Colunas Adicionadas**

- `is_liberado` (BOOLEAN, DEFAULT false)
- `data_vencimento` (TIMESTAMP WITH TIME ZONE, NULLABLE)

### **2. Funções Criadas**

#### `calculate_user_liberado_status(user_id)`
- Calcula `is_liberado` e `data_vencimento` para um usuário
- Retorna os valores baseados nas 3 condições

#### `update_user_liberado_status(user_id)`
- Atualiza as colunas `is_liberado` e `data_vencimento` de um usuário específico

#### `update_all_users_liberado_status()`
- Atualiza todos os usuários (útil para inicialização)

### **3. Triggers Criados**

- **Trigger em `user_purchases`:** Atualiza automaticamente quando há INSERT/UPDATE/DELETE
- **Trigger em `user_trials`:** Atualiza automaticamente quando há INSERT/UPDATE/DELETE

**Resultado:** As colunas são atualizadas automaticamente sempre que houver mudanças em compras ou trials!

---

## 📊 Estrutura das Colunas

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `is_liberado` | BOOLEAN | NOT NULL | `false` | Indica se o usuário está liberado |
| `data_vencimento` | TIMESTAMP WITH TIME ZONE | NULL | `NULL` | Data de vencimento (2099-01-01 para vitalício) |

---

## 🔍 Exemplos de Uso

### **Verificar usuários liberados:**

```sql
SELECT id, email, is_liberado, data_vencimento
FROM public.profiles
WHERE is_liberado = true;
```

### **Verificar usuários com vencimento próximo:**

```sql
SELECT id, email, data_vencimento
FROM public.profiles
WHERE is_liberado = true
  AND data_vencimento < NOW() + INTERVAL '30 days';
```

### **Atualizar manualmente um usuário específico:**

```sql
SELECT public.update_user_liberado_status('[ID_DO_USUARIO]'::UUID);
```

### **Atualizar todos os usuários (se necessário):**

```sql
SELECT public.update_all_users_liberado_status();
```

---

## ⚠️ Notas Importantes

1. **Prioridade das Condições:**
   - **Vitalício** tem prioridade absoluta (sempre `is_liberado = true`, data = 2099-01-01)
   - **Assinatura ativa** tem prioridade sobre trial
   - **Trial** é verificado por último

2. **Atualização Automática:**
   - Os triggers atualizam automaticamente quando há mudanças
   - Não é necessário atualizar manualmente

3. **Inicialização:**
   - O SQL executa `update_all_users_liberado_status()` automaticamente
   - Isso atualiza todos os usuários existentes

4. **Performance:**
   - As colunas são atualizadas automaticamente
   - Não precisa calcular em tempo de execução
   - Queries são mais rápidas

---

## ✅ Checklist

- [ ] SQL executado no Supabase SQL Editor
- [ ] Colunas verificadas (query de verificação)
- [ ] Dados dos usuários verificados (query SELECT)
- [ ] Testar criação de compra/trial (verificar se atualiza automaticamente)
- [ ] Testar remoção de compra/trial (verificar se atualiza automaticamente)

---

## 🧪 Testes

### **Teste 1: Criar compra vitalícia**

1. Crie uma compra LIFETIME para um usuário
2. Verifique: `is_liberado` deve ser `true`, `data_vencimento` deve ser `2099-01-01`

### **Teste 2: Criar trial**

1. Crie um trial para um usuário
2. Verifique: `is_liberado` deve ser `true`, `data_vencimento` deve ser a data de expiração do trial

### **Teste 3: Remover trial**

1. Desative ou remova um trial
2. Verifique: Se não houver outras condições, `is_liberado` deve ser `false`

---

## 🚀 Próximos Passos

1. Execute o SQL no Supabase
2. Verifique se as colunas foram criadas
3. Verifique se os dados foram atualizados
4. Teste criando/removendo compras/trials
5. Use as colunas no frontend/admin se desejar
