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

### ✅ Verificação de Assinatura

A função implementa **verificação de assinatura HMAC-SHA256** para garantir que as requisições realmente vêm do Mercado Pago:

1. **Verifica o header `x-signature`** se presente
2. **Calcula HMAC-SHA256** do corpo da requisição usando o `MERCADOPAGO_ACCESS_TOKEN` como chave secreta
3. **Compara as assinaturas** usando comparação timing-safe
4. **Rejeita requisições** com assinatura inválida (status 401)

**Comportamento:**
- ✅ Se o header `x-signature` estiver presente, a assinatura é verificada
- ⚠️ Se o header não estiver presente, a requisição é processada normalmente (compatibilidade)
- ✅ Logs indicam quando a assinatura é verificada ou quando não está presente

### 🔒 Outras Medidas de Segurança

1. **Validação do `external_reference`** antes de atualizar compras
2. **Verificação idempotente** através da API do Mercado Pago (busca detalhes do pagamento)
3. **Uso de HTTPS** sempre (obrigatório em produção)
4. **Service Role Key** usado apenas no servidor (nunca exposto ao cliente)

### 📝 Notas

- A verificação de assinatura usa o `MERCADOPAGO_ACCESS_TOKEN` como chave secreta
- Se o Mercado Pago não enviar o header `x-signature`, a função ainda processa a requisição para manter compatibilidade
- Logs indicam quando a verificação de assinatura é executada com sucesso

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












