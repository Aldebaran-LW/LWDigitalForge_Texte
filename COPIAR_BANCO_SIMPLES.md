# 📋 Copiar Banco - Método Mais Simples

## 🎯 Método Recomendado: Via SQL Editor

Este é o método mais simples e não requer CLI.

---

## 📝 Passo 1: Aplicar Migration no Projeto de Desenvolvimento

Como você já tem o arquivo de migration, vamos usá-lo:

1. **No projeto de desenvolvimento** (`vedrmtowoosqxzqxgxpb`):
   - Acesse: https://supabase.com/dashboard/project/vedrmtowoosqxzqxgxpb
   - Vá em **SQL Editor**
   - Clique em **"New query"**

2. **Abra o arquivo de migration:**
   - Abra: `supabase/migrations/20250101000000_initial_schema.sql`
   - Copie **TODO** o conteúdo

3. **Cole e execute:**
   - Cole no SQL Editor do projeto de desenvolvimento
   - Clique em **"Run"** ou pressione `Ctrl+Enter`

Isso criará toda a estrutura (tabelas, índices, RLS, etc.).

---

## 📝 Passo 2: Copiar Dados (Opcional)

Se você quiser copiar os dados também:

### **Opção A: Via SQL Editor (Manual)**

1. **No projeto de produção**, vá em **Table Editor**
2. Para cada tabela:
   - Selecione todos os registros
   - Exporte como SQL ou CSV
   - No projeto de desenvolvimento, importe os dados

### **Opção B: Via SQL (INSERT statements)**

1. **No projeto de produção**, vá em **SQL Editor**
2. Execute queries para gerar INSERT statements:

```sql
-- Exemplo para copiar dados de uma tabela
SELECT 'INSERT INTO ' || table_name || ' VALUES (' || 
       -- ... valores ...
       ');'
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🚀 Método Alternativo: Via Supabase CLI

Se você tem o Supabase CLI instalado e logado:

```bash
# 1. Linkar ao projeto de produção
supabase link --project-ref wwwwwyuwighdehmvnolrl

# 2. Fazer dump
supabase db dump > dump_producao.sql

# 3. Linkar ao projeto de desenvolvimento
supabase link --project-ref vedrmtowoosqxzqxgxpb

# 4. Restaurar
supabase db reset --file dump_producao.sql
```

---

## ✅ Checklist

- [ ] Migration aplicada no projeto de desenvolvimento
- [ ] Estrutura criada (tabelas, índices, etc.)
- [ ] Dados copiados (se necessário)
- [ ] Verificar se tudo funcionou

---

## 🎯 Próximo Passo

Após copiar a estrutura, você pode:
1. ✅ Configurar os secrets no GitHub
2. ✅ Testar o deploy
3. ✅ Copiar dados se necessário
