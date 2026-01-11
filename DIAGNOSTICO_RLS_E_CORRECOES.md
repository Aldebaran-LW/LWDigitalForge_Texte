# 🔒 Diagnóstico e Correção: Políticas RLS

## 📋 Análise Técnica Detalhada

### Problema Identificado

As políticas RLS (Row Level Security) estão bloqueando:
1. ❌ **Liberação manual pelo admin** - Admin não consegue inserir em `user_purchases`
2. ❌ **Criação de trial** - Usuários não conseguem criar trials em `user_trials`

---

## 🔍 Causa Raiz

### 1. Falha nas Políticas RLS

A migração `20250109000003_fix_user_trials_insert_policy.sql` está vazia no repositório, o que significa que:
- As políticas necessárias não foram criadas
- O banco está bloqueando inserções via API
- Admins não conseguem conceder acesso manual
- Usuários não conseguem iniciar trials

### 2. Discrepância na Função de Liberação Manual

**Arquivo:** `src/pages/admin/AdminUsuarios.jsx`

✅ **JÁ CORRIGIDO** - Adicionado `purchased_at` obrigatório:
- `purchase_type: 'LIFETIME'`
- `status: 'APPROVED'`
- `purchased_at: new Date().toISOString()` ✅ (corrigido)
- `app_id: 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'`

### 3. Erro de Ativação do Trial

**Arquivo:** `src/utils/trialHelpers.js`

✅ **JÁ CORRIGIDO** - Função `iniciarTrialGratis` criada:
- `is_active: true` ✅
- `expires_at` em formato ISO ✅
- `started_at` preenchido ✅

---

## ✅ Correção: SQL para Políticas RLS

Execute o arquivo: `CORRECAO_RLS_POLITICAS_CRITICAS.sql`

### O que o SQL faz:

1. **Cria função `is_admin()`** (se não existir)
2. **Política para Admins inserirem compras:**
   - Permite que usuários com `role = 'ADMIN'` insiram em `user_purchases`
3. **Política para usuários criarem trials:**
   - Permite que usuários criem seu próprio trial (`auth.uid() = user_id`)
4. **Política para Admins gerenciarem trials:**
   - Permite que Admins insiram/atualizem trials de qualquer usuário
5. **Ativa RLS** nas tabelas (se não estiver ativo)

---

## 📋 Passo a Passo para Corrigir

### 1. Executar SQL no Supabase

1. **Acesse:** https://app.supabase.com/
2. **Selecione seu projeto:** `LW_Digital_Forge`
3. **SQL Editor** → **New Query**
4. **Copie o conteúdo** de `CORRECAO_RLS_POLITICAS_CRITICAS.sql`
5. **Cole no editor** e execute
6. **Verifique os resultados** - deve mostrar as políticas criadas

### 2. Verificar Logs da Edge Function

1. **Functions** → **check-subscription** → **Logs**
2. **Tente fazer login** no app
3. **Verifique os logs:**
   - Procure por: `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO`
   - Verifique se `appId` está chegando corretamente
   - Verifique se há erros de "User not found" ou "App not found"

### 3. Testar Liberação Manual (Admin)

1. **Acesse o Portal Admin**
2. **Gerenciar Usuários** → Selecionar usuário
3. **Gerenciar Licença** → Selecionar produto
4. **Vitalício** → Salvar
5. **Verificar** se aparece mensagem de sucesso

### 4. Testar Trial

1. **Acesse o Portal** como usuário comum
2. **Produtos** → Selecionar produto
3. **Testar Gratuitamente**
4. **Verificar** se o trial é criado

---

## 🔍 Verificação de Integração (App vs Portal)

### Ponto Positivo ✅

A Edge Function está preparada para receber tanto `appId` como `productId`, garantindo compatibilidade.

### Atenção ⚠️

O app JornadaPro deve enviar o ID `e8ff7872-dedb-405c-bf8a-f7901ac4b432` através de:
- `lib/subscription-service.js`
- Variável de ambiente: `NEXT_PUBLIC_PRODUCT_ID`

**Verificar na Vercel:**
- Aplicação JornadaPro → Settings → Environment Variables
- `NEXT_PUBLIC_PRODUCT_ID` = `e8ff7872-dedb-405c-bf8a-f7901ac4b432`

---

## ✅ Checklist de Correção

### SQL RLS:
- [ ] Executar `CORRECAO_RLS_POLITICAS_CRITICAS.sql` no Supabase
- [ ] Verificar se políticas foram criadas
- [ ] Verificar se RLS está ativado

### Código:
- [x] `AdminUsuarios.jsx` - ✅ Corrigido (purchased_at adicionado)
- [x] `trialHelpers.js` - ✅ Corrigido (função iniciarTrialGratis criada)
- [ ] Edge Function deployada - ✅ Deploy realizado

### Verificação:
- [ ] Testar liberação manual (Admin)
- [ ] Testar criação de trial (Usuário)
- [ ] Verificar logs da Edge Function
- [ ] Verificar `NEXT_PUBLIC_PRODUCT_ID` na Vercel

---

## 📊 Próximos Passos Após Correção

1. ✅ **Validar RLS** - Executar SQL de correção
2. ✅ **Verificar Logs** - Monitorar Edge Function
3. ✅ **Testar Funcionalidades** - Liberação manual e trial
4. ⚠️ **Limpeza** - Remover tabelas antigas do Supabase (se necessário):
   - `Apontamentos_Fabrica`
   - `Funcionarios`
   - Outras tabelas operacionais antigas

---

## 🎯 Resumo Final

### Problemas Identificados:
1. ❌ Políticas RLS ausentes → **Correção: SQL de políticas**
2. ✅ Função de liberação manual → **Já corrigida**
3. ✅ Função de trial → **Já corrigida**

### Ação Imediata:
**Executar `CORRECAO_RLS_POLITICAS_CRITICAS.sql` no Supabase SQL Editor**

---

**Após executar o SQL, teste as funcionalidades e verifique os logs!** ✅
