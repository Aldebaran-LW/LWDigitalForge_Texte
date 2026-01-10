# 🔑 MERCADOPAGO_ACCESS_TOKEN - Guia Completo

## 📋 O que é?

O `MERCADOPAGO_ACCESS_TOKEN` é uma **chave privada** do Mercado Pago usada para:
- ✅ Processar webhooks (notificações de pagamento)
- ✅ Buscar detalhes de pagamentos no servidor
- ✅ Atualizar status de compras automaticamente

## 🔒 Segurança

**IMPORTANTE:**
- ❌ **NÃO** tem prefixo `VITE_` (é privada)
- ✅ Usada apenas em **Edge Functions** (servidor)
- ✅ **NÃO** é exposta ao navegador
- ✅ Deve ser configurada como **SECRET** no Supabase

---

## ⚠️ É Necessária?

### ✅ SIM, se você:
- Quer receber notificações automáticas de pagamento
- Quer atualizar status de compras automaticamente
- Quer processar webhooks do Mercado Pago

### ❌ NÃO, se você:
- Apenas inicia o checkout (usa apenas a chave pública)
- Não precisa de atualizações automáticas de status
- Processa pagamentos manualmente

---

## 📍 Onde Configurar?

### ⚠️ IMPORTANTE: NÃO configure na Vercel!

O `MERCADOPAGO_ACCESS_TOKEN` é usado pela **Edge Function do Supabase**, então deve ser configurado como **SECRET** no Supabase, não na Vercel.

---

## 🔧 Como Configurar

### Passo 1: Obter o Access Token

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login na sua conta
3. Vá em: **Suas integrações** → Selecione sua aplicação
4. Vá em: **Credenciais de produção** (ou teste)
5. Encontre: **Access Token**
6. Clique em **Revelar** para ver o token completo
7. Copie o token (formato: `APP_USR-...` ou `TEST-...`)

### Passo 2: Configurar no Supabase

**Opção 1: Via Supabase Dashboard (Recomendado)**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Project Settings** → **Edge Functions** → **Secrets**
4. Clique em **Add new secret**
5. Configure:
   - **Name:** `MERCADOPAGO_ACCESS_TOKEN`
   - **Value:** Cole o token que você copiou
6. Clique em **Save**

**Opção 2: Via Supabase CLI**

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar projeto
supabase link --project-ref wwwwwyuwighdehmvnolrl

# Configurar secret
supabase secrets set MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
```

**Opção 3: Via Script PowerShell**

Use o script `deploy-edge-function.ps1` que já está no projeto:

```powershell
.\deploy-edge-function.ps1
```

---

## 🧪 Como Testar

### 1. Verificar se está configurado

Na Edge Function `mercadopago-webhook`, o código verifica:

```typescript
const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
if (!accessToken) {
  console.error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  return new Response(/* erro */);
}
```

### 2. Testar Webhook

1. Faça um pagamento de teste
2. Verifique os logs da Edge Function no Supabase Dashboard
3. Verifique se o status da compra foi atualizado

---

## 📊 Onde é Usada?

### Arquivo: `supabase/functions/mercadopago-webhook/index.ts`

```typescript
// Linha 56-66
const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
if (!accessToken) {
  console.error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  return new Response(
    JSON.stringify({ error: "Configuração de pagamento não disponível" }),
    { status: 500 }
  );
}

const client = new MercadoPagoConfig({ accessToken });
const payment = new Payment(client);
```

**Função:**
- Busca detalhes do pagamento no Mercado Pago
- Atualiza status da compra no banco de dados
- Processa reembolsos e cancelamentos

---

## ⚠️ Diferença entre Chaves

| Chave | Tipo | Onde Usa | Onde Configurar |
|-------|------|----------|-----------------|
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Pública | Frontend (navegador) | Vercel (variável de ambiente) |
| `MERCADOPAGO_ACCESS_TOKEN` | Privada | Edge Function (servidor) | Supabase (secret) |

---

## 🔍 Verificar Status Atual

### Na Vercel:
- ❌ Não precisa estar configurada (não é usada lá)
- ✅ Está vazia? Isso é normal!

### No Supabase:
1. Acesse: Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. Verifique se `MERCADOPAGO_ACCESS_TOKEN` existe
3. Se não existir, configure seguindo os passos acima

---

## ✅ Checklist

- [ ] Obteve o Access Token no painel do Mercado Pago
- [ ] Configurou como SECRET no Supabase (não na Vercel)
- [ ] Testou a Edge Function
- [ ] Verificou se os webhooks estão funcionando

---

## 🆘 Problemas Comuns

### Problema: Webhook não funciona
**Solução:**
- Verifique se o secret está configurado no Supabase
- Verifique os logs da Edge Function
- Verifique se a URL do webhook está configurada no Mercado Pago

### Problema: Token inválido
**Solução:**
- Verifique se copiou o token completo
- Verifique se está usando o token de produção (não teste)
- Gere um novo token se necessário

### Problema: Não sei onde configurar
**Solução:**
- **NÃO** configure na Vercel
- Configure no **Supabase Dashboard** → Secrets
- Ou use o Supabase CLI

---

## 📝 Resumo

**Status Atual:**
- ⚠️ `MERCADOPAGO_ACCESS_TOKEN` está vazia na Vercel (isso é OK!)
- ❓ Precisa ser configurada no **Supabase** como SECRET

**Ação Necessária:**
1. Obter token no painel do Mercado Pago
2. Configurar como SECRET no Supabase
3. Testar webhook

**Não é urgente se:**
- Você não está usando webhooks ainda
- Processa pagamentos manualmente
- Apenas inicia o checkout (usa apenas chave pública)















