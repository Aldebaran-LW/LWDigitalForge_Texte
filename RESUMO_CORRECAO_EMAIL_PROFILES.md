# 🔧 Correção: Email Não Existe em Profiles

## Problema Identificado

A tabela `profiles` **NÃO tem a coluna `email`**. O email está apenas em `auth.users`.

**Schema atual de profiles:**
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'USER'::text,
  ...
);
```

## ✅ Correções Aplicadas

### 1. Código AdminUsuarios.jsx
- ✅ Removido `email` da query de `profiles`
- ✅ Adicionada busca de emails via função RPC `get_user_emails`
- ✅ Fallback para "Email não disponível" se função não existir

### 2. Script SQL para Buscar Emails
- ✅ Criado `FUNCAO_BUSCAR_EMAILS_USUARIOS.sql`
- ✅ Função RPC `get_user_emails` que retorna emails de `auth.users`

### 3. Script para Conceder ADMIN
- ✅ Criado `CONCEDER_ADMIN_SIMPLES.sql` que não depende de email em profiles

---

## 🚀 Como Aplicar

### Passo 1: Criar Função para Buscar Emails

1. Abra Supabase Dashboard → SQL Editor
2. Abra arquivo: `FUNCAO_BUSCAR_EMAILS_USUARIOS.sql`
3. Copie e execute

Isso criará a função `get_user_emails` que permite buscar emails de `auth.users`.

### Passo 2: Conceder ADMIN (se necessário)

1. Abra arquivo: `CONCEDER_ADMIN_SIMPLES.sql`
2. Copie e execute no Supabase SQL Editor

### Passo 3: Testar

1. Fazer logout
2. Fazer login novamente
3. Acessar `/admin/usuarios`
4. Emails devem aparecer agora

---

## 📋 Estrutura Corrigida

### Antes (ERRADO):
```javascript
.select('id, email, full_name, phone, role') // ❌ email não existe
```

### Depois (CORRETO):
```javascript
.select('id, full_name, phone, role') // ✅ sem email
// Buscar emails separadamente via RPC
const { data: emailsData } = await supabase.rpc('get_user_emails', {
  user_ids: userIds
});
```

---

## ⚠️ Se Emails Não Aparecerem

1. **Verificar se função foi criada:**
```sql
SELECT proname FROM pg_proc WHERE proname = 'get_user_emails';
```

2. **Se não existir:** Execute `FUNCAO_BUSCAR_EMAILS_USUARIOS.sql`

3. **Verificar permissões:** A função usa `SECURITY DEFINER`, então deve funcionar

---

## 📝 Notas Importantes

- A tabela `profiles` não tem coluna `email` por design
- Email está em `auth.users` (tabela do Supabase Auth)
- Para acessar emails, precisamos usar função RPC ou admin API
- A função RPC é a solução mais simples e segura

---

**Última atualização:** 2025-01-10  
**Status:** Código corrigido, aguardando aplicação da função RPC



