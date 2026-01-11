# 🧪 Como Testar a Função RPC get_user_apps_status

## ✅ Status Atual

**Mensagem:** "Success. No rows returned"

**Significado:**
- ✅ A função foi criada com sucesso
- ⚠️ Ao testar, não retornou nenhuma linha

---

## 🔍 Possíveis Causas

### 1. **Nenhum app ativo cadastrado**

A função só retorna apps com `is_active = true`. Verifique:

**⚠️ IMPORTANTE:** Copie apenas o SQL abaixo, SEM os blocos de código markdown (```sql e ```):

```sql
SELECT id, name, is_active 
FROM registered_apps 
WHERE is_active = true;
```

**Solução:** Se não houver apps ativos, crie alguns ou ative os existentes.

---

### 2. **Usuário de teste não tem acesso**

A função retorna apps mesmo sem acesso (mas com `has_access = false`). Se não retornou nada, pode ser que não haja apps ativos.

**Teste:** Use um usuário existente e verifique:

```sql
-- Listar todos os usuários
SELECT id, email, role 
FROM profiles 
LIMIT 5;

-- Testar a função com um usuário existente
SELECT * FROM get_user_apps_status('[ID_DO_USUARIO]'::UUID);
```

---

### 3. **Usuário de teste não existe**

Se usou um UUID que não existe, a função pode não retornar nada.

**Teste:** Verifique se o usuário existe:

```sql
-- Verificar se o usuário existe
SELECT id, email FROM profiles WHERE id = '[ID_USADO_NO_TESTE]';
```

---

## ✅ Teste Completo Recomendado

### **PASSO 1: Verificar se há apps ativos**

```sql
SELECT COUNT(*) as total_apps_ativos
FROM registered_apps 
WHERE is_active = true;
```

**Resultado esperado:** Deve ser > 0

---

### **PASSO 2: Verificar se há usuários**

```sql
SELECT id, email, role 
FROM profiles 
LIMIT 3;
```

**Resultado esperado:** Lista de usuários

---

### **PASSO 3: Testar a função com um usuário real**

```sql
-- Substitua [ID_DO_USUARIO] por um ID real da consulta anterior
SELECT * FROM get_user_apps_status('[ID_DO_USUARIO]'::UUID);
```

**Resultado esperado:**
- Se houver apps ativos: Lista de apps com `has_access`, `access_type`, etc.
- Se não houver apps ativos: Nenhuma linha (normal!)

---

### **PASSO 4: Verificar se a função existe**

```sql
SELECT proname, proargtypes 
FROM pg_proc 
WHERE proname = 'get_user_apps_status';
```

**Resultado esperado:** 1 linha (a função existe)

---

## 🎯 Interpretação do "No rows returned"

### **Cenário 1: Função funcionando corretamente**

Se:
- ✅ A função existe (PASSO 4 retorna resultado)
- ✅ Há apps ativos (PASSO 1 retorna > 0)
- ⚠️ Mas a função retorna "No rows returned"

**Causa possível:** A lógica da função pode ter algum problema (mas é improvável).

**Solução:** Verifique os logs de erro do Supabase ou tente com um usuário diferente.

---

### **Cenário 2: Sem apps ativos (NORMAL)**

Se:
- ✅ A função existe
- ❌ NÃO há apps ativos

**Resultado:** "No rows returned" é **NORMAL e ESPERADO**

**Solução:** 
- Crie apps ativos, OU
- Ative apps existentes: `UPDATE registered_apps SET is_active = true WHERE id = '[ID_DO_APP]';`

---

## 📝 Teste com Dados de Exemplo

Se quiser criar dados de teste rapidamente:

```sql
-- 1. Verificar se há apps
SELECT id, name, is_active FROM registered_apps LIMIT 5;

-- 2. Se não houver apps, pode criar um (opcional)
-- (Isso é apenas para teste - você pode ter seu próprio processo)

-- 3. Ativar apps existentes (se necessário)
UPDATE registered_apps SET is_active = true WHERE id IN (
  SELECT id FROM registered_apps LIMIT 1
);

-- 4. Testar novamente a função
SELECT * FROM get_user_apps_status('[ID_DO_USUARIO]'::UUID);
```

---

## ✅ Checklist de Verificação

- [ ] Função criada (PASSO 4 retorna resultado)
- [ ] Há apps ativos na tabela (PASSO 1 retorna > 0)
- [ ] Usuário de teste existe (PASSO 2 mostra o usuário)
- [ ] Função retorna apps (PASSO 3 retorna linhas)

---

## 🎉 Conclusão

**"Success. No rows returned"** significa que:

1. ✅ **A função foi criada com sucesso**
2. ⚠️ **Não há linhas para retornar** (pode ser normal se não houver apps ativos)

**Próximo passo:** 
- Se houver apps ativos e ainda não retornar nada, verifique a lógica da função
- Se não houver apps ativos, isso é esperado - crie/ative apps e teste novamente
