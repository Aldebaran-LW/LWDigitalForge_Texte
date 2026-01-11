# 🔍 Como Verificar Logs da Vercel

## 📊 Onde Encontrar os Logs

### Opção 1: Pelo Dashboard da Vercel

1. **Acessar Vercel Dashboard:**
   - Acesse: https://vercel.com/dashboard
   - Faça login se necessário

2. **Selecionar Projeto:**
   - Procure pelo projeto: `ponto-diario-1` (ou nome do projeto JornadaPro)
   - Clique no projeto

3. **Acessar Logs:**
   - No menu superior, clique em **"Logs"** (ou **"Deployments"** → selecionar deploy → **"Functions"**)
   - Ou no menu lateral esquerdo, clique em **"Logs"**

4. **Filtrar Logs:**
   - Procure por logs relacionados a `/api/verify-subscription`
   - Ou procure por logs com `[Verify]`, `[Subscription]`, `[Cache]`
   - Ou procure por erros (mensagens em vermelho)

---

### Opção 2: Pelo Deployment Específico

1. **Acessar Deployments:**
   - No menu superior, clique em **"Deployments"**
   - Encontre o deployment mais recente (último deploy)
   - Clique no deployment

2. **Acessar Functions:**
   - Na página do deployment, procure por **"Functions"** ou **"Serverless Functions"**
   - Ou clique em **"View Function Logs"**

3. **Filtrar Logs:**
   - Procure por `/api/verify-subscription`
   - Ou procure por logs com `[Verify]`, `[Subscription]`, `[Cache]`

---

## 🔍 O Que Procurar nos Logs

### Logs Esperados (Se Funcionando):

```
🔍 [Verify] Verificando no banco: { userId: '...', appId: '...' }
✅ [Cache] Retornando do cache: ...
OU
🔍 [Verify] Verificando no banco: { userId: '...', appId: '...' }
✅ [Verify] Resultado: { hasAccess: true, isSubscriber: true, ... }
```

### Logs de Erro (Se Problema):

```
❌ [Verify] Erro: ...
❌ [Verify] Erro ao buscar assinaturas: ...
❌ [Verify] Erro ao buscar compra: ...
❌ [Verify] Erro ao buscar trial: ...
```

### Logs Importantes:

- `🔍 [Verify] Verificando no banco` - Indica que está verificando
- `✅ [Cache] Retornando do cache` - Indica que está usando cache
- `❌ [Verify] Erro` - Indica erro na verificação
- `❌ [Verify] Erro ao buscar assinaturas` - Erro ao buscar user_purchases
- `❌ [Verify] Erro ao buscar compra` - Erro ao buscar compra específica
- `❌ [Verify] Erro ao buscar trial` - Erro ao buscar user_trials

---

## 📋 Checklist de Verificação

- [ ] Acessar Vercel Dashboard
- [ ] Selecionar projeto `ponto-diario-1` (ou nome correto)
- [ ] Acessar "Logs" ou "Deployments" → último deploy → "Functions"
- [ ] Filtrar por `/api/verify-subscription`
- [ ] Procurar por logs com `[Verify]`, `[Subscription]`, `[Cache]`
- [ ] Procurar por erros (mensagens em vermelho)
- [ ] Verificar se há erros ao buscar no banco
- [ ] Verificar se há problemas com variáveis de ambiente

---

## 🎯 O Que Fazer Com os Logs

### Se Ver Logs de Erro:

**Exemplo:**
```
❌ [Verify] Erro ao buscar assinaturas: { message: '...', code: '...' }
```

**Ações:**
1. **Copiar mensagem de erro completa**
2. **Verificar se variáveis de ambiente estão configuradas** (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. **Verificar se há problemas com conexão ao Supabase**
4. **Verificar se há problemas com permissões**

### Se Ver Logs de Sucesso:

**Exemplo:**
```
🔍 [Verify] Verificando no banco: { userId: '...', appId: '...' }
✅ [Verify] Resultado: { hasAccess: true, ... }
```

**Mas aplicação ainda não funciona:**
- ⚠️ Problema no frontend (código não está usando resultado)
- ⚠️ Verificar console do navegador
- ⚠️ Verificar código de `use-subscription.js` e `use-require-auth.js`

---

## 🔍 Testar e Ver Logs em Tempo Real

### 1. Acessar Logs da Vercel

### 2. Em Outra Aba, Testar API Route:

```
https://jornadapro.lwdigitalforge.com/api/verify-subscription?userId=09e6b710-c560-4f11-aa7a-01abef23f0b0&appId=e8ff7872-dedb-405c-bf8a-f7901ac4b432
```

### 3. Voltar para Logs:

- Verificar se aparecem novos logs
- Verificar se há erros
- Verificar resultado da verificação

---

## ✅ Próximos Passos

1. **Acessar logs da Vercel**
2. **Filtrar por `/api/verify-subscription`**
3. **Procurar por erros ou logs de `[Verify]`**
4. **Copiar logs de erro se houver**
5. **Me dizer o que aparece nos logs**

---

**ACESSAR LOGS DA VERCEL E ME DIZER O QUE APARECE!** 🔍
