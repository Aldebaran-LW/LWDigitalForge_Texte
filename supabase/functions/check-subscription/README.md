# 🔌 API de Verificação de Assinatura

## 📍 Endpoint

**URL (Edge Function):** `https://[seu-projeto].supabase.co/functions/v1/check-subscription`  
**URL (Proxy/API):** `https://lwdigitalforge.com/api/check-subscription` *(se configurado)*  
**Método:** `POST`  
**Content-Type:** `application/json`

> **Nota:** A URL real da Edge Function do Supabase é `/functions/v1/check-subscription`. Se você configurar um proxy ou rewrite para mapear `/api/check-subscription` para a Edge Function, use a URL do proxy.

## 📤 Request (Requisição)

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@exemplo.com"
}
```

### Campos Obrigatórios
- `userId` (string, UUID): ID único do usuário no Supabase Auth
- `email` (string, email): Email do usuário autenticado

## 📥 Response (Resposta)

### Status Codes

- `200 OK` - Requisição bem-sucedida
- `400 Bad Request` - Dados inválidos (userId ou email ausentes)
- `500 Internal Server Error` - Erro no servidor

### Response Body (Sucesso - 200)

#### Usuário com Assinatura Ativa
```json
{
  "hasAccess": true,
  "isSubscriber": true,
  "isTrial": false,
  "subscriptionStatus": "active",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### Usuário em Período de Teste
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

#### Usuário sem Acesso
```json
{
  "hasAccess": false,
  "isSubscriber": false,
  "isTrial": false,
  "subscriptionStatus": "none",
  "message": "Assinatura não encontrada ou expirada"
}
```

### Response Body (Erro - 400)
```json
{
  "error": "Bad Request",
  "message": "userId e email são obrigatórios"
}
```

### Response Body (Erro - 500)
```json
{
  "error": "Internal Server Error",
  "message": "Erro ao verificar assinatura no banco de dados"
}
```

## 📋 Campos da Resposta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `hasAccess` | boolean | **Obrigatório** - Indica se o usuário tem acesso (true se `isSubscriber` OU `isTrial` for true) |
| `isSubscriber` | boolean | **Obrigatório** - Indica se o usuário tem assinatura ativa |
| `isTrial` | boolean | **Obrigatório** - Indica se o usuário está em período de teste |
| `subscriptionStatus` | string | Status da assinatura: `"active"`, `"trial"`, `"expired"`, `"none"` |
| `expiresAt` | string (ISO 8601) | Data de expiração da assinatura (se aplicável) |
| `trialExpiresAt` | string (ISO 8601) | Data de expiração do teste (se aplicável) |
| `daysRemaining` | number | Dias restantes no período de teste |
| `message` | string | Mensagem adicional (opcional) |

## 🔐 Lógica de Acesso

O sistema considera que o usuário tem acesso se:
- `hasAccess === true` **OU**
- `isSubscriber === true` **OU**
- `isTrial === true`

### Verificação de Assinatura

A função verifica:
1. **Assinaturas Ativas** (`user_purchases`):
   - Status: `APPROVED`
   - Tipo: `MONTHLY`, `ANNUAL` ou `LIFETIME`
   - Para `MONTHLY` e `ANNUAL`: `expires_at` deve ser maior que a data atual
   - Para `LIFETIME`: sempre ativo se aprovado

2. **Trials Ativos** (`user_trials`):
   - `is_active = true`
   - `expires_at` deve ser maior que a data atual

## 💻 Exemplo de Uso

### JavaScript/TypeScript

```javascript
const checkSubscription = async (userId, email) => {
  const response = await fetch('https://lwdigitalforge.com/functions/v1/check-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      email,
    }),
  });

  const data = await response.json();
  return data;
};

// Uso
const result = await checkSubscription(
  '550e8400-e29b-41d4-a716-446655440000',
  'usuario@exemplo.com'
);

if (result.hasAccess) {
  console.log('Usuário tem acesso!');
  if (result.isSubscriber) {
    console.log('Assinatura ativa até:', result.expiresAt);
  } else if (result.isTrial) {
    console.log('Trial ativo. Dias restantes:', result.daysRemaining);
  }
} else {
  console.log('Usuário não tem acesso');
}
```

### cURL

```bash
curl -X POST https://lwdigitalforge.com/functions/v1/check-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@exemplo.com"
  }'
```

## 🗄️ Estrutura de Banco de Dados

A função consulta as seguintes tabelas:

- **`profiles`**: Verifica se o usuário existe e o email corresponde
- **`user_purchases`**: Verifica assinaturas ativas
- **`user_trials`**: Verifica trials ativos

## 🔒 Segurança

- A função usa `SUPABASE_SERVICE_ROLE_KEY` para acessar o banco de dados
- Validação de entrada (userId e email obrigatórios)
- Validação de formato de email
- Verificação de correspondência entre userId e email

## ⚠️ Notas Importantes

1. **Performance**: A função faz múltiplas queries ao banco. Considere cachear resultados se necessário.
2. **Timeout**: Configure timeout adequado no cliente (recomendado: 5 segundos).
3. **Retry**: O cliente pode implementar retry automático em caso de erro.
4. **Fallback**: Em caso de erro, o acesso é negado por padrão (fail-safe).

## 🧪 Testes

Para testar a função localmente:

```bash
# Usando Supabase CLI
supabase functions serve check-subscription

# Testar com curl
curl -X POST http://localhost:54321/functions/v1/check-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "seu-user-id",
    "email": "seu-email@exemplo.com"
  }'
```

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- Código da função: `supabase/functions/check-subscription/index.ts`
- Especificação completa: Documentação da API

