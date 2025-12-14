# 🚀 Configuração Rápida do Firebase - LW Digital Forge

## ✅ Credenciais Já Fornecidas

Você já tem:
- ✅ **API Key**: `AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ`
- ✅ **OAuth Client ID**: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com`
- ✅ **Messaging Sender ID**: `469330532024` (extraído do Client ID)

## 📋 O Que Falta Configurar

Você precisa obter do Firebase Console:
1. **Auth Domain** (ex: `lwdigitalforge-577c4.firebaseapp.com`)
2. **Project ID** (ex: `lwdigitalforge-577c4`)
3. **Storage Bucket** (ex: `lwdigitalforge-577c4.appspot.com`)
4. **App ID** (ex: `1:469330532024:web:abc123def456`)

## 🔧 Passo a Passo Rápido

### 1. Acesse o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Selecione seu projeto (ou crie um novo se necessário)

### 2. Obter as Credenciais Faltantes

1. Clique no ícone de **engrenagem** (⚙️) no canto superior esquerdo
2. Selecione **Project Settings**
3. Role até a seção **Your apps**
4. Se já tiver um app web, clique nele
5. Se não tiver, clique em **Add app** > escolha **Web** (`</>`)
6. Você verá um código JavaScript com todas as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ", // ✅ Você já tem
  authDomain: "XXXXX.firebaseapp.com", // ⚠️ COPIE ESTE
  projectId: "XXXXX", // ⚠️ COPIE ESTE
  storageBucket: "XXXXX.appspot.com", // ⚠️ COPIE ESTE
  messagingSenderId: "469330532024", // ✅ Você já tem
  appId: "1:469330532024:web:XXXXX" // ⚠️ COPIE ESTE
};
```

### 3. Criar Arquivo .env

Na raiz do projeto, crie um arquivo chamado `.env` (se não existir) e adicione:

```env
# Supabase (já configurado)
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ
VITE_FIREBASE_AUTH_DOMAIN=COLE_AQUI_O_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=COLE_AQUI_O_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=COLE_AQUI_O_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=469330532024
VITE_FIREBASE_APP_ID=COLE_AQUI_O_APP_ID

# Firebase OAuth Client ID
VITE_FIREBASE_OAUTH_CLIENT_ID=469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com
```

**Substitua os valores `COLE_AQUI_*` pelas informações do Firebase Console.**

### 4. Habilitar Authentication no Firebase

1. No Firebase Console, vá em **Authentication** (menu lateral)
2. Clique em **Get Started**
3. Na aba **Sign-in method**, habilite:
   - ✅ **Email/Password** → Clique → Enable → Save
   - ✅ **Google** → Clique → Enable → Use o Client ID: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com` → Save

### 5. Configurar URLs de Redirecionamento (Google OAuth)

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto do Firebase
3. Vá em **APIs & Services** > **Credentials**
4. Encontre o OAuth 2.0 Client ID: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j`
5. Clique para editar
6. Em **Authorized JavaScript origins**, adicione:
   ```
   http://localhost:3000
   https://wwwwyuwighdehmvnolrl.supabase.co
   ```
7. Em **Authorized redirect URIs**, adicione:
   ```
   http://localhost:3000/auth/callback
   https://wwwwyuwighdehmvnolrl.supabase.co/auth/v1/callback
   ```
8. Clique em **Save**

### 6. Reiniciar o Servidor

```bash
npm run dev
```

### 7. Verificar se Funcionou

1. Abra o console do navegador (F12)
2. Procure por: `✅ Firebase inicializado com sucesso`
3. Se aparecer `⚠️ Firebase não configurado`, verifique:
   - Se o arquivo `.env` está na raiz do projeto
   - Se todas as variáveis começam com `VITE_`
   - Se você reiniciou o servidor

## 🧪 Testar a Sincronização

### Teste 1: Cadastro no Supabase
1. Acesse `http://localhost:3000/cadastro`
2. Preencha o formulário
3. Cadastre-se
4. No console, deve aparecer: `✅ Usuário sincronizado do Supabase para Firebase`
5. Verifique no Firebase Console > Authentication: seu usuário deve estar lá!

### Teste 2: Login com Google
1. Acesse `http://localhost:3000/login`
2. Clique em "Login com Google"
3. Autentique
4. Verifique no console: mensagem de sincronização
5. Verifique no Firebase Console: usuário deve aparecer

## ⚠️ Importante

- O arquivo `.env` **NÃO** deve ser commitado no Git (já está no `.gitignore`)
- Mantenha suas credenciais seguras
- Se estiver usando produção, configure as variáveis de ambiente no seu provedor de hospedagem (Vercel, etc.)

## 📚 Próximos Passos

Após configurar:
1. ✅ Aplicar a migration do banco: `supabase/migrations/20250106000000_add_firebase_sync_support.sql`
2. ✅ Testar a sincronização
3. ✅ Verificar se os usuários aparecem em ambos os sistemas

## 🆘 Precisa de Ajuda?

- Consulte: `CONFIGURAR_FIREBASE_CREDENCIAIS.md` para guia detalhado
- Consulte: `SINCRONIZACAO_FIREBASE_SUPABASE.md` para documentação completa
- Verifique os logs no console do navegador

---

**Tempo estimado:** 5-10 minutos ⏱️
