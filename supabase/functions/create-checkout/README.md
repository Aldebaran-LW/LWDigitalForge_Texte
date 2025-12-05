# 🛍️ Edge Function: create-checkout

Esta Edge Function gerencia a criação de sessões de checkout para compras de produtos.

## 📋 Funcionalidade

A função `create-checkout`:
1. ✅ Valida autenticação do usuário
2. ✅ Busca informações do produto
3. ✅ Calcula preço baseado no tipo de compra
4. ✅ Cria registro de compra pendente no banco
5. 🚧 **TODO:** Integrar com gateway de pagamento (Mercado Pago/Stripe)

## 🚀 Como Usar

### **Deploy da Função**

```bash
# Fazer deploy usando Supabase CLI
npx supabase functions deploy create-checkout
```

### **Requisição HTTP**

```javascript
// Exemplo de uso no frontend
const response = await fetch(
  'https://seu-projeto.supabase.co/functions/v1/create-checkout',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appId: 'uuid-do-produto',
      purchaseType: 'MONTHLY' // ou 'ANNUAL', 'LIFETIME'
    })
  }
);

const data = await response.json();
```

### **Parâmetros**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `appId` | UUID | ✅ | ID do produto |
| `purchaseType` | String | ✅ | Tipo: `MONTHLY`, `ANNUAL`, `LIFETIME` |

### **Resposta de Sucesso**

```json
{
  "success": true,
  "purchaseId": "uuid-da-compra",
  "message": "Compra criada com sucesso. Aguardando pagamento."
}
```

### **Erros Possíveis**

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| 401 | Autorização necessária | Token não fornecido |
| 401 | Usuário não autenticado | Token inválido |
| 400 | appId e purchaseType são obrigatórios | Parâmetros faltando |
| 404 | Produto não encontrado | appId inválido |
| 400 | Tipo de compra inválido | purchaseType inválido |
| 400 | Preço não disponível | Produto sem preço para o tipo |
| 500 | Erro interno | Erro no servidor |

## 🔐 Segurança

- ✅ Requer autenticação via JWT
- ✅ Valida usuário através do Supabase Auth
- ✅ CORS habilitado
- ✅ Service Role Key para operações privilegiadas

## 🔧 Variáveis de Ambiente

A função usa automaticamente:
- `SUPABASE_URL` - URL do projeto
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço

Estas são configuradas automaticamente pelo Supabase.

## 🚧 Próximos Passos

### **Integração com Gateway de Pagamento**

Para finalizar a implementação, você deve:

1. **Escolher um gateway:**
   - Mercado Pago (Brasil)
   - Stripe (Internacional)
   - Outro de sua preferência

2. **Adicionar SDK do gateway:**

```typescript
// Para Mercado Pago
import MercadoPago from "https://esm.sh/mercadopago@1.5.15";

// Para Stripe
import Stripe from "https://esm.sh/stripe@13.11.0";
```

3. **Criar sessão de checkout:**

```typescript
// Exemplo com Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'brl',
      product_data: {
        name: app.name,
        description: app.description,
      },
      unit_amount: amount, // valor em centavos
    },
    quantity: 1,
  }],
  mode: purchaseType === 'LIFETIME' ? 'payment' : 'subscription',
  success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${YOUR_DOMAIN}/cancel`,
  metadata: {
    purchase_id: purchase.id,
  },
});

return { checkout_url: session.url };
```

4. **Configurar webhook:**
   - Criar outra Edge Function para receber notificações do gateway
   - Atualizar status da compra quando pagamento for confirmado

## 📚 Recursos

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers)
- [Stripe Docs](https://stripe.com/docs)

## 🐛 Debug

Para testar localmente:

```bash
# Executar função localmente
npx supabase functions serve create-checkout

# Fazer requisição de teste
curl -i --location --request POST 'http://localhost:54321/functions/v1/create-checkout' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"appId":"uuid","purchaseType":"MONTHLY"}'
```

