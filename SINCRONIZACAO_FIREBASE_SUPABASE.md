# 🔄 Sincronização Bidirecional: Firebase Auth ↔ Supabase Auth

Este documento explica como funciona a sincronização bidirecional entre Firebase Auth e Supabase Auth implementada no projeto.

## 📋 Visão Geral

A sincronização garante que quando um usuário é cadastrado em um sistema (Supabase ou Firebase), ele também seja automaticamente cadastrado no outro sistema, mantendo as bases de usuários sincronizadas.

## 🎯 Fluxos de Sincronização

### 1. Cadastro no Supabase (Email/Senha)

**Fluxo:**
```
Usuário preenche formulário → Supabase Auth cria usuário → 
Frontend chama syncSupabaseToFirebase() → Firebase Auth cria usuário
```

**Onde acontece:**
- `src/contexts/SupabaseAuthContext.jsx` - Função `signUp()`
- `src/lib/syncFirebaseSupabase.js` - Função `syncSupabaseToFirebase()`

### 2. Login no Supabase (Email/Senha)

**Fluxo:**
```
Usuário faz login → Supabase Auth autentica → 
Frontend verifica se existe no Firebase → Sincroniza se necessário
```

**Onde acontece:**
- `src/contexts/SupabaseAuthContext.jsx` - Função `signIn()`

### 3. Login/Cadastro com Google OAuth (Supabase)

**Fluxo:**
```
Usuário clica "Login com Google" → Supabase OAuth → 
Google autentica → Supabase cria/atualiza usuário → 
AuthCallback chama syncGoogleOAuthToFirebase() → Sincroniza com Firebase
```

**Onde acontece:**
- `src/pages/AuthCallback.jsx` - Após processar callback do Google
- `src/lib/syncFirebaseSupabase.js` - Função `syncGoogleOAuthToFirebase()`

### 4. Cadastro/Login no Firebase

**Fluxo:**
```
Usuário se cadastra no Firebase → Firebase Auth cria usuário → 
Listener do Firebase detecta → Frontend chama syncFirebaseToSupabase() → 
Supabase cria/atualiza usuário
```

**Onde acontece:**
- `src/lib/syncFirebaseSupabase.js` - Função `setupFirebaseAuthListener()`
- `src/lib/syncFirebaseSupabase.js` - Função `syncFirebaseToSupabase()`

## 🔧 Configuração

### Passo 1: Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Authentication** > **Get Started**
4. Habilite **Email/Password** e **Google** como provedores
5. Vá em **Project Settings** > **General**
6. Copie as credenciais do Firebase (Config do SDK)

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou configure no seu ambiente de deploy):

```env
# Supabase (já configurado)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# Firebase (novo)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Passo 3: Aplicar Migration do Banco de Dados

Execute a migration que adiciona suporte à sincronização:

```bash
# Via Supabase CLI
supabase migration up

# Ou via Dashboard do Supabase
# Vá em SQL Editor e execute o arquivo:
# supabase/migrations/20250106000000_add_firebase_sync_support.sql
```

### Passo 4: (Opcional) Configurar Edge Function

Se quiser sincronização automática via webhook:

1. Configure as variáveis de ambiente da Edge Function no Supabase Dashboard:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY` (chave privada do Firebase Admin SDK)
   - `FIREBASE_CLIENT_EMAIL`

2. Faça deploy da Edge Function:
   ```bash
   supabase functions deploy sync-firebase-user
   ```

3. Configure um webhook no Supabase Dashboard:
   - Database > Webhooks
   - Table: `auth.users`
   - Event: `INSERT`
   - URL: `https://[seu-projeto].supabase.co/functions/v1/sync-firebase-user`

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   ├── firebaseClient.js          # Configuração do Firebase
│   └── syncFirebaseSupabase.js    # Lógica de sincronização
├── contexts/
│   └── SupabaseAuthContext.jsx    # Contexto de autenticação (modificado)
└── pages/
    └── AuthCallback.jsx           # Callback do Google OAuth (modificado)

supabase/
├── functions/
│   └── sync-firebase-user/        # Edge Function para sincronização
│       ├── index.ts
│       └── README.md
└── migrations/
    └── 20250106000000_add_firebase_sync_support.sql
