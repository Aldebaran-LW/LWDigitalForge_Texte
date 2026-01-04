# 🔔 Edge Function: mercadopago-webhook

Esta Edge Function recebe notificações do Mercado Pago sobre mudanças no status dos pagamentos e atualiza automaticamente os registros de compra no banco de dados.

## 📋 Funcionalidade

A função `mercadopago-webhook`:
1. ✅ Recebe notificações do Mercado Pago
2. ✅ Busca detalhes do pagamento na API do Mercado Pago
3. ✅ Identifica a compra através do `external_reference`
4. ✅ Atualiza o status da compra na tabela `user_purchases`
5. ✅ Calcula e atualiza `expires_at` para assinaturas aprovadas
6. ✅ Limpa `expires_at` para compras canceladas/reembolsadas

## 🚀 Como Configurar

### **1. Deploy da Função**

```bash
npx supabase functions deploy mercadopago-webhook
```

### **2. Configurar Webhook no Mercado Pago**

1. Acesse o [Painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá em **Suas integrações** → **Webhooks**
3. Adicione uma nova URL de webhook:
   ```
   https://seu-projeto.supabase.co/functions/v1/mercadopago-webhook
   ```
4. Selecione os eventos:
   - ✅ Pagamentos
   - ✅ Assinaturas (se aplicável)

### **3. Variáveis de Ambiente**

A função usa as mesmas variáveis da `create-checkout`:
- `MERCADOPAGO_ACCESS_TOKEN` (obrigatório)
- `SUPABASE_URL` (automático)
- `SUPABASE_SERVICE_ROLE_KEY` (automático)

## 📨 Formato da Notificação

O Mercado Pago envia notificações no seguinte formato:

```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

A função então busca os detalhes completos do pagamento na API do Mercado Pago.

## 🔄 Mapeamento de Status

| Status Mercado Pago | Status Sistema | Descrição |
|---------------------|----------------|-----------|
| `approved` | `APPROVED` | Pagamento aprovado |
| `cancelled`, `rejected` | `CANCELLED` | Pagamento cancelado/rejeitado |
| `refunded`, `charged_back` | `REFUNDED` | Pagamento reembolsado |
| `pending`, `in_process`, `in_mediation` | `PENDING` | Pagamento pendente |

## 🔐 Segurança

⚠️ **Importante**: Esta função não requer autenticação porque é chamada pelo Mercado Pago. No entanto, você deve:

1. **Validar a origem da requisição** (opcional, mas recomendado)
2. **Usar HTTPS** sempre
3. **Verificar o `external_reference`** antes de atualizar

Para maior segurança, você pode adicionar validação de IP ou token secreto:

```typescript
// Exemplo de validação de token (opcional)
const webhookSecret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");
const providedSecret = req.headers.get("X-Webhook-Secret");
if (webhookSecret && providedSecret !== webhookSecret) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
  });
}
```

## 🐛 Debug

Para testar localmente:

```bash
# Executar função localmente
npx supabase functions serve mercadopago-webhook

# Simular notificação do Mercado Pago
curl -X POST http://localhost:54321/functions/v1/mercadopago-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "1234567890"
    }
  }'
```

## 📚 Recursos

- [Mercado Pago Webhooks Docs](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Mercado Pago Payment API](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments_id/get)











