# 🧪 Teste Rápido: Verificar se a Liberação Está Funcionando

## ✅ SQL Executado com Sucesso!

**Resultados:**
- ✅ `sem_expiracao`: 0 (todos têm `expires_at`)
- ✅ `ativos`: 4 (todos estão ativos)
- ✅ `expirados`: 0

**O problema do `expires_at` NULL foi resolvido!**

---

## 🧪 Teste 1: API Route Diretamente (Mais Rápido)

### Acesse no Navegador:

```
https://jornada-pro.vercel.app/api/verify-subscription?userId=86f65d7a-cd01-45ed-b816-f105b8c3752e&appId=e8ff7872-dedb-405c-bf8a-f7901ac4b432
```

**Substitua:**
- `jornada-pro.vercel.app` pela URL real da sua aplicação
- `userId` pelo ID de um usuário que tem assinatura (veja na tabela `user_purchases`)
- `appId` por `e8ff7872-dedb-405c-bf8a-f7901ac4b432` (JornadaPro)

### Resultado Esperado:

**✅ Se funcionar:**
```json
{
  "hasAccess": true,
  "isSubscriber": true,
  "isTrial": false,
  "cached": false
}
```

**❌ Se não funcionar:**
```json
{
  "hasAccess": false,
  "isSubscriber": false,
  "isTrial": false,
  "cached": false
}
```

---

## 🧪 Teste 2: Na Aplicação (Teste Real)

### Passo a Passo:

1. **Acesse a aplicação:**
   - URL: https://jornada-pro.vercel.app (ou URL real)
   - Faça login com um usuário que tem assinatura

2. **Usuários para testar:**
   - Email: `lucas08willian@gmail.com` (user_id: `86f65d7a-cd01-45ed-b816-f105b8c3752e`)
   - Email: `lucaswillian.yamasa@gm...` (user_id: `09e6b710-c560-4f11-aa7a-01abef23f0b0`)
   - Email: `lwdigitalforge@gmail.co...` (user_id: `52c476c6-4edd-4f61-8f5e-599e067d6bc1`)

3. **Verificar acesso:**
   - ✅ Deve permitir acesso às páginas protegidas
   - ✅ NÃO deve redirecionar para `/assinatura-necessaria`
   - ✅ Deve mostrar conteúdo da aplicação

4. **Se não funcionar:**
   - ⚠️ Verificar console do navegador (F12)
   - ⚠️ Verificar logs da Vercel
   - ⚠️ Verificar se `NEXT_PUBLIC_PRODUCT_ID` está configurado

---

## 🧪 Teste 3: Verificar Dados no Banco

### Execute no SQL Editor do Supabase:

```sql
SELECT 
  id,
  user_id,
  app_id,
  purchased_at,
  expires_at,
  expires_at > NOW() as ainda_ativo,
  CASE 
    WHEN expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
    WHEN expires_at < NOW() THEN '⚠️ EXPIRADO'
    ELSE '✅ ATIVO'
  END as status
FROM user_purchases
ORDER BY purchased_at DESC;
```

**Verificar:**
- ✅ Todos os registros têm `expires_at` preenchido
- ✅ Todos têm `ainda_ativo = true`
- ✅ Todos têm status `✅ ATIVO`

---

## 🔍 Diagnóstico: Se Ainda Não Funcionar

### 1. Verificar Cache

Se testou antes do SQL, o cache pode estar desatualizado:

**Solução:**
- Aguardar 1 minuto (TTL do cache)
- Ou fazer redeploy na Vercel

### 2. Verificar appId

Verificar se `NEXT_PUBLIC_PRODUCT_ID` está configurado:

**Na Vercel:**
- Settings → Environment Variables
- Verificar se `NEXT_PUBLIC_PRODUCT_ID = e8ff7872-dedb-405c-bf8a-f7901ac4b432`

### 3. Verificar userId

Verificar se o usuário tem registro em `user_purchases`:

```sql
SELECT * 
FROM user_purchases
WHERE user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

### 4. Verificar Logs

Na Vercel, verificar logs:

- ✅ `🔍 [Verify] Verificando no banco` - Funcionando
- ✅ `✅ [Cache] Retornando do cache` - Cache funcionando
- ❌ `❌ [Verify] Erro` - Erro ao verificar

---

## ✅ Resultado Esperado

### Se funcionar:

1. ✅ API route retorna `hasAccess: true`
2. ✅ Aplicação permite acesso
3. ✅ Usuários com assinatura conseguem acessar

### Próximos Passos:

1. ✅ Configurar webhooks (opcional, mas recomendado)
2. ✅ Testar com novos usuários
3. ✅ Monitorar logs

---

## 🔔 Opcional: Configurar Webhooks

Se a liberação está funcionando agora, configure webhooks para atualização em tempo real:

**Guia:** `GUIA_WEBHOOKS_SUPABASE_PASSO_A_PASSO.md`

**Resumo:**
1. Gerar secret
2. Adicionar `SUPABASE_WEBHOOK_SECRET` na Vercel
3. Criar 2 webhooks no Supabase
4. Testar

---

**Agora teste! A liberação deve estar funcionando!** ✅🧪
