# 📦 Migração JornadaPro para MongoDB

## 📋 Status

As tabelas do sistema JornadaPro foram **migradas para MongoDB** e serão **excluídas do Supabase** após confirmação.

---

## 🗂️ Tabelas Migradas (Supabase → MongoDB)

### **Tabelas que serão removidas:**

1. `Apontamentos_Fabrica` - Apontamentos para equipe de fábrica
2. `Apontamentos_Viagem` - Apontamentos para equipe de viagem
3. `Empresas` - Empresas cadastradas
4. `Funcionarios` - Funcionários (Fábrica/Viagem)
5. `Feriados` - Feriados das empresas
6. `Relatorios_Mensais` - Relatórios mensais
7. `Logs_Erros` - Logs de erros

---

## ✅ Checklist de Verificação

Antes de excluir as tabelas, verificar:

### **1. Funcionalidades Migradas**

- [ ] ✅ Apontamentos de Fábrica funcionando no MongoDB
- [ ] ✅ Apontamentos de Viagem funcionando no MongoDB
- [ ] ✅ Cadastro de Empresas funcionando no MongoDB
- [ ] ✅ Cadastro de Funcionários funcionando no MongoDB
- [ ] ✅ Feriados funcionando no MongoDB
- [ ] ✅ Relatórios Mensais funcionando no MongoDB
- [ ] ✅ Logs de Erros funcionando no MongoDB

### **2. Dados Migrados**

- [ ] ✅ Todos os dados foram migrados
- [ ] ✅ Verificar contagem de registros (Supabase vs MongoDB)
- [ ] ✅ Testar consultas importantes
- [ ] ✅ Verificar integridade dos dados

### **3. Aplicação Funcionando**

- [ ] ✅ Aplicação JornadaPro acessando MongoDB corretamente
- [ ] ✅ Todas as funcionalidades testadas
- [ ] ✅ Sem erros relacionados ao acesso ao banco
- [ ] ✅ Performance adequada

### **4. Backup Criado**

- [ ] ✅ Backup das tabelas antes de excluir
- [ ] ✅ Backup disponível para recuperação se necessário

---

## 🔍 Verificação de Dados (Antes de Excluir)

### **SQL para Verificar Dados no Supabase:**

```sql
-- Verificar contagem de registros em cada tabela
SELECT 'Apontamentos_Fabrica' AS tabela, COUNT(*) AS total FROM Apontamentos_Fabrica
UNION ALL
SELECT 'Apontamentos_Viagem', COUNT(*) FROM Apontamentos_Viagem
UNION ALL
SELECT 'Empresas', COUNT(*) FROM Empresas
UNION ALL
SELECT 'Funcionarios', COUNT(*) FROM Funcionarios
UNION ALL
SELECT 'Feriados', COUNT(*) FROM Feriados
UNION ALL
SELECT 'Relatorios_Mensais', COUNT(*) FROM Relatorios_Mensais
UNION ALL
SELECT 'Logs_Erros', COUNT(*) FROM Logs_Erros;
```

### **Verificar no MongoDB:**

- Comparar contagens com as do Supabase
- Verificar se todos os dados foram migrados
- Testar queries importantes

---

## 📝 Processo de Remoção (Após Confirmação)

### **PASSO 1: Criar Backup**

Antes de excluir, criar backup das tabelas:

```sql
-- Exportar dados para CSV (se necessário)
-- Fazer backup completo do banco (via Supabase Dashboard)
```

### **PASSO 2: Verificar Dependências**

Verificar se há outras tabelas ou funções que dependem dessas tabelas:

```sql
-- Verificar foreign keys
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (ccu.table_name IN ('Apontamentos_Fabrica', 'Apontamentos_Viagem', 'Empresas', 'Funcionarios', 'Feriados', 'Relatorios_Mensais', 'Logs_Erros')
       OR tc.table_name IN ('Apontamentos_Fabrica', 'Apontamentos_Viagem', 'Empresas', 'Funcionarios', 'Feriados', 'Relatorios_Mensais', 'Logs_Erros'));
```

### **PASSO 3: Excluir Tabelas**

**⚠️ ATENÇÃO:** Execute apenas após confirmar que tudo está funcionando no MongoDB!

```sql
-- ORDEM IMPORTANTE: Excluir primeiro as tabelas dependentes
DROP TABLE IF EXISTS public.Logs_Erros CASCADE;
DROP TABLE IF EXISTS public.Relatorios_Mensais CASCADE;
DROP TABLE IF EXISTS public.Apontamentos_Fabrica CASCADE;
DROP TABLE IF EXISTS public.Apontamentos_Viagem CASCADE;
DROP TABLE IF EXISTS public.Feriados CASCADE;
DROP TABLE IF EXISTS public.Funcionarios CASCADE;
DROP TABLE IF EXISTS public.Empresas CASCADE;
```

---

## 🎯 Próximos Passos

1. ✅ Migração realizada
2. ⏭️ **Verificar se tudo está funcionando no MongoDB**
3. ⏭️ **Criar backup das tabelas**
4. ⏭️ **Testar aplicação completamente**
5. ⏭️ **Após confirmação: Excluir tabelas do Supabase**

---

## 📋 Checklist Final Antes de Excluir

- [ ] ✅ Todos os dados migrados para MongoDB
- [ ] ✅ Aplicação funcionando corretamente com MongoDB
- [ ] ✅ Backup das tabelas criado
- [ ] ✅ Testes completos realizados
- [ ] ✅ Sem dependências quebradas
- [ ] ✅ Confirmação de que está tudo funcionando

---

## ⚠️ Importante

**NÃO EXCLUIR as tabelas até:**
1. ✅ Confirmar que tudo está funcionando no MongoDB
2. ✅ Criar backup completo
3. ✅ Testar todas as funcionalidades
4. ✅ Ter confiança de que a migração foi bem-sucedida

---

## 🔗 Arquitetura Atual

### **Antes (Supabase):**
```
JornadaPro → Supabase (PostgreSQL)
  - Apontamentos_Fabrica
  - Apontamentos_Viagem
  - Empresas
  - Funcionarios
  - Feriados
  - Relatorios_Mensais
  - Logs_Erros
```

### **Depois (MongoDB):**
```
JornadaPro → MongoDB Atlas
  - Collections equivalentes às tabelas
  - Mesma funcionalidade
  - Dados migrados
```

---

## ✅ Status Atual

- ✅ Migração realizada
- ⏭️ Aguardando confirmação e testes
- ⏭️ Preparação para remoção das tabelas
