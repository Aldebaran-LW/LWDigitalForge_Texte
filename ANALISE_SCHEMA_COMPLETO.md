# 📊 Análise do Schema Completo do Banco de Dados

## 📋 Visão Geral

Schema completo do banco de dados Supabase com todas as tabelas.

---

## 🗂️ Tabelas Identificadas

### **1. Tabelas do JornadaPro (Sistema de Ponto)**

- `Apontamentos_Fabrica` - Apontamentos de ponto para equipe de fábrica
- `Apontamentos_Viagem` - Apontamentos de ponto para equipe de viagem
- `Empresas` - Empresas cadastradas
- `Feriados` - Feriados das empresas
- `Funcionarios` - Funcionários das empresas
- `Logs_Erros` - Logs de erros do sistema
- `Relatorios_Mensais` - Relatórios mensais de apontamentos

### **2. Tabelas do Portal Central (LW Digital Forge)**

- `profiles` - Perfis de usuários (✅ com `is_liberado` e `data_vencimento`)
- `registered_apps` - Apps registrados no portal
- `user_purchases` - Compras/assinaturas dos usuários (✅ com LIFETIME corrigido)
- `user_trials` - Trials dos usuários
- `user_product_access` - Acesso dos usuários aos produtos
- `contact_messages` - Mensagens de contato
- `sales` - Vendas/transações
- `products` - Produtos (tabela legada?)
- `product_types` - Tipos de produtos

### **3. Tabelas Legadas/Outras**

- `produtos` - Produtos (estoque?)
- `lancamentos` - Lançamentos de produtos

---

## ✅ Observações Importantes

### **1. Tabela `profiles`**

✅ **Atualizada:**
- `is_liberado` (BOOLEAN) - Coluna adicionada
- `data_vencimento` (TIMESTAMP) - Coluna adicionada

### **2. Tabela `user_purchases`**

✅ **Corrigida:**
- Compras LIFETIME agora têm `expires_at = NULL`
- Estrutura correta para verificação de acesso

### **3. Tabela `user_trials`**

✅ **Funcionando:**
- Estrutura correta para trials
- RLS policies aplicadas

### **4. Tabela `registered_apps`**

✅ **Configurada:**
- Campo `is_active` para ativar/desativar apps
- Campo `slug` para URLs amigáveis

---

## 🔍 Relações Identificadas

### **JornadaPro:**
- `Empresas` → `owner_id` → `auth.users(id)`
- `Apontamentos_Fabrica` → `empresa_id` → `Empresas(id)`
- `Apontamentos_Fabrica` → `funcionario_id` → `Funcionarios(id)`
- `Funcionarios` → `empresa_id` → `Empresas(id)`
- `Feriados` → `empresa_id` → `Empresas(id)`

### **Portal Central:**
- `profiles` → `id` → `auth.users(id)`
- `user_purchases` → `user_id` → `auth.users(id)`
- `user_purchases` → `app_id` → `registered_apps(id)`
- `user_trials` → `user_id` → `auth.users(id)`
- `user_trials` → `app_id` → `registered_apps(id)`
- `user_product_access` → `user_id` → `auth.users(id)`
- `user_product_access` → `product_id` → `registered_apps(id)`

---

## ⚠️ Pontos de Atenção

### **1. Tabelas Duplicadas/Conflitantes**

**`products` vs `registered_apps`:**
- `products` parece ser legado
- `registered_apps` é a tabela atual
- Verificar se `products` ainda está em uso

### **2. Tabela `user_product_access`**

Esta tabela parece ser legada ou não utilizada:
- Há também `user_purchases` e `user_trials`
- Verificar se `user_product_access` ainda é necessária

### **3. Tabela `sales`**

- Referencia `products(id)` (tabela legada?)
- Pode precisar atualizar para referenciar `registered_apps(id)`

---

## ✅ Status das Correções Aplicadas

### **Compras LIFETIME:**
- ✅ `expires_at = NULL` para todas as compras LIFETIME
- ✅ Código do AdminUsuarios.jsx cria corretamente

### **Colunas em `profiles`:**
- ✅ `is_liberado` adicionado
- ✅ `data_vencimento` adicionado
- ✅ Triggers criados para atualização automática

### **RLS Policies:**
- ✅ `user_purchases` - INSERT para admins
- ✅ `user_trials` - INSERT/SELECT para usuários e admins

---

## 📝 Sugestões de Melhorias (Opcional)

### **1. Índices para Performance**

```sql
-- Índices para user_purchases (queries frequentes)
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_app 
ON user_purchases(user_id, app_id);

CREATE INDEX IF NOT EXISTS idx_user_purchases_status 
ON user_purchases(status);

-- Índices para user_trials
CREATE INDEX IF NOT EXISTS idx_user_trials_user_app 
ON user_trials(user_id, app_id);

CREATE INDEX IF NOT EXISTS idx_user_trials_active 
ON user_trials(is_active, expires_at);
```

### **2. Constraints Adicionais**

- Verificar se há necessidade de constraints UNIQUE em combinações específicas
- Verificar se há necessidade de triggers para `updated_at`

---

## 🎯 Conclusão

O schema está bem estruturado e as correções aplicadas estão funcionando corretamente:

- ✅ Tabelas do JornadaPro bem definidas
- ✅ Tabelas do Portal Central atualizadas
- ✅ Relações corretas entre tabelas
- ✅ Correções aplicadas (LIFETIME, is_liberado, data_vencimento)
- ✅ RLS policies configuradas

**Status:** Schema funcional e pronto para uso! 🚀
