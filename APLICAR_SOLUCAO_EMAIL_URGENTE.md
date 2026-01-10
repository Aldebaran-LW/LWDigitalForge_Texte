# 🚨 URGENTE: Erro "column profiles.email does not exist"

## ❌ Erro Atual
```
Erro: column profiles.email does not exist
```

## ✅ Solução Imediata

### Passo 1: Executar Script SQL (OBRIGATÓRIO)

1. **Abra Supabase Dashboard**
   - Acesse: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra SQL Editor**
   - Clique em "SQL Editor" no menu lateral
   - Clique em "New query"

3. **Execute o Script**
   - Abra arquivo: `SOLUCAO_DIRETA_EMAILS.sql`
   - **Copie TODO o conteúdo**
   - **Cole no SQL Editor**
   - **Execute (Run ou Ctrl+Enter)**

### Passo 2: Verificar se Funcionou

Execute este SQL para verificar:

```sql
-- Verificar se coluna foi criada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'email';
```

**Resultado Esperado:** Deve retornar 1 linha com `column_name = 'email'`

### Passo 3: Verificar se Emails Foram Sincronizados

```sql
-- Verificar emails sincronizados
SELECT 
    id,
    email,
    full_name,
    role
FROM profiles 
LIMIT 5;
```

**Resultado Esperado:** Deve mostrar emails preenchidos

### Passo 4: Recarregar Página

1. Recarregue a página `/admin/usuarios` (F5)
2. Os emails devem aparecer agora

---

## 📋 O Que o Script Faz

1. ✅ Adiciona coluna `email` em `profiles`
2. ✅ Cria trigger para sincronizar automaticamente
3. ✅ Sincroniza todos os emails existentes de uma vez
4. ✅ Cria índice para melhor performance

---

## ⚠️ Se Ainda Der Erro

### Verificar se Script Foi Executado:

```sql
-- Verificar se coluna existe
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'email';
```

**Se não retornar nada:** O script não foi executado. Execute novamente.

### Sincronizar Emails Manualmente (se necessário):

```sql
-- Sincronizar emails manualmente
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id
  AND (p.email IS NULL OR p.email != au.email);
```

---

## 🔄 Após Executar

1. ✅ Coluna `email` criada em `profiles`
2. ✅ Emails sincronizados automaticamente
3. ✅ Trigger criado para manter sincronizado
4. ✅ Código pode buscar email diretamente de `profiles`

---

**IMPORTANTE:** Execute o script `SOLUCAO_DIRETA_EMAILS.sql` AGORA para resolver o erro!
