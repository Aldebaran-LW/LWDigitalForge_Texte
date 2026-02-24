# Edge Function: Create User

Esta Edge Function permite que administradores criem novos usuários diretamente pelo portal admin.

## Funcionalidades

- ✅ Cria usuários com email e senha
- ✅ Confirma email automaticamente (sem necessidade de verificação)
- ✅ Define nome completo e telefone (opcional)
- ✅ Define role (USER ou ADMIN)
- ✅ Validação de dados
- ✅ Verificação de permissões (apenas admins)

## Como Usar

### 1. Deploy da Edge Function

```bash
# Usando Supabase CLI
supabase functions deploy create-user

# Ou via MCP Supabase (se configurado)
```

### 2. Usar no Portal Admin

1. Acesse `/admin/usuarios`
2. Clique em "Criar Novo Usuário"
3. Preencha os dados:
   - Email (obrigatório)
   - Senha (mínimo 6 caracteres)
   - Nome Completo (opcional)
   - Telefone (opcional)
   - Tipo de Usuário (USER ou ADMIN)
4. Clique em "Criar Usuário"

## Endpoint

```
POST /functions/v1/create-user
```

### Headers
```
Authorization: Bearer {user_access_token}
Content-Type: application/json
```

### Body
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "full_name": "Nome do Usuário",
  "phone": "(00) 00000-0000",
  "role": "USER"
}
```

### Response (Sucesso)
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    ...
  },
  "message": "Usuário criado com sucesso"
}
```

### Response (Erro)
```json
{
  "error": "Mensagem de erro",
  "details": {...}
}
```

## Segurança

- ✅ Verifica se o usuário está autenticado
- ✅ Verifica se o usuário é ADMIN
- ✅ Usa Service Role Key apenas no servidor
- ✅ Valida dados de entrada
- ✅ Confirma email automaticamente (sem expor senha)

## Variáveis de Ambiente Necessárias

A Edge Function usa automaticamente:
- `SUPABASE_URL` (automático)
- `SUPABASE_SERVICE_ROLE_KEY` (automático)
