# 👥 Edge Function: get-all-users

Esta Edge Function lista todos os usuários do sistema. **Apenas administradores podem acessar.**

## 📋 Funcionalidade

A função `get-all-users`:
1. ✅ Valida autenticação do usuário
2. ✅ Verifica se o usuário é ADMIN
3. ✅ Lista todos os usuários do sistema
4. ✅ Retorna dados completos dos usuários

## 🔐 Segurança

- ⚠️ **Apenas usuários com role "ADMIN" podem acessar**
- ✅ Usa Service Role Key para buscar usuários
- ✅ Valida token de autenticação

## 🚀 Como Deployar

```bash
npx supabase functions deploy get-all-users
```

## 📨 Formato da Requisição

**Headers:**
```
Authorization: Bearer <token-do-admin>
```

**Método:** GET

## 📤 Formato da Resposta

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "email_confirmed_at": "2025-01-01T00:00:00Z",
      "user_metadata": { ... },
      "app_metadata": { ... },
      ...
    }
  ]
}
```

## 🐛 Debug

Para testar localmente:

```bash
# Executar função localmente
npx supabase functions serve get-all-users

# Simular requisição
curl -X GET http://localhost:54321/functions/v1/get-all-users \
  -H "Authorization: Bearer <token-do-admin>"
```

