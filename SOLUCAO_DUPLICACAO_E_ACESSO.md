# 🔍 Problemas Identificados e Soluções

## ⚠️ Problemas Relatados

1. **Duplicação em "Meus Produtos"** - Aplicação aparece 2 vezes
2. **Nada aparece em "Testes"** - Não mostra nenhum teste
3. **Usuário não consegue acessar** - Mesmo com tudo configurado

---

## 🔍 Problema 1: Duplicação em "Meus Produtos"

### Causa:

O código busca TODOS os registros de `user_purchases` sem agrupar por produto:

```javascript
// PortalMeusProdutos.jsx linha 47-50
const products = (purchases || [])
  .map(purchase => purchase.registered_apps)
  .filter(Boolean);
setMyProducts(products);
```

**Se há múltiplos registros de `user_purchases` para o mesmo `app_id`, o produto aparece duplicado!**

Nas imagens anteriores, vi que há múltiplos registros (id 3, 4, 5, 6) todos com o mesmo `app_id` (`e8ff7872-dedb-405c-bf8a-f7901ac4b432`).

### Solução:

**Opção 1: Remover Duplicados no Código (Recomendado)**

Modificar `PortalMeusProdutos.jsx` para remover duplicados:

```javascript
// Após mapear produtos
const products = (purchases || [])
  .map(purchase => purchase.registered_apps)
  .filter(Boolean);

// Remover duplicados baseado no ID do produto
const uniqueProducts = Array.from(
  new Map(products.map(product => [product.id, product])).values()
);
setMyProducts(uniqueProducts);
```

**Opção 2: Limpar Banco (Se não precisar manter histórico)**

Remover registros duplicados no banco, mantendo apenas o mais recente.

---

## 🔍 Problema 2: Nada Aparece em "Testes"

### Causa:

O código busca apenas trials com:
- `is_active = true`
- `expires_at > now()`

**Se não há registros em `user_trials` ou estão inativos/expirados, nada aparece!**

### Solução:

**Verificar se há trials no banco:**

Execute o SQL de diagnóstico para ver se há trials.

**Se não houver trials, é normal não aparecer nada.**

**Se houver trials mas não aparecer, pode ser:**
- Trials estão inativos (`is_active = false`)
- Trials expirados (`expires_at < now()`)

---

## 🔍 Problema 3: Usuário Não Consegue Acessar

### Possíveis Causas:

1. **Verificação de assinatura falhando** (mesmo com `expires_at` preenchido)
2. **appId incorreto** (não está sendo passado corretamente)
3. **Cache desatualizado** (mesmo com webhooks)
4. **Problema na aplicação** (endpoint não funcionando)

### Solução:

**Verificar passo a passo:**

1. **Testar API route diretamente:**
   ```
   https://jornadapro.lwdigitalforge.com/api/verify-subscription?userId=86f65d7a-cd01-45ed-b816-f105b8c3752e&appId=e8ff7872-dedb-405c-bf8a-f7901ac4b432
   ```

2. **Verificar se retorna `hasAccess: true`**

3. **Se retornar `hasAccess: false`, verificar:**
   - Se `expires_at` está preenchido E no futuro
   - Se `app_id` está correto no registro
   - Se `user_id` está correto

4. **Verificar logs da aplicação** na Vercel

---

## ✅ Soluções Rápidas

### 1. Corrigir Duplicação (Código)

Modificar `src/pages/portal/PortalMeusProdutos.jsx`:

```javascript
// Linha ~47-50, substituir por:
const products = (purchases || [])
  .map(purchase => purchase.registered_apps)
  .filter(Boolean);

// Adicionar: Remover duplicados
const uniqueProducts = Array.from(
  new Map(products.map(product => [product.id, product])).values()
);
setMyProducts(uniqueProducts);
```

### 2. Verificar Trials (SQL)

Execute `DIAGNOSTICO_DUPLICACAO_E_ACESSO.sql` para verificar trials.

### 3. Diagnosticar Acesso (Teste)

Teste a API route diretamente e verifique logs.

---

**Vou criar as correções no código e SQLs de diagnóstico!**
