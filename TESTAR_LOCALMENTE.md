# 🧪 Como Testar Localmente

## 🚀 Iniciar Servidor de Desenvolvimento

### Passo 1: Iniciar o Frontend

```bash
npm run dev
```

Isso vai iniciar o servidor em: `http://localhost:3000`

---

## 🧪 Testar a API Localmente

### Opção 1: Testar com Edge Function Local

1. **Terminal 1: Iniciar Edge Function**
   ```bash
   npx supabase functions serve check-subscription --no-verify-jwt
   ```

2. **Terminal 2: Iniciar Frontend**
   ```bash
   npm run dev
   ```

3. **Acessar:** `http://localhost:3000`

4. **Testar no navegador:**
   - Abra o Console do navegador (F12)
   - Execute:
   ```javascript
   fetch('http://localhost:54321/functions/v1/check-subscription', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       userId: 'seu-user-id',
       email: 'seu-email@exemplo.com'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

---

### Opção 2: Testar com API de Produção (Mais Fácil)

1. **Iniciar Frontend:**
   ```bash
   npm run dev
   ```

2. **Acessar:** `http://localhost:3000`

3. **A função já está deployada**, então funciona automaticamente!

---

## 🎯 Testar no Frontend

### 1. Adicionar ao Portal Dashboard

Abra: `src/pages/portal/PortalDashboard.jsx`

Adicione:
```jsx
import { SubscriptionStatus } from '@/components/SubscriptionStatus';

// Dentro do return:
<SubscriptionStatus />
```

### 2. Testar no Admin Dashboard

O componente já está adicionado! Acesse:
- `http://localhost:3000/admin/dashboard`
- Role até o componente "Verificar Assinatura de Usuário"
- Teste com um User ID e Email reais

---

## 🔍 Verificar se Está Funcionando

### No Console do Navegador (F12)

```javascript
// Testar hook
import { useSubscriptionAccess } from '@/hooks/useSubscription';

// Ou testar diretamente
fetch('/api/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000000',
    email: 'test@test.com'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Resultado:', data);
  console.log('Tem acesso?', data.hasAccess);
});
```

---

## 📝 Checklist de Teste

- [ ] Servidor rodando em `http://localhost:3000`
- [ ] Acessar página do Portal
- [ ] Ver componente `SubscriptionStatus` (se adicionado)
- [ ] Acessar Admin Dashboard
- [ ] Ver componente de verificação
- [ ] Testar verificação com User ID e Email reais
- [ ] Verificar resultado no console

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to API"
→ A função precisa estar deployada OU rodando localmente

### Erro: "CORS"
→ Use o proxy `/api/check-subscription` ou configure CORS

### Erro: "404 Not Found"
→ Verifique se o proxy está configurado no `vercel.json`

---

## ✅ Pronto!

Acesse `http://localhost:3000` e teste! 🚀

