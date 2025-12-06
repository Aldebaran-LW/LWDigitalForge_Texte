# 🛍️ Edge Function: create-checkout

Esta Edge Function gerencia a criação de sessões de checkout para compras de produtos.

## 📋 Funcionalidade

A função `create-checkout`:
1. ✅ Valida autenticação do usuário
2. ✅ Busca informações do produto
3. ✅ Calcula preço baseado no tipo de compra
4. ✅ Cria registro de compra pendente no banco
5. ✅ Integra com Mercado Pago para criar preferência de pagamento
6. ✅ Retorna preferenceId para o frontend abrir o checkout

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
  "preferenceId": "1234567890-abc-def-ghi"
}
```

O `preferenceId` deve ser usado no frontend para abrir o checkout do Mercado Pago:

```javascript
const mercadopago = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
mercadopago.checkout({ preference: { id: data.preferenceId } });
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
- `SUPABASE_URL` - URL do projeto (configurado automaticamente)
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (configurado automaticamente)

**Variáveis que você precisa configurar no Supabase:**

1. **MERCADOPAGO_ACCESS_TOKEN** (obrigatório)
   - Acesse: Supabase Dashboard → Project Settings → Edge Functions → Secrets
   - Adicione: `MERCADOPAGO_ACCESS_TOKEN` com seu Access Token do Mercado Pago
   - O token geralmente começa com `APP_USR-` (produção) ou `TEST-` (sandbox)

2. **SITE_URL** (opcional)
   - URL base do seu site para as URLs de retorno do checkout
   - Padrão: `https://seu-site.com` (se não configurado)
   - Exemplo: `https://lwdigitalforge.com`

**Como configurar no Supabase CLI:**
```bash
npx supabase secrets set MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
npx supabase secrets set SITE_URL=https://seu-site.com
```

## ✅ Integração com Mercado Pago

A integração com Mercado Pago está **completa**! A função:

1. ✅ Cria preferência de pagamento no Mercado Pago
2. ✅ Vincula o pagamento ao registro `user_purchases` via `external_reference`
3. ✅ Configura URLs de retorno (success, failure, pending)
4. ✅ Retorna `preferenceId` para o frontend

### **Integração Completa**

✅ **Webhook implementado:** `supabase/functions/mercadopago-webhook`
- Recebe notificações do Mercado Pago
- Atualiza status das compras automaticamente
- Calcula `expires_at` para assinaturas

✅ **Página de Sucesso:** `src/pages/SuccessPage.jsx`
- Verifica status do pagamento
- Mostra mensagens apropriadas (aprovado, pendente, rejeitado)
- Redireciona para produtos após pagamento aprovado

📚 **Documentação de Testes:** Veja `supabase/functions/TESTING.md` para guia completo de testes em sandbox.

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



