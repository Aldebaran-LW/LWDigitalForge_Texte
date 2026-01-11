# ✅ Aplicar Correção RLS - Passo a Passo

## 🎯 Objetivo

Corrigir as políticas RLS que estão impedindo:
1. ❌ Liberação manual pelo admin
2. ❌ Criação de trial pelos usuários

---

## 📋 Passo a Passo

### 1. Executar SQL no Supabase

1. **Acesse:** https://app.supabase.com/
2. **Selecione seu projeto:** `LW_Digital_Forge`
3. **SQL Editor** → **New Query**
4. **Copie TODO o conteúdo** de `CORRECAO_RLS_POLITICAS_CRITICAS.sql`
5. **Cole no editor** do Supabase
6. **Execute** (Run ou F5)

### 2. Verificar Resultados

Após executar, você verá:
- ✅ Mensagens de sucesso
- ✅ Lista de políticas criadas (2 queries SELECT no final)

**O que o SQL faz:**
- ✅ Cria/atualiza função `is_admin()` (sem parâmetros)
- ✅ Remove políticas antigas (se existirem)
- ✅ Cria política para Admins inserirem em `user_purchases`
- ✅ Cria política para usuários criarem trials
- ✅ Cria política para Admins gerenciarem trials
- ✅ Ativa RLS nas tabelas
- ✅ Mostra políticas criadas

---

## ✅ Verificação

### Verificar se funcionou:

1. **Testar Liberação Manual (Admin):**
   - Portal Admin → Gerenciar Usuários
   - Selecionar usuário → Gerenciar Licença
   - Selecionar produto → Vitalício → Salvar
   - ✅ Deve aparecer mensagem de sucesso (sem erro de permissão)

2. **Testar Trial (Usuário):**
   - Portal → Produtos → Selecionar produto
   - Testar Gratuitamente
   - ✅ Deve criar trial (sem erro de permissão)

---

## 🔍 Se Ainda Não Funcionar

### 1. Verificar Logs da Edge Function

1. **Functions** → **check-subscription** → **Logs**
2. Tente fazer login no app
3. Verifique se há erros

### 2. Verificar Políticas Criadas

Execute no SQL Editor:

```sql
-- Ver políticas de user_purchases
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_purchases'
ORDER BY policyname;

-- Ver políticas de user_trials
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_trials'
ORDER BY policyname;
```

### 3. Verificar se o Usuário é Admin

Execute no SQL Editor:

```sql
-- Verificar seu role
SELECT id, email, role
FROM public.profiles
WHERE id = auth.uid();
```

Deve retornar `role = 'ADMIN'`

---

## 📊 Checklist

- [ ] SQL executado no Supabase
- [ ] Políticas criadas com sucesso
- [ ] Testada liberação manual (Admin)
- [ ] Testada criação de trial (Usuário)
- [ ] Logs verificados (se necessário)
- [ ] Políticas verificadas (se necessário)

---

**Após executar o SQL, teste as funcionalidades!** ✅
