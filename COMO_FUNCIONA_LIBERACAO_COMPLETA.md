# 🔐 Como Funciona a Liberação Completa

## 📋 Resumo Rápido

**✅ JÁ ESTÁ FUNCIONANDO AUTOMATICAMENTE!**

A liberação acontece **automaticamente** no portal antes de abrir o app. Você **NÃO precisa fazer nada** nos apps web!

---

## 🎯 Como Funciona

### **Ordem de Prioridade (Verificação Automática)**

Quando o cliente clica em "Acessar" no portal, o sistema verifica **automaticamente** nesta ordem:

1. ✅ **Assinatura Ativa** (MONTHLY, ANNUAL, LIFETIME)
2. ✅ **Compra Específica** 
3. ✅ **Trial Ativo**

**Se tem acesso:** App abre automaticamente
**Se não tem acesso:** Mostra mensagem de erro

---

## 📊 Tipos de Liberação

### 1. **Assinatura Ativa** (MONTHLY / ANNUAL / LIFETIME)

**Como funciona:**
- Verifica se usuário tem assinatura **ativa** para o produto
- Tipos: `MONTHLY`, `ANNUAL`, `LIFETIME`
- Status: `APPROVED`
- Verifica se não expirou (para MONTHLY/ANNUAL)

**Onde está:**
- Tabela: `user_purchases`
- Campos: `purchase_type`, `status`, `expires_at`, `app_id`

**Exemplo:**
```sql
-- Assinatura mensal ativa
user_id: abc123
app_id: produto-uuid
purchase_type: MONTHLY
status: APPROVED
expires_at: 2024-02-15 (futuro)
```

---

### 2. **Trial (Teste Gratuito)**

**Como funciona:**
- Verifica se usuário tem trial **ativo** para o produto
- Campo: `is_active = true`
- Verifica se não expirou (`expires_at > agora`)

**Onde está:**
- Tabela: `user_trials`
- Campos: `is_active`, `expires_at`, `app_id`

**Exemplo:**
```sql
-- Trial ativo
user_id: abc123
app_id: produto-uuid
is_active: true
expires_at: 2024-01-30 (futuro)
```

**Como conceder (Admin):**
- Admin → Usuários → Selecionar usuário → "Gerenciar Licenças"
- Escolher "Trial"
- Definir quantidade de dias (ex: 7, 14, 30)

---

### 3. **Vitalício Manual (LIFETIME)**

**Como funciona:**
- Verifica se usuário tem compra vitalícia para o produto
- Tipo: `LIFETIME`
- Status: `APPROVED`
- **Nunca expira** (`expires_at = null`)

**Onde está:**
- Tabela: `user_purchases`
- Campos: `purchase_type = LIFETIME`, `status = APPROVED`, `expires_at = null`

**Exemplo:**
```sql
-- Vitalício manual
user_id: abc123
app_id: produto-uuid
purchase_type: LIFETIME
status: APPROVED
expires_at: null (nunca expira)
amount_paid: 0 (gratuito, concedido pelo admin)
payment_method: ADMIN_GRANT
```

**Como conceder (Admin):**
- Admin → Usuários → Selecionar usuário → "Gerenciar Licenças"
- Escolher "Vitalício"
- Clicar em "Conceder Acesso"

**Código (AdminUsuarios.jsx):**
```javascript
// Admin concede vitalício manualmente
const purchaseData = {
  user_id: selectedUser.id,
  app_id: selectedProduct,
  purchase_type: 'LIFETIME',
  status: 'APPROVED',
  expires_at: null, // Nunca expira
  amount_paid: 0, // Gratuito
  payment_method: 'ADMIN_GRANT'
};
await supabase.from('user_purchases').insert(purchaseData);
```

---

## 🔄 Fluxo Completo

### **1. Cliente Compra/Assina/Trial**

**Cenários:**
- ✅ Compra direta → Mercado Pago → Cria registro em `user_purchases`
- ✅ Assinatura → Mercado Pago → Cria registro em `user_purchases` (MONTHLY/ANNUAL)
- ✅ Trial → Cliente clica "Testar" → Cria registro em `user_trials`
- ✅ Vitalício Manual → Admin concede → Cria registro em `user_purchases` (LIFETIME)

### **2. Cliente Acessa Portal**

