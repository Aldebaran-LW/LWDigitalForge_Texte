# 🏗️ Arquitetura Completa de Acesso

## 🎯 Entendimento Correto

Você tem **DOIS sistemas separados**:

---

## 1️⃣ Site Principal (LWDigitalForge_Texte)

**Repositório:** `LWDigitalForge_Texte`
**Banco de dados:** Supabase (PostgreSQL)
**URL:** `lwdigitalforge.com` (ou similar)

### Propósito:
- 🛒 **E-commerce** (venda de produtos/apps)
- 👤 **Cadastro de usuários**
- 💳 **Processamento de pagamentos**
- 📊 **Dashboard admin e portal do cliente**

### Tabelas importantes:
- `profiles` (usuários cadastrados)
- `registered_apps` (apps disponíveis para venda)
- `user_purchases` (compras aprovadas)
- `user_trials` (trials ativos)

### Acesso:
- `/login` → Qualquer usuário cadastrado pode entrar
- `/portal` → Usuários com `is_liberado = true` (ver produtos, fazer compras)
- `/admin` → Apenas usuários com `role = 'ADMIN'`

---

## 2️⃣ Aplicação JornadaPro (Ponto Diário)

**Repositório:** `Ponto_Diario-1`
**Banco de dados:** MongoDB (`jornadapro.gyc7cgi.mongodb.net`)
**URL:** `jornadapro.lwdigitalforge.com`

### Propósito:
- 📝 **Aplicação específica** (gestão de ponto/jornada)
- 🔒 **Acesso restrito** (apenas quem comprou/trial)

### Acesso:
Usuário **PRECISA** ter uma das 3 condições:

1. **LIFETIME:** Compra vitalícia aprovada
   ```sql
   SELECT * FROM user_purchases 
   WHERE user_id = '...' 
     AND app_id = 'jornadapro_id'
     AND purchase_type = 'LIFETIME'
     AND status = 'APPROVED';
   ```

2. **SUBSCRIPTION:** Assinatura mensal/anual ativa
   ```sql
   SELECT * FROM user_purchases 
   WHERE user_id = '...' 
     AND app_id = 'jornadapro_id'
     AND purchase_type IN ('MONTHLY', 'ANNUAL')
     AND status = 'APPROVED'
     AND expires_at > NOW();
   ```

3. **TRIAL:** Trial ativo
   ```sql
   SELECT * FROM user_trials 
   WHERE user_id = '...' 
     AND app_id = 'jornadapro_id'
     AND is_active = true
     AND expires_at > NOW();
   ```

---

## 🔄 Fluxo de Acesso Completo

### Cenário 1: Usuário novo se cadastra

```
1. Usuário acessa lwdigitalforge.com/cadastro
   ↓
2. Preenche dados e cria conta
   ↓
3. Perfil criado em Supabase:
   - is_liberado = true (acesso ao SITE)
   - role = 'USER'
   ↓
4. Usuário faz login → Acessa /portal
   ↓
5. Vê produtos disponíveis (incluindo JornadaPro)
   ↓
6. Compra JornadaPro OU inicia trial
   ↓
7. Registro criado em user_purchases OU user_trials
   ↓
8. AGORA pode acessar jornadapro.lwdigitalforge.com
```

### Cenário 2: Usuário tenta acessar JornadaPro SEM compra

```
1. Usuário cadastrado no site (is_liberado = true)
   ↓
2. Tenta acessar jornadapro.lwdigitalforge.com
   ↓
3. JornadaPro verifica Supabase:
   - user_purchases: NENHUMA
   - user_trials: NENHUM
   ↓
4. ❌ ACESSO NEGADO
   ↓
5. Redireciona para página "Assinatura Necessária"
```

---

## ✅ Diferença entre is_liberado e acesso ao app

| Campo | O que significa | Onde dá acesso |
|-------|----------------|----------------|
| `is_liberado = true` | Usuário pode usar o SITE PRINCIPAL | `/portal`, ver produtos, fazer compras |
| `user_purchases` | Usuário COMPROU um app específico | `jornadapro.lwdigitalforge.com` |
| `user_trials` | Usuário tem TRIAL de um app | `jornadapro.lwdigitalforge.com` |

**Analogia:**
- `is_liberado = true` → Pode entrar na LOJA
- `user_purchases/trials` → Pode usar o PRODUTO comprado

---

## 🔍 Como JornadaPro Verifica Acesso

O JornadaPro precisa ter um arquivo `subscription-service.js` que verifica:

```javascript
// subscription-service.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkUserAccess(userId, appId = 'jornadapro_id') {
  // 1. Verificar compra LIFETIME
  const { data: lifetime } = await supabase
    .from('user_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('purchase_type', 'LIFETIME')
    .eq('status', 'APPROVED')
    .single();
  
  if (lifetime) return { hasAccess: true, type: 'LIFETIME' };

  // 2. Verificar assinatura ativa
  const { data: subscription } = await supabase
    .from('user_purchases')
    .select('id, expires_at')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .in('purchase_type', ['MONTHLY', 'ANNUAL'])
    .eq('status', 'APPROVED')
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (subscription) return { hasAccess: true, type: 'SUBSCRIPTION', expiresAt: subscription.expires_at };

  // 3. Verificar trial ativo
  const { data: trial } = await supabase
    .from('user_trials')
    .select('id, expires_at')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (trial) return { hasAccess: true, type: 'TRIAL', expiresAt: trial.expires_at };

  // Sem acesso
  return { hasAccess: false };
}
```

---

## 📋 Checklist de Implementação

### No Site Principal (LWDigitalForge_Texte):
- [x] Usuários podem se cadastrar
- [x] `is_liberado = true` para acessar o site
- [x] Tabelas `user_purchases` e `user_trials` existem
- [ ] **Executar SQL para liberar usuários existentes**
- [ ] **Alterar default de `is_liberado` para `true`**

### No JornadaPro (Ponto_Diario-1):
- [ ] Implementar `subscription-service.js`
- [ ] Verificar acesso no `middleware.js` ou `layout.js`
- [ ] Redirecionar para "Assinatura Necessária" se sem acesso
- [ ] Configurar variáveis de ambiente (Supabase URL e Key)

---

## 🚀 Próximos Passos

1. **Primeiro: Liberar acesso ao SITE PRINCIPAL**
   ```sql
   -- Execute no Supabase
   UPDATE profiles
   SET is_liberado = true, data_vencimento = '2099-01-01'
   WHERE is_liberado = false;
   
   ALTER TABLE profiles ALTER COLUMN is_liberado SET DEFAULT true;
   ```

2. **Segundo: Verificar se JornadaPro tem verificação de acesso**
   - Ler repositório `Ponto_Diario-1`
   - Ver se tem `subscription-service.js`
   - Ver se verifica Supabase antes de permitir acesso

3. **Terceiro: Testar o fluxo completo**
   - Cadastrar usuário no site principal
   - Criar trial para JornadaPro
   - Acessar `jornadapro.lwdigitalforge.com`
   - Verificar se acesso é liberado

---

**Qual parte você quer corrigir primeiro?**
1. Site principal (liberar usuários)?
2. JornadaPro (implementar verificação)?
3. Ambos?
