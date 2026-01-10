# Aplicar Migração: Fix Admin Email Access

## Problema
Os e-mails dos usuários não aparecem na área admin devido a políticas RLS que bloqueiam o acesso ao campo `email` na tabela `profiles`.

## Solução
A migração `20250110000000_fix_admin_email_access.sql` corrige as políticas RLS para permitir que admins vejam todos os campos, incluindo e-mails.

## Como Aplicar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo:
   ```
   supabase/migrations/20250110000000_fix_admin_email_access.sql
   ```
6. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Opção 2: Via Supabase CLI

Se você tiver o Supabase CLI configurado:

```bash
# Aplicar a migração
supabase db push

# Ou aplicar diretamente
supabase migration up
```

### Opção 3: Via MCP Supabase (Se configurado)

Se o MCP Supabase estiver configurado com o token de acesso:

1. Configure o token conforme `CONFIGURAR_MCP_SUPABASE.md`
2. A migração será aplicada automaticamente quando o MCP estiver funcionando

## Verificação

Após aplicar a migração:

1. Acesse a área admin do seu aplicativo
2. Vá em "Gerenciar Usuários"
3. Verifique se os e-mails aparecem na tabela de usuários

## Conteúdo da Migração

A migração:
- ✅ Corrige a função `is_admin()` para evitar recursão
- ✅ Recria as políticas RLS para permitir acesso completo aos admins
- ✅ Garante que admins vejam todos os campos, incluindo `email`
- ✅ Mantém a segurança: usuários normais só veem seus próprios perfis

## Arquivo da Migração

Localização: `supabase/migrations/20250110000000_fix_admin_email_access.sql`