```

## 🔍 Como Funciona a Sincronização

### Sincronização Supabase → Firebase

1. **Cadastro com Email/Senha:**
   - Usuário se cadastra no Supabase
   - Após sucesso, `signUp()` chama `syncSupabaseToFirebase()`
   - Função verifica se usuário existe no Firebase
   - Se não existir, cria usando `createUserWithEmailAndPassword()`
   - Atualiza perfil do Firebase com dados do Supabase

2. **Login com Google OAuth:**
   - Usuário faz login com Google via Supabase
   - `AuthCallback` processa o retorno
   - Chama `syncGoogleOAuthToFirebase()`
   - Sincronização é feita (pode requerer Edge Function para OAuth completo)

### Sincronização Firebase → Supabase

1. **Listener Automático:**
   - `setupFirebaseAuthListener()` configura um listener
   - Quando usuário faz login no Firebase, detecta automaticamente
   - Chama `syncFirebaseToSupabase()` para criar/atualizar no Supabase

2. **Cadastro no Firebase:**
   - Usuário se cadastra diretamente no Firebase
   - Listener detecta e sincroniza com Supabase
   - Cria perfil no Supabase usando `signUp()` ou atualiza existente

## ⚠️ Considerações Importantes

### 1. Sincronização Não-Bloqueante

A sincronização é **não-bloqueante**: se falhar, não impede o cadastro/login do usuário no sistema principal. Isso garante que a experiência do usuário não seja afetada por problemas de sincronização.

### 2. Senhas

- **Supabase → Firebase:** A senha é passada durante o cadastro e usada para criar o usuário no Firebase
- **Firebase → Supabase:** Se o usuário se cadastrar diretamente no Firebase, não temos acesso à senha. Nesse caso, o usuário precisará usar "Esqueci minha senha" no Supabase ou fazer login apenas via Firebase

### 3. OAuth (Google)

Para sincronização completa de OAuth, pode ser necessário:
- Configurar Edge Function com Firebase Admin SDK
- Ou usar abordagem híbrida onde ambos os sistemas usam o mesmo provedor OAuth

### 4. Duplicação

O sistema verifica se o usuário já existe antes de criar, evitando duplicações:
- Verifica por email em ambos os sistemas
- Usa `ON CONFLICT` no Supabase para atualizar em vez de criar duplicado

## 🧪 Testando a Sincronização

### Teste 1: Cadastro no Supabase

1. Acesse a página de cadastro
2. Preencha o formulário e cadastre-se
3. Verifique no console do navegador: deve aparecer "✅ Usuário sincronizado do Supabase para Firebase"
4. Verifique no Firebase Console: usuário deve aparecer em Authentication

### Teste 2: Login com Google (Supabase)

1. Clique em "Login com Google"
2. Autentique com sua conta Google
3. Verifique no console: mensagem de sincronização
4. Verifique no Firebase Console: usuário deve aparecer

### Teste 3: Cadastro no Firebase

1. Use o Firebase Console ou crie um formulário de cadastro Firebase
2. Cadastre um novo usuário
3. Verifique no console do navegador: listener deve detectar e sincronizar
4. Verifique no Supabase Dashboard: usuário deve aparecer em Authentication

## 🐛 Troubleshooting

### Firebase não está sincronizando

- Verifique se as variáveis de ambiente estão configuradas
- Verifique o console do navegador para erros
- Certifique-se de que o Firebase está inicializado (`firebaseClient.js`)

### Erro "Firebase não configurado"

- Configure as variáveis de ambiente `VITE_FIREBASE_*`
- Reinicie o servidor de desenvolvimento
- Verifique se o arquivo `.env` está na raiz do projeto

### Usuário duplicado

- O sistema deve evitar duplicações automaticamente
- Se ocorrer, verifique se a verificação de existência está funcionando
- Considere adicionar validação adicional

### Sincronização lenta

- A sincronização é assíncrona e não bloqueia a UI
- Se estiver muito lenta, verifique a conexão de internet
- Considere fazer a sincronização em background após o cadastro

## 📚 Referências

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## ✅ Checklist de Implementação

- [x] Instalar Firebase SDK
- [x] Criar `firebaseClient.js`
- [x] Criar `syncFirebaseSupabase.js`
- [x] Modificar `SupabaseAuthContext.jsx`
- [x] Modificar `AuthCallback.jsx`
- [x] Criar migration do banco de dados
- [x] Criar Edge Function (opcional)
- [x] Documentação completa
- [ ] Configurar variáveis de ambiente
- [ ] Testar cadastro Supabase → Firebase
- [ ] Testar login Google → Firebase
- [ ] Testar cadastro Firebase → Supabase
- [ ] Configurar webhook (opcional)

---

**Última atualização:** 2025-01-06
