# 🔍 Verificar: Por Que o Usuário Não Consegue Acessar?

## 🎯 Teste Passo a Passo

### 1. Testar API Route Diretamente

**Acesse no navegador:**

```
https://jornadapro.lwdigitalforge.com/api/verify-subscription?userId=86f65d7a-cd01-45ed-b816-f105b8c3752e&appId=e8ff7872-dedb-405c-bf8a-f7901ac4b432
```

**Substitua:**
- `userId` pelo ID do usuário que está tentando acessar
- `appId` por `e8ff7872-dedb-405c-bf8a-f7901ac4b432` (JornadaPro)

**Resultado Esperado (se funcionar):**
```json
{
  "hasAccess": true,
  "isSubscriber": true,
  "isTrial": false,
  "cached": false
}
```

**Se retornar `hasAccess: false`:**
- ⚠️ Problema na verificação de assinatura
- Verificar dados no banco

---

### 2. Verificar Dados no Banco

Execute no SQL Editor do Supabase:

```sql
-- Verificar registro de compra do usuário
SELECT 
    up.id,
    up.user_id,
    up.app_id,
    ra.name as nome_app,
    up.purchased_at,
    up.expires_at,
    up.expires_at > NOW() as ainda_ativo,
    CASE 
        WHEN up.expires_at IS NULL THEN '❌ SEM EXPIRAÇÃO'
        WHEN up.expires_at < NOW() THEN '⚠️ EXPIRADO'
        ELSE '✅ ATIVO'
    END as status
FROM user_purchases up
LEFT JOIN registered_apps ra ON up.app_id = ra.id
WHERE up.user_id = '86f65d7a-cd01-45ed-b816-f105b8c3752e'
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
ORDER BY up.purchased_at DESC;
```

**Verificar:**
- ✅ `expires_at` está preenchido
- ✅ `ainda_ativo` é `true`
- ✅ Status é `✅ ATIVO`

---

### 3. Verificar Logs da Aplicação

Na Vercel:

1. **Acesse:** https://vercel.com/dashboard
2. **Projeto:** `ponto-diario-1`
3. **Deployments** → **Logs**

**Procure por:**
- `🔍 [Verify] Verificando no banco` - Verificação funcionando
- `✅ [Cache] Retornando do cache` - Cache funcionando
- `❌ [Verify] Erro` - Erro ao verificar

---

### 4. Verificar Console do Navegador

Quando o usuário tenta acessar:

1. Abra **Console do Navegador** (F12)
2. Tente acessar a aplicação
3. Procure por erros:
   - `❌ [DEBUG] Erro ao verificar acesso`
   - `❌ [DEBUG] appId não encontrado`
   - `❌ [DEBUG] userId não fornecido`

---

## 🔍 Possíveis Problemas e Soluções

### Problema 1: API Route Retorna `hasAccess: false`

**Causa:** Verificação de assinatura falhando

**Solução:**
1. Verificar se `expires_at` está preenchido e no futuro
2. Verificar se `app_id` está correto
3. Verificar se `user_id` está correto

### Problema 2: appId Não Está Sendo Passado

**Causa:** `sessionStorage` não está sendo lido ou `NEXT_PUBLIC_PRODUCT_ID` não está configurado

**Solução:**
1. Verificar se portal está salvando `app_product_id` no sessionStorage
2. Verificar se `NEXT_PUBLIC_PRODUCT_ID` está configurado na Vercel
3. Verificar logs: `❌ [DEBUG] appId não encontrado`

### Problema 3: Cache Desatualizado

**Causa:** Cache ainda tem dados antigos

**Solução:**
1. Aguardar 1 minuto (TTL do cache)
2. Ou fazer redeploy na Vercel
3. Ou limpar cache manualmente (se possível)

### Problema 4: Aplicação Redireciona para `/assinatura-necessaria`

**Causa:** Verificação retorna `hasAccess: false`

**Solução:**
1. Verificar se usuário tem registro em `user_purchases`
2. Verificar se `expires_at` está correto
3. Testar API route diretamente

---

## ✅ Checklist de Diagnóstico

- [ ] Testei API route diretamente
- [ ] API route retorna `hasAccess: true`
- [ ] Verifiquei dados no banco (expires_at correto)
- [ ] Verifiquei logs da Vercel
- [ ] Verifiquei console do navegador
- [ ] Verifiquei se portal salva app_product_id no sessionStorage
- [ ] Verifiquei se NEXT_PUBLIC_PRODUCT_ID está configurado

---

## 🎯 Próximos Passos

1. **Testar API route** diretamente (Passo 1)
2. **Se retornar `hasAccess: false`**, verificar dados no banco (Passo 2)
3. **Se dados estão corretos**, verificar logs (Passo 3)
4. **Se logs mostram erro**, verificar console (Passo 4)

---

**Execute os testes e me diga os resultados!** 🔍
