# ⚠️ IMPORTANTE: Como Copiar o SQL Corretamente

## ❌ ERRADO - NÃO FAÇA ISSO:
```
supabase/migrations/20250107000000_fix_rls_recursion.sql
```
**Isso é o CAMINHO do arquivo, não o conteúdo SQL!**

## ✅ CORRETO - FAÇA ISSO:

### Opção 1: Abrir o arquivo SQL_PARA_COPIAR.sql
1. No VS Code/Cursor, abra o arquivo `SQL_PARA_COPIAR.sql` na raiz do projeto
2. Selecione TODO o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)
4. Cole no SQL Editor do Supabase Dashboard (Ctrl+V)

### Opção 2: Copiar do arquivo de migration
1. Abra: `supabase/migrations/20250107000000_fix_rls_recursion.sql`
2. Selecione TODO o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)
4. Cole no SQL Editor do Supabase Dashboard (Ctrl+V)

## 📋 O que você deve colar no SQL Editor:

O conteúdo SQL deve começar com:
```sql
-- ========================================
-- FIX: Corrigir recursão infinita nas políticas RLS
```

E terminar com:
```sql
    );
```

**NÃO cole:**
- O caminho do arquivo
- O nome do arquivo
- Nada que comece com "supabase/"

**COLE APENAS:**
- O código SQL completo (linhas que começam com `--`, `DROP`, `CREATE`, etc.)

## 🎯 Passo a Passo Visual:

1. **No VS Code/Cursor:**
   - Abra `SQL_PARA_COPIAR.sql`
   - Ctrl+A (selecionar tudo)
   - Ctrl+C (copiar)

2. **No Supabase Dashboard:**
   - Vá em SQL Editor
   - Clique em "New query"
   - Ctrl+V (colar)
   - Clique em "Run"

## ✅ Verificação:

Antes de executar, verifique que o que você colou:
- ✅ Começa com `--` (comentário)
- ✅ Tem comandos `DROP POLICY`
- ✅ Tem `CREATE OR REPLACE FUNCTION`
- ✅ Tem comandos `CREATE POLICY`
- ❌ NÃO tem "supabase/migrations" no início
- ❌ NÃO tem caminho de arquivo

