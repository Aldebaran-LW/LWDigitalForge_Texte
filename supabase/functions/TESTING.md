# 🧪 Guia de Testes - Integração Mercado Pago

Este guia explica como testar a integração completa com o Mercado Pago em ambiente sandbox.

## 📋 Pré-requisitos

1. Conta no Mercado Pago (pode ser conta de teste)
2. Credenciais de teste do Mercado Pago
3. Supabase CLI instalado
4. Projeto configurado localmente

## 🔑 Obter Credenciais de Teste

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Crie uma aplicação (ou use uma existente)
3. Vá em **Credenciais de teste**
4. Copie:
   - **Public Key** (começa com `TEST-`)
   - **Access Token** (começa com `TEST-`)

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente no Supabase

```bash
# Configurar Access Token (obrigatório)
npx supabase secrets set MERCADOPAGO_ACCESS_TOKEN=TEST-seu_access_token_aqui

# Configurar URL do site (opcional, para desenvolvimento local use ngrok)
npx supabase secrets set SITE_URL=https://seu-site.com
```

### 2. Configurar Variável no Frontend (.env)

```env
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-sua_public_key_aqui
```

### 3. Deploy das Edge Functions

```bash
# Deploy da função de checkout
npx supabase functions deploy create-checkout

# Deploy da função de webhook
npx supabase functions deploy mercadopago-webhook
```

## 🧪 Testando Localmente

### 1. Testar Checkout

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:5173 (ou a porta configurada)

3. Faça login na aplicação

4. Adicione um produto ao carrinho

5. Clique em "Finalizar Compra"

6. Use os cartões de teste do Mercado Pago:

   **Cartão Aprovado:**
   - Número: `5031 4332 1540 6351`
   - CVV: `123`
   - Nome: `APRO`
   - Validade: Qualquer data futura (ex: `11/25`)

   **Cartão Pendente:**
   - Número: `5031 4332 1540 6351`
   - CVV: `123`
   - Nome: `CONT`
   - Validade: Qualquer data futura

   **Cartão Rejeitado:**
   - Número: `5031 4332 1540 6351`
   - CVV: `123`
   - Nome: `CALL`
   - Validade: Qualquer data futura

### 2. Testar Webhook Localmente

Para testar o webhook localmente, você precisa expor sua máquina local:

#### Opção 1: Usar ngrok

```bash
# Instalar ngrok (se não tiver)
# https://ngrok.com/download

# Expor porta local
ngrok http 54321

# Copiar a URL gerada (ex: https://abc123.ngrok.io)
```

Depois, configure o webhook no Mercado Pago:
```
https://abc123.ngrok.io/functions/v1/mercadopago-webhook
```

#### Opção 2: Usar Supabase CLI com tunnel

```bash
# Iniciar Supabase localmente
npx supabase start

# Servir funções localmente
npx supabase functions serve mercadopago-webhook --env-file .env.local
```

### 3. Simular Notificação do Webhook

```bash
curl -X POST http://localhost:54321/functions/v1/mercadopago-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "1234567890"
    }
  }'
```

**Nota:** Substitua `1234567890` pelo ID real de um pagamento de teste criado no Mercado Pago.

## 🔍 Verificar Resultados

### 1. Verificar Compra no Banco de Dados

```sql
-- Ver compras recentes
SELECT 
  id,
  user_id,
  app_id,
  purchase_type,
  amount_paid,
  status,
  payment_id,
  expires_at,
  created_at
FROM user_purchases
ORDER BY created_at DESC
LIMIT 10;
```

### 2. Verificar Logs das Edge Functions

```bash
# Ver logs da função create-checkout
npx supabase functions logs create-checkout

# Ver logs da função webhook
npx supabase functions logs mercadopago-webhook
```

### 3. Verificar no Portal do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Suas integrações** → **Webhooks**
3. Verifique se as notificações estão sendo recebidas
4. Vá em **Pagamentos** para ver os pagamentos de teste

## 📊 Cenários de Teste

### ✅ Cenário 1: Pagamento Aprovado

1. Adicionar produto ao carrinho
2. Finalizar compra
3. Usar cartão de teste "APRO"
4. **Resultado esperado:**
   - Status muda para `APPROVED`
   - `expires_at` é calculado (se não for LIFETIME)
   - Usuário pode acessar o produto em `/portal/meus-produtos`

### ⏳ Cenário 2: Pagamento Pendente

1. Adicionar produto ao carrinho
2. Finalizar compra
3. Usar cartão de teste "CONT"
4. **Resultado esperado:**
   - Status permanece `PENDING`
   - Usuário vê mensagem de pagamento pendente
   - Webhook atualiza quando pagamento for processado

### ❌ Cenário 3: Pagamento Rejeitado

1. Adicionar produto ao carrinho
2. Finalizar compra
3. Usar cartão de teste "CALL"
4. **Resultado esperado:**
   - Status muda para `CANCELLED`
   - Usuário vê mensagem de erro
   - Não há acesso ao produto

### 🔄 Cenário 4: Reembolso

1. Ter um pagamento aprovado
2. Ir ao painel do Mercado Pago
3. Reembolsar o pagamento
4. **Resultado esperado:**
   - Webhook recebe notificação
   - Status muda para `REFUNDED`
   - `expires_at` é limpo
   - Acesso ao produto é revogado

## 🐛 Troubleshooting

### Problema: Webhook não está recebendo notificações

**Soluções:**
1. Verificar se a URL do webhook está correta no painel do Mercado Pago
2. Verificar se o webhook está acessível (não bloqueado por firewall)
3. Verificar logs da função: `npx supabase functions logs mercadopago-webhook`
4. Testar manualmente enviando uma requisição POST

### Problema: Status não está sendo atualizado

**Soluções:**
1. Verificar se `MERCADOPAGO_ACCESS_TOKEN` está configurado corretamente
2. Verificar se o `external_reference` está sendo passado corretamente
3. Verificar logs para erros
4. Verificar se a compra existe no banco de dados

### Problema: Checkout não abre

**Soluções:**
1. Verificar se o script do Mercado Pago está carregado no HTML
2. Verificar se `VITE_MERCADOPAGO_PUBLIC_KEY` está configurada
3. Verificar console do navegador para erros
4. Verificar se a função `create-checkout` retornou `preferenceId`

## 📚 Recursos Adicionais

- [Mercado Pago - Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integration-test/test-cards)
- [Mercado Pago - Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Supabase Functions - Logs](https://supabase.com/docs/guides/functions/logs)

## ✅ Checklist de Testes

- [ ] Checkout abre corretamente
- [ ] Pagamento aprovado atualiza status
- [ ] Pagamento pendente mostra mensagem correta
- [ ] Pagamento rejeitado mostra mensagem de erro
- [ ] Webhook recebe notificações
- [ ] Status é atualizado via webhook
- [ ] `expires_at` é calculado corretamente
- [ ] Usuário pode acessar produto após pagamento aprovado
- [ ] Reembolso revoga acesso
- [ ] Logs estão funcionando


