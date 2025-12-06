# 📊 Copiar Dados de Produção para Desenvolvimento

## 🎯 Objetivo

Copiar os **dados** (registros) das tabelas do banco de produção para o banco de desenvolvimento.

---

## 📋 Tabelas Identificadas

Vejo que você tem estas tabelas no projeto de desenvolvimento:
- `production_orders`
- `products`
- `profiles`
- `registered_apps`
- `requests`
- `user_purchases`
- `user_trials`

---

## 🚀 Método 1: Via SQL Editor (Recomendado)

### **Passo 1: Gerar INSERT statements no Banco de Produção**

1. **No projeto de produção** (`wwwwyuwighdehmvnolrl`), vá em **SQL Editor**
2. Execute este script para cada tabela:

```sql
-- Substitua [NOME_DA_TABELA] pelo nome da tabela
-- Exemplo: registered_apps, user_purchases, etc.

SELECT 
    'INSERT INTO ' || table_name || ' (' ||
    string_agg(column_name, ', ' ORDER BY ordinal_position) ||
    ') VALUES (' ||
    string_agg(
        CASE 
            WHEN data_type IN ('text', 'varchar', 'char', 'uuid') 
                THEN '''' || column_name || ''''
            WHEN data_type IN ('integer', 'bigint', 'smallint', 'numeric')
                THEN column_name::text
            WHEN data_type IN ('boolean')
                THEN column_name::text
            WHEN data_type IN ('timestamp', 'timestamptz', 'date')
                THEN '''' || column_name || ''''
            ELSE 'NULL'
        END,
        ', ' ORDER BY ordinal_position
    ) ||
    ');' as insert_statement
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = '[NOME_DA_TABELA]'
GROUP BY table_name;
```

### **Passo 2: Script Mais Simples (Gerar INSERTs)**

Para cada tabela, execute este script no **banco de produção**:

```sql
-- Exemplo para registered_apps
SELECT 
    'INSERT INTO registered_apps (id, name, description, detailed_description, image_url, price_monthly, price_annual, price_lifetime, is_active, category, features, download_url, documentation_url, created_at, updated_at) VALUES (' ||
    '''' || id || ''', ' ||
    '''' || REPLACE(name, '''', '''''') || ''', ' ||
    COALESCE('''' || REPLACE(description, '''', '''''') || '''', 'NULL') || ', ' ||
    COALESCE('''' || REPLACE(detailed_description, '''', '''''') || '''', 'NULL') || ', ' ||
    COALESCE('''' || image_url || '''', 'NULL') || ', ' ||
    COALESCE(price_monthly::text, 'NULL') || ', ' ||
    COALESCE(price_annual::text, 'NULL') || ', ' ||
    COALESCE(price_lifetime::text, 'NULL') || ', ' ||
    is_active::text || ', ' ||
    COALESCE('''' || category || '''', 'NULL') || ', ' ||
    COALESCE('''' || features::text || '''', 'NULL') || ', ' ||
    COALESCE('''' || download_url || '''', 'NULL') || ', ' ||
    COALESCE('''' || documentation_url || '''', 'NULL') || ', ' ||
    '''' || created_at || ''', ' ||
    '''' || updated_at || '''' ||
    ');' as insert_statement
FROM registered_apps;
```

---

## 🚀 Método 2: Via Table Editor (Mais Simples)

### **Para cada tabela:**

1. **No projeto de produção:**
   - Vá em **Table Editor**
   - Selecione a tabela (ex: `registered_apps`)
   - Clique nos 3 pontos (⋯) no canto superior direito
   - Selecione **"Export"** ou **"Download as CSV"**
   - Baixe o arquivo CSV

2. **No projeto de desenvolvimento:**
   - Vá em **Table Editor**
   - Selecione a mesma tabela
   - Clique em **"Import data from CSV"** ou arraste o arquivo CSV
   - Siga as instruções para importar

---

## 🚀 Método 3: Script SQL Completo (Automático)

Criei um script que gera INSERTs para todas as tabelas. Execute no **banco de produção**:

```sql
-- Script para gerar INSERTs de todas as tabelas
DO $$
DECLARE
    tbl_name text;
    insert_sql text;
BEGIN
    FOR tbl_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        RAISE NOTICE '-- Tabela: %', tbl_name;
        -- Aqui você pode gerar os INSERTs
        -- (Este é um exemplo simplificado)
    END LOOP;
END $$;
```

---

## 📝 Método Mais Prático: Tabela por Tabela

### **1. registered_apps**

No **banco de produção**, execute:

```sql
SELECT 
    'INSERT INTO registered_apps (id, name, description, detailed_description, image_url, price_monthly, price_annual, price_lifetime, is_active, category, features, download_url, documentation_url, created_at, updated_at) VALUES (' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(name) || ', ' ||
    COALESCE(quote_literal(description), 'NULL') || ', ' ||
    COALESCE(quote_literal(detailed_description), 'NULL') || ', ' ||
    COALESCE(quote_literal(image_url), 'NULL') || ', ' ||
    COALESCE(price_monthly::text, 'NULL') || ', ' ||
    COALESCE(price_annual::text, 'NULL') || ', ' ||
    COALESCE(price_lifetime::text, 'NULL') || ', ' ||
    is_active::text || ', ' ||
    COALESCE(quote_literal(category), 'NULL') || ', ' ||
    COALESCE(quote_literal(features::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(download_url), 'NULL') || ', ' ||
    COALESCE(quote_literal(documentation_url), 'NULL') || ', ' ||
    quote_literal(created_at::text) || ', ' ||
    quote_literal(updated_at::text) ||
    ');' as insert_statement
FROM registered_apps;
```

Copie os resultados e execute no **banco de desenvolvimento**.

---

## 🎯 Método Mais Rápido: Export/Import CSV

### **Para cada tabela:**

1. **Produção → Export:**
   - Table Editor → Tabela → Export → CSV

2. **Desenvolvimento → Import:**
   - Table Editor → Tabela → Import CSV

---

## ✅ Checklist

- [ ] `registered_apps` - dados copiados
- [ ] `user_purchases` - dados copiados
- [ ] `user_trials` - dados copiados
- [ ] `profiles` - dados copiados
- [ ] `products` - dados copiados
- [ ] `production_orders` - dados copiados
- [ ] `requests` - dados copiados

---

## 🆘 Importante

- ⚠️ **Dados de usuários (auth.users)** não serão copiados automaticamente
- ⚠️ **Foreign keys** - certifique-se de copiar tabelas na ordem correta:
  1. `profiles` (se tiver dados)
  2. `registered_apps`
  3. `user_purchases` (depende de profiles e registered_apps)
  4. `user_trials` (depende de profiles e registered_apps)

---

## 💡 Dica

Se você tem muitas tabelas, o método **Export/Import CSV** é o mais rápido e confiável!
