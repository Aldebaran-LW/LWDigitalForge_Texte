# 🧪 Guia de Testes - check-subscription

## 📋 Pré-requisitos

1. **Supabase CLI instalado**
   ```bash
   npm install -g supabase
   ```

2. **Variáveis de ambiente configuradas** (opcional)
   - Crie um arquivo `.env` na raiz do projeto com:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

## 🚀 Como Testar

### Opção 1: Teste Automatizado (Recomendado)

1. **Inicie a Edge Function localmente:**
   ```bash
   npx supabase functions serve check-subscription
   ```

2. **Em outro terminal, execute o script de teste:**
   ```bash
   npm run test:check-subscription
   ```
   
   Ou diretamente:
   ```bash
   node scripts/test-check-subscription.js
   ```

### Opção 2: Teste Manual com cURL

1. **Inicie a Edge Function:**
   ```bash
   npx supabase functions serve check-subscription
   ```

2. **Teste com cURL:**
   ```bash
   # Teste básico
   curl -X POST http://localhost:54321/functions/v1/check-subscription \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "550e8400-e29b-41d4-a716-446655440000",
       "email": "usuario@exemplo.com"
     }'
   
   # Teste de validação (deve retornar 400)
   curl -X POST http://localhost:54321/functions/v1/check-subscription \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "",
       "email": "test@test.com"
     }'
   ```

### Opção 3: Teste em Produção

Após fazer o deploy:

```bash
# Deploy
npx supabase functions deploy check-subscription

# Teste
curl -X POST https://seu-projeto.supabase.co/functions/v1/check-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "seu-user-id",
    "email": "seu-email@exemplo.com"
  }'
```

## ✅ Cenários de Teste

O script automatizado testa:

1. ✅ **Validação de entrada**
   - `userId` ausente → deve retornar 400
   - `email` ausente → deve retornar 400
   - `email` inválido → deve retornar 400

2. ✅ **Usuário não encontrado**
   - Usuário inexistente → deve retornar `hasAccess: false`

3. ✅ **Estrutura da resposta**
   - Campos obrigatórios presentes
   - Tipos corretos

4. ✅ **Lógica de acesso**
   - `hasAccess = isSubscriber || isTrial`
   - Status correto baseado nas condições

5. ✅ **Verificação de dados reais**
   - Assinaturas ativas
   - Trials ativos
   - Cálculo de dias restantes

## 📊 Exemplo de Saída do Teste

```
============================================================
🚀 TESTE DA EDGE FUNCTION: check-subscription
============================================================

🧪 Teste: Conexão com Edge Function
────────────────────────────────────────────────────────────
ℹ️  Tentando conectar em: http://localhost:54321/functions/v1/check-subscription
✅ Conexão estabelecida com sucesso

🧪 Teste: Validação: userId ausente
────────────────────────────────────────────────────────────
✅ Retornou 400 Bad Request
ℹ️  Mensagem: userId e email são obrigatórios

🧪 Teste: Validação: email ausente
────────────────────────────────────────────────────────────
✅ Retornou 400 Bad Request
ℹ️  Mensagem: userId e email são obrigatórios

...

============================================================
📊 RESUMO DOS TESTES
============================================================
✅ Passou: 8
❌ Falhou: 0
⏭️  Pulado: 0
============================================================

✅ 🎉 Todos os testes passaram!
```

## 🔧 Troubleshooting

### Erro: "ECONNREFUSED" ou "fetch failed"

**Problema:** A Edge Function não está rodando.

**Solução:**
```bash
# Certifique-se de que a função está rodando
npx supabase functions serve check-subscription

# Verifique se está na porta correta (54321)
```

### Erro: "Cannot find module"

**Problema:** Dependências não instaladas.

**Solução:**
```bash
npm install
```

### Erro: "Permission denied" ou RLS bloqueando

**Problema:** A função usa SERVICE_ROLE_KEY, então não deve ter problemas de RLS.

**Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente no Supabase Dashboard.

## 📝 Notas

- O script de teste usa a URL local por padrão (`http://localhost:54321`)
- Para testar em produção, configure a variável `EDGE_FUNCTION_URL`:
  ```bash
  EDGE_FUNCTION_URL=https://seu-projeto.supabase.co/functions/v1/check-subscription \
  npm run test:check-subscription
  ```
- Os testes são não-destrutivos (apenas leitura)
- O script busca um usuário real do banco para testes mais completos

