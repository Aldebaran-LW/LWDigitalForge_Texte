# 🚀 Instruções de Deploy - check-subscription

## 📋 Pré-requisitos

1. **Supabase CLI instalado**
   ```bash
   npm install -g supabase
   ```

2. **Autenticação no Supabase**
   ```bash
   npx supabase login
   ```
   
   Ou configure a variável de ambiente:
   ```bash
   $env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
   ```

## 🎯 Opções de Deploy

### Opção 1: Script PowerShell (Recomendado)

```powershell
.\deploy-check-subscription.ps1
```

### Opção 2: Comando Direto

```bash
npx supabase functions deploy check-subscription
```

## ✅ Verificação Pós-Deploy

Após o deploy, teste a função:

```bash
npm run test:check-subscription:prod
```

## 🔗 URLs da Função

Após o deploy, a função estará disponível em:

- **Edge Function direta:**
  ```
  https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
  ```

- **Via proxy (se configurado):**
  ```
  https://lwdigitalforge.com/api/check-subscription
  ```

## 📝 Exemplo de Uso

```javascript
const response = await fetch(
  'https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      email: 'usuario@exemplo.com'
    })
  }
);

const data = await response.json();
console.log(data);
```

## 🔒 Segurança

A função usa automaticamente:
- `SUPABASE_URL` (configurado automaticamente)
- `SUPABASE_SERVICE_ROLE_KEY` (configurado automaticamente)

**Não é necessário configurar secrets adicionais!**

## 🐛 Troubleshooting

### Erro: "Access token not provided"

**Solução:**
```bash
npx supabase login
```

### Erro: "Function not found"

**Solução:** Certifique-se de estar no diretório raiz do projeto e que o arquivo existe:
```
supabase/functions/check-subscription/index.ts
```

### Erro: "Permission denied"

**Solução:** Verifique se você tem permissões no projeto Supabase.

## 📚 Documentação Completa

- **README:** `supabase/functions/check-subscription/README.md`
- **Guia de Testes:** `supabase/functions/check-subscription/TESTE.md`