**Cenários:**
- ✅ Vai em "Meus Produtos"
- ✅ Vê lista de produtos com acesso
- ✅ Clica em "Acessar"

### **3. Sistema Verifica Acesso (AUTOMÁTICO)**

**Função:** `checkUserProductAccess(userId, productId)`

**Ordem de verificação:**
1. ✅ Verifica assinatura ativa (MONTHLY/ANNUAL/LIFETIME)
2. ✅ Verifica compra específica
3. ✅ Verifica trial ativo

**Arquivo:** `src/utils/trialHelpers.js`

### **4. Resultado**

**Se TEM acesso:**
- ✅ Abre `vercel_deployment_url` em nova aba
- ✅ App web abre diretamente
- ✅ **Não há verificação adicional no app**

**Se NÃO TEM acesso:**
- ❌ Mostra mensagem de erro
- ❌ Não abre o app

---

## 🛠️ O Que Precisa Fazer?

### ✅ **No Portal (Já Está Pronto)**

**NÃO precisa fazer nada!** ✅

- ✅ Verificação automática já funciona
- ✅ Abertura do app já funciona
- ✅ Bloqueio de acesso já funciona

---

### ⚠️ **Nos Apps Web (Opcional)**

**Status:** NÃO é obrigatório, mas recomendado para produção

**Precisa fazer?**
- ❌ **Não é obrigatório** (verificação no portal já funciona)
- ⚠️ **Recomendado para produção** (segurança extra)

**Se quiser adicionar:**

1. **Opção A: Passar Product ID na URL (Mais Simples)**
   - Portal passa `productId` na URL automaticamente
   - App lê da URL
   - Não precisa configurar variável de ambiente

2. **Opção B: Verificação Completa no App (Mais Seguro)**
   - Configurar variável de ambiente `VITE_PRODUCT_ID`
   - Adicionar código de verificação no app
   - Verificar acesso quando app carrega

**Quando fazer:**
- Para começar: ❌ Não precisa
- Para produção: ⚠️ Considerar adicionar

---

## 📝 Resumo: Tipos de Acesso

| Tipo | Tabela | Campo | Expira? | Como Conceder |
|------|--------|-------|---------|---------------|
| **Assinatura Mensal** | `user_purchases` | `purchase_type: MONTHLY` | ✅ Sim | Mercado Pago / Admin |
| **Assinatura Anual** | `user_purchases` | `purchase_type: ANNUAL` | ✅ Sim | Mercado Pago / Admin |
| **Vitalício Manual** | `user_purchases` | `purchase_type: LIFETIME` | ❌ Não | Admin (Usuários → Gerenciar Licenças) |
| **Compra Específica** | `user_purchases` | Outros tipos | Depende | Mercado Pago / Admin |
| **Trial** | `user_trials` | `is_active: true` | ✅ Sim | Admin (Usuários → Gerenciar Licenças) |

---

## 🎯 Conclusão

### **✅ O Que JÁ Funciona:**

1. ✅ Verificação automática no portal
2. ✅ Abertura do app quando tem acesso
3. ✅ Bloqueio quando não tem acesso
4. ✅ Suporte a assinaturas (MONTHLY/ANNUAL/LIFETIME)
5. ✅ Suporte a trials
6. ✅ Suporte a vitalício manual (via admin)

### **⚠️ O Que É Opcional:**

1. ⚠️ Verificação adicional nos apps web
2. ⚠️ Passar Product ID na URL
3. ⚠️ Configurar variáveis de ambiente nos apps

### **📋 Resposta Final:**

**"Como fazemos na questão da liberação para o cliente (assinaturas/teste/vitalício manual)?"**

**Resposta:** **JÁ ESTÁ FUNCIONANDO AUTOMATICAMENTE!** ✅

- ✅ Assinaturas: Verificadas automaticamente
- ✅ Trial: Verificado automaticamente
- ✅ Vitalício Manual: Concedido pelo admin, verificado automaticamente

**Você NÃO precisa fazer nada nos apps web!** A verificação acontece no portal antes de abrir o app.

---

## 📚 Referências

- **Verificação de Acesso:** `src/utils/trialHelpers.js`
- **Conceder Vitalício/Trial:** `src/pages/admin/AdminUsuarios.jsx`
- **Abertura do App:** `src/pages/portal/PortalMeusProdutos.jsx`
- **Documentação Completa:** `COMO_FUNCIONA_LIBERACAO.md`

