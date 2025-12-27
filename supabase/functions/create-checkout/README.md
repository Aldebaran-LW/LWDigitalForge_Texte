# 🔔 Edge Function: create-checkout

Esta Edge Function cria sessões de checkout do Mercado Pago para produtos/apps registrados.

## 📋 Funcionalidade

A função `create-checkout`:
1. ✅ Valida autenticação do usuário
2. ✅ Busca informações do produto/app
3. ✅ Determina preço baseado no tipo de compra (MONTHLY, ANNUAL, LIFETIME)
4. ✅ Cria preferência de pagamento no Mercado Pago
5. ✅ Registra a compra como PENDING na tabela `user_purchases`
6. ✅ Retorna o `preferenceId` para abrir o checkout

## 🚀 Como Deployar

```bash
npx supabase functions deploy create-checkout
```

## 🔐 Variáveis de Ambiente (Secrets)

Configure no Supabase Dashboard → Project Settings → Edge Functions → Secrets:

- `MERCADOPAGO_ACCESS_TOKEN` (obrigatório) - Token de acesso do Mercado Pago
- `SUPABASE_URL` (automático)
- `SUPABASE_SERVICE_ROLE_KEY` (automático)

## 📨 Formato da Requisição

```json
{
  "appId": "uuid-do-produto",
  "purchaseType": "MONTHLY" | "ANNUAL" | "LIFETIME"
}
```

**Headers:**
```
Authorization: Bearer <token-do-usuario>
```

## 📤 Formato da Resposta

```json
{
  "preferenceId": "1234567890-abc-def-ghi",
  "purchaseId": "uuid-da-compra",
  "message": "Checkout criado com sucesso"
}
```

## 🔄 Fluxo

1. Usuário clica em "Finalizar Compra"
2. Frontend chama `supabase.functions.invoke('create-checkout')`
3. Edge Function cria preferência no Mercado Pago
4. Edge Function registra compra como PENDING
5. Frontend recebe `preferenceId` e abre checkout do Mercado Pago
6. Usuário completa pagamento
7. Webhook `mercadopago-webhook` atualiza status da compra

## 🐛 Debug

Para testar localmente:

```bash
# Executar função localmente
npx supabase functions serve create-checkout

# Simular requisição
curl -X POST http://localhost:54321/functions/v1/create-checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "uuid-do-produto",
    "purchaseType": "LIFETIME"
  }'
```

