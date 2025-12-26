# 🔧 Como Aplicar a Migration de Correção RLS

## ⚠️ Erro Comum

Se você tentou executar `supabase db push` no SQL Editor do Supabase Dashboard, isso causará erro porque:
- `supabase db push` é um **comando CLI** (terminal), não SQL
- No SQL Editor, você deve executar apenas **código SQL**

## ✅ Solução: Aplicar via Supabase Dashboard

### Passo 1: Acessar o SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### Passo 2: Copiar e Colar o SQL

Copie **TODO o conteúdo** do arquivo abaixo e cole no SQL Editor:

```sql
-- ========================================
-- FIX: Corrigir recursão infinita nas políticas RLS
-- Migration criada em: 2025-01-07
-- ========================================

-- Remover políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem fazer tudo em apps" ON public.registered_apps;
DROP POLICY IF EXISTS "Admins podem ver todas as compras" ON public.user_purchases;

-- Criar função helper para verificar se usuário é admin (evita recursão)
-- SECURITY DEFINER permite que a função bypass RLS ao acessar profiles
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica diretamente na tabela profiles sem passar por RLS
  -- SECURITY DEFINER executa com privilégios do criador da função
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE profiles.id = user_id 
    AND profiles.role = 'ADMIN'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recriar política para admins verem todos os perfis (sem recursão)
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles FOR SELECT
    USING (
        public.is_admin(auth.uid())
    );

-- Recriar política para admins em registered_apps (sem recursão)
CREATE POLICY "Admins podem fazer tudo em apps"
    ON public.registered_apps FOR ALL
    USING (
        public.is_admin(auth.uid())
    );

-- Recriar política para admins em user_purchases (sem recursão)
CREATE POLICY "Admins podem ver todas as compras"
    ON public.user_purchases FOR SELECT
    USING (
        public.is_admin(auth.uid())
    );
```

### Passo 3: Executar

1. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
2. Aguarde a execução
3. Você deve ver: **"Success. No rows returned"**

### Passo 4: Verificar

Execute este teste no SQL Editor:

```sql
-- Testar se a função foi criada
SELECT public.is_admin('00000000-0000-0000-0000-000000000000'::UUID);

-- Verificar políticas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'registered_apps', 'user_purchases');
```

## 🔄 Alternativa: Via Supabase CLI (Terminal)

Se você tem o Supabase CLI instalado e configurado:

```bash
# No terminal (não no SQL Editor!)
supabase db push
```

**Requisitos:**
- Supabase CLI instalado: `npm install -g supabase`
- Projeto linkado: `supabase link --project-ref SEU_PROJECT_REF`
- Access token configurado

## ✅ Após Aplicar

Teste novamente:

```bash
npm run test:supabase
```

**Resultado esperado:**
- ✅ Conexão Básica
- ✅ Sistema de Autenticação  
- ✅ Tabelas do Banco
- ✅ Edge Functions

## 🆘 Se Ainda Der Erro

Se ainda aparecer erro de recursão, pode ser que a função `is_admin()` ainda esteja causando recursão. Nesse caso, use esta versão alternativa:

```sql
-- Versão alternativa usando auth.jwt() diretamente
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Tenta obter o role diretamente sem passar por RLS
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id
  LIMIT 1;
  
  RETURN user_role = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

