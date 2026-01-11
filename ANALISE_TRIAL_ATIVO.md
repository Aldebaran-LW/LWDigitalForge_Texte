# 🔍 Análise: Trial Ativo Não Aparece

## 📊 Dados do Trial

Você mostrou que há um trial ativo:

| Campo | Valor |
|-------|-------|
| `id` | e6072c3d-7dcc-469a-ae39-2469aa20382d |
| `user_id` | 86f65d7a-cd01-45ed-b816-f105b8c3752e |
| `app_id` | e8ff7872-dedb-405c-bf8a-f7901ac4b432 (JornadaPro) |
| `started_at` | 2026-01-11 00:00:15.94+00 |
| `expires_at` | 2026-02-10 00:00:15.94+00 ✅ (ainda não expirou!) |
| `is_active` | true ✅ |
| `created_at` | 2026-01-04 00:56:35.519009+00 |

**✅ O trial está ATIVO e NÃO expirado!**

---

## 🔍 Por Que Não Aparece em "Testes"?

### Código da Página PortalTestes.jsx

O código busca:

```javascript
const { data, error } = await supabase
  .from('user_trials')
  .select(`
    *,
    registered_apps:app_id (
      id,
      name,
      description,
      image_url,
      vercel_deployment_url,
      github_repo_url,
      price_monthly,
      price_annual,
      price_lifetime
    )
  `)
  .eq('user_id', user.id)
  .eq('is_active', true)
  .gt('expires_at', now) // Apenas testes não expirados
  .order('started_at', { ascending: false });
```

**Filtros:**
- ✅ `user_id` = correto
- ✅ `is_active` = true (correto no banco)
- ✅ `expires_at` > now() (correto no banco - 2026-02-10)

**O código DEVERIA funcionar!**

---

## 🔍 Possíveis Causas

### 1. Problema com JOIN (registered_apps)

O código faz JOIN com `registered_apps:app_id (*)`. Se o `app_id` não existir em `registered_apps`, o resultado pode ser `null`.

**Verificar:**

```sql
-- Verificar se o app_id existe em registered_apps
SELECT 
    id,
    name,
    description
FROM registered_apps
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

### 2. Problema com Filtro `.gt('expires_at', now)`

O código usa `.gt('expires_at', now)` onde `now = new Date().toISOString()`.

**Verificar se o formato está correto:**

```sql
-- Verificar formato de expires_at
SELECT 
    expires_at,
    expires_at::text as expires_at_text,
    NOW() as now,
    expires_at > NOW() as ainda_ativo
FROM user_trials
WHERE id = 'e6072c3d-7dcc-469a-ae39-2469aa20382d';
```

### 3. Problema com `updateExpiredTrials()`

O código chama `updateExpiredTrials()` antes de buscar trials. Isso pode estar desativando o trial se houver um bug.

**Verificar:**

O código atualiza testes expirados:

```javascript
const { error } = await supabase
  .from('user_trials')
  .update({ is_active: false })
  .lt('expires_at', now)  // Se expires_at < now
  .eq('is_active', true)
  .eq('user_id', user.id);
```

**Isso não deveria afetar o trial se `expires_at` > `now`.**

### 4. Problema com Usuário Logado

O código usa `user.id` do contexto. Verificar se o usuário logado tem o mesmo ID.

**Verificar no console do navegador:**
- Abrir Console (F12)
- Verificar se `user.id` é `86f65d7a-cd01-45ed-b816-f105b8c3752e`

---

## ✅ Solução: Adicionar Logs de Debug

Adicionar logs no código para ver o que está acontecendo:

```javascript
// Na função fetchActiveTrials
console.log('🔍 [PortalTestes] Buscando trials para user:', user.id);
console.log('🔍 [PortalTestes] now:', now);

const { data, error } = await supabase
  .from('user_trials')
  .select(`...`)
  .eq('user_id', user.id)
  .eq('is_active', true)
  .gt('expires_at', now);

console.log('🔍 [PortalTestes] data:', data);
console.log('🔍 [PortalTestes] error:', error);
console.log('🔍 [PortalTestes] trials encontrados:', data?.length || 0);
```

---

## 🎯 Próximos Passos

1. **Verificar se `app_id` existe em `registered_apps`**
2. **Verificar formato de `expires_at`**
3. **Adicionar logs de debug no código**
4. **Verificar console do navegador**
5. **Testar a query diretamente no Supabase**

---

**Execute a query SQL acima para verificar se o app_id existe em registered_apps!** 🔍
