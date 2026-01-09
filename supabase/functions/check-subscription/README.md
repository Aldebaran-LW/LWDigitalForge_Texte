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
  "email": "usuario@exemplo.com",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
}
```

**⚠️ IMPORTANTE**: A função agora verifica acesso **específico ao app** (sistema híbrido).

### Campos Obrigatórios
- `userId` (string, UUID): ID único do usuário no Supabase Auth
- `email` (string, email): Email do usuário autenticado
- `appId` ou `productId` (string, UUID): **OBRIGATÓRIO** - ID do app para verificar acesso específico

## 📥 Response (Resposta)

### Status Codes

- `200 OK` - Requisição bem-sucedida
- `400 Bad Request` - Dados inválidos (userId, email ou appId ausentes)
- `500 Internal Server Error` - Erro no servidor

### Response Body (Sucesso - 200)

#### Usuário com Assinatura Ativa para o App Específico
```json
{
  "hasAccess": true,
  "isSubscriber": true,
  "isTrial": false,
  "subscriptionStatus": "active",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "appName": "JornadaPro",
  "appSlug": "jornadapro",
  "purchaseType": "LIFETIME",
  "expiresAt": null
}
```

#### Usuário em Período de Teste para o App Específico
```json
{
  "hasAccess": true,
  "isSubscriber": false,
  "isTrial": true,
  "subscriptionStatus": "trial",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "appName": "JornadaPro",
  "appSlug": "jornadapro",
  "trialExpiresAt": "2024-01-15T23:59:59Z",
  "daysRemaining": 7
}
```

#### Usuário sem Acesso ao App Específico
```json
{
  "hasAccess": false,
  "isSubscriber": false,
  "isTrial": false,
  "subscriptionStatus": "none",
  "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432",
  "appName": "JornadaPro",
  "appSlug": "jornadapro",
  "message": "Usuário não tem acesso ao app \"JornadaPro\" (ID: e8ff7872-dedb-405c-bf8a-f7901ac4b432)"
}
```

### Response Body (Erro - 400)
```json
{
  "error": "Bad Request",
  "message": "appId ou productId é obrigatório para verificar acesso ao app específico"
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
| `hasAccess` | boolean | **Obrigatório** - Indica se o usuário tem acesso ao app específico (true se `isSubscriber` OU `isTrial` for true) |
| `isSubscriber` | boolean | **Obrigatório** - Indica se o usuário tem assinatura ativa para o app específico |
| `isTrial` | boolean | **Obrigatório** - Indica se o usuário está em período de teste para o app específico |
| `subscriptionStatus` | string | Status da assinatura: `"active"`, `"trial"`, `"none"` |
| `appId` | string (UUID) | **Obrigatório** - ID do app verificado |
| `appName` | string | Nome do app verificado |
| `appSlug` | string | Slug do app (se disponível) |
| `purchaseType` | string | Tipo de compra: `"MONTHLY"`, `"ANNUAL"`, `"LIFETIME"` (se aplicável) |
| `expiresAt` | string (ISO 8601) | Data de expiração da assinatura (se aplicável, null para LIFETIME) |
| `trialExpiresAt` | string (ISO 8601) | Data de expiração do teste (se aplicável) |
| `daysRemaining` | number | Dias restantes no período de teste (se aplicável) |
| `message` | string | Mensagem adicional (opcional) |

## 🔐 Lógica de Acesso (Sistema Híbrido)

⚠️ **IMPORTANTE**: A função agora verifica acesso **específico ao app** (sistema híbrido).

O sistema considera que o usuário tem acesso se:
- `hasAccess === true` **E** o acesso é **para o app específico informado**
- `isSubscriber === true` **E** a assinatura é **para o app específico**
- `isTrial === true` **E** o trial é **para o app específico**

**Exemplo**: Se o usuário tem acesso ao JornadaPro mas não ao App de Vendas, ele será **bloqueado** ao tentar acessar o App de Vendas, mesmo tendo JornadaPro.

### Verificação de Assinatura por App

A função verifica:
1. **App Existe e Está Ativo**: Verifica se o `appId` existe na tabela `registered_apps` e está ativo
2. **Assinaturas Ativas para o App Específico** (`user_purchases`):
   - Status: `APPROVED`
   - `app_id` = `appId` fornecido (filtro específico)
   - Tipo: `MONTHLY`, `ANNUAL` ou `LIFETIME`
   - Para `MONTHLY` e `ANNUAL`: `expires_at` deve ser maior que a data atual
   - Para `LIFETIME`: sempre ativo se aprovado

3. **Trials Ativos para o App Específico** (`user_trials`):
   - `app_id` = `appId` fornecido (filtro específico)
   - `is_active = true`
   - `expires_at` deve ser maior que a data atual

## 💻 Exemplo de Uso

### JavaScript/TypeScript

```javascript
const checkSubscription = async (userId, email, appId) => {
  const response = await fetch('https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      email,
      appId, // OBRIGATÓRIO - ID do app específico
    }),
  });

  const data = await response.json();
  return data;
};

// Uso
const result = await checkSubscription(
  '550e8400-e29b-41d4-a716-446655440000',
  'usuario@exemplo.com',
  'e8ff7872-dedb-405c-bf8a-f7901ac4b432' // ID do JornadaPro
);

if (result.hasAccess) {
  console.log(`Usuário tem acesso ao app: ${result.appName}`);
  if (result.isSubscriber) {
    console.log(`Tipo: ${result.purchaseType}`);
    if (result.expiresAt) {
      console.log('Expira em:', result.expiresAt);
    } else {
      console.log('Acesso vitalício!');
    }
  } else if (result.isTrial) {
    console.log(`Trial ativo. Dias restantes: ${result.daysRemaining}`);
    console.log('Expira em:', result.trialExpiresAt);
  }
} else {
  console.log(`Usuário não tem acesso ao app: ${result.appName}`);
  console.log(result.message);
}
```

### cURL

```bash
curl -X POST https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@exemplo.com",
    "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
  }'
```

## 🗄️ Estrutura de Banco de Dados

A função consulta as seguintes tabelas:

- **`profiles`**: Verifica se o usuário existe e o email corresponde
- **`registered_apps`**: Verifica se o app existe e está ativo
- **`user_purchases`**: Verifica assinaturas ativas **para o app específico** (filtro por `app_id`)
- **`user_trials`**: Verifica trials ativos **para o app específico** (filtro por `app_id`)

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
# Usando Supabase CLI (com npx)
npx supabase functions serve check-subscription

# Testar com curl
curl -X POST http://localhost:54321/functions/v1/check-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "seu-user-id",
    "email": "seu-email@exemplo.com",
    "appId": "e8ff7872-dedb-405c-bf8a-f7901ac4b432"
  }'
```

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- Código da função: `supabase/functions/check-subscription/index.ts`
- Especificação completa: Documentação da API

