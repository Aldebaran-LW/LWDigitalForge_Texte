# 🧪 Testes no Console do Navegador

## ✅ Teste Básico (Funcionando!)

```javascript
fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000000',
    email: 'test@test.com'
  })
})
.then(r => r.json())
.then(console.log);
```

**Resultado esperado:**
```json
{
  "hasAccess": false,
  "isSubscriber": false,
  "isTrial": false,
  "subscriptionStatus": "none",
  "message": "Usuário não encontrado ou email não corresponde"
}
```

✅ **Funcionando perfeitamente!**

---

## 🎯 Testes com Usuário Real

### 1. Obter User ID e Email de um Usuário Real

No console do navegador (quando logado):

```javascript
// Obter dados do usuário atual
const user = await supabase.auth.getUser();
console.log('User ID:', user.data.user.id);
console.log('Email:', user.data.user.email);
```

### 2. Testar com Usuário Real

```javascript
// Substitua pelos valores reais
const userId = 'SEU_USER_ID_AQUI';
const email = 'SEU_EMAIL_AQUI';

fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, email })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Resultado:', data);
  console.log('Tem acesso?', data.hasAccess);
  console.log('É assinante?', data.isSubscriber);
  console.log('Está em trial?', data.isTrial);
  console.log('Status:', data.subscriptionStatus);
});
```

---

## 📊 Exemplos de Respostas

### Usuário sem Assinatura
```json
{
  "hasAccess": false,
  "isSubscriber": false,
  "isTrial": false,
  "subscriptionStatus": "none",
  "message": "Assinatura não encontrada ou expirada"
}
```

### Usuário com Assinatura Ativa
```json
{
  "hasAccess": true,
  "isSubscriber": true,
  "isTrial": false,
  "subscriptionStatus": "active",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Usuário em Trial
```json
{
  "hasAccess": true,
  "isSubscriber": false,
  "isTrial": true,
  "subscriptionStatus": "trial",
  "trialExpiresAt": "2024-01-15T23:59:59Z",
  "daysRemaining": 7
}
```

---

## 🔍 Teste de Validação

### Teste 1: userId ausente
```javascript
fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com' })
})
.then(r => r.json())
.then(console.log);
// Esperado: { error: "Bad Request", message: "userId e email são obrigatórios" }
```

### Teste 2: email ausente
```javascript
fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '00000000-0000-0000-0000-000000000000' })
})
.then(r => r.json())
.then(console.log);
// Esperado: { error: "Bad Request", message: "userId e email são obrigatórios" }
```

### Teste 3: email inválido
```javascript
fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    userId: '00000000-0000-0000-0000-000000000000',
    email: 'email-invalido'
  })
})
.then(r => r.json())
.then(console.log);
// Esperado: { error: "Bad Request", message: "Email inválido" }
```

---

## 🎨 Função Helper para Testes

Cole no console para facilitar:

```javascript
// Função helper
async function testarAssinatura(userId, email) {
  try {
    const response = await fetch(
      'https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      }
    );
    
    const data = await response.json();
    
    console.log('📊 Resultado:', data);
    console.log('✅ Tem acesso?', data.hasAccess);
    console.log('💳 É assinante?', data.isSubscriber);
    console.log('🧪 Está em trial?', data.isTrial);
    console.log('📅 Status:', data.subscriptionStatus);
    
    if (data.expiresAt) {
      console.log('⏰ Expira em:', new Date(data.expiresAt).toLocaleString('pt-BR'));
    }
    
    if (data.trialExpiresAt) {
      console.log('🧪 Trial expira em:', new Date(data.trialExpiresAt).toLocaleString('pt-BR'));
      console.log('📆 Dias restantes:', data.daysRemaining);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

// Usar:
// testarAssinatura('user-id', 'email@exemplo.com');
```

---

## ✅ Status Atual

A função está **funcionando perfeitamente**! ✅

O teste retornou a resposta esperada para um usuário inexistente.

---

## 🎯 Próximos Testes

1. ✅ Teste básico - **PASSOU**
2. Teste com usuário real (se tiver)
3. Teste no Admin Dashboard (componente já está lá)
4. Teste no Portal (se adicionar o componente)

