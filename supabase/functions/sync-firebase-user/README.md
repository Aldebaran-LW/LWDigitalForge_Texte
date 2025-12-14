# Edge Function: Sincronizar Usuário para Firebase

Esta Edge Function sincroniza usuários criados no Supabase com o Firebase Auth.

## Configuração

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Supabase Dashboard:

- `FIREBASE_PROJECT_ID`: ID do projeto Firebase
- `FIREBASE_PRIVATE_KEY`: Chave privada do Firebase Admin SDK (formato JSON)
- `FIREBASE_CLIENT_EMAIL`: Email da conta de serviço do Firebase

### 2. Webhook no Supabase

Configure um webhook que chame esta função quando um novo usuário for criado:

1. Acesse o Supabase Dashboard
2. Vá em Database > Webhooks
3. Crie um novo webhook:
   - **Name**: sync-firebase-user
   - **Table**: auth.users
   - **Events**: INSERT
   - **HTTP Request**: POST
   - **URL**: `https://[seu-projeto].supabase.co/functions/v1/sync-firebase-user`
   - **HTTP Headers**: 
     ```
     Authorization: Bearer [SUPABASE_ANON_KEY]
     Content-Type: application/json
     ```

### 3. Deploy da Função

```bash
supabase functions deploy sync-firebase-user
```

## Notas

- Esta função atualmente apenas registra a sincronização. Para sincronização completa, você precisará:
  1. Configurar Firebase Admin SDK no Deno, ou
  2. Usar a REST API do Firebase Auth com token de acesso válido
  3. Implementar a criação de usuário no Firebase

- A sincronização também pode ser feita no frontend quando o usuário faz login/cadastro, que é a abordagem atual implementada.
