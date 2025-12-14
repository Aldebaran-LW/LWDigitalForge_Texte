# 🔧 Configurar Credenciais do Firebase

## ✅ Credenciais Fornecidas

Você já forneceu:
- ✅ **API Key**: `AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ`
- ✅ **Client ID OAuth 2.0**: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com`

## 📋 Passo a Passo para Completar a Configuração

### Passo 1: Obter as Outras Credenciais do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Project Settings** (ícone de engrenagem) > **General**
4. Role até a seção **Your apps**
5. Se já tiver um app web, clique nele. Se não, clique em **Add app** > **Web** (`</>`)
6. Você verá um objeto JavaScript com todas as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ", // ✅ Você já tem
  authDomain: "seu-projeto.firebaseapp.com", // ⚠️ Precisamos
  projectId: "seu-projeto-id", // ⚠️ Precisamos
  storageBucket: "seu-projeto.appspot.com", // ⚠️ Precisamos
  messagingSenderId: "123456789", // ⚠️ Precisamos
  appId: "1:123456789:web:abc123" // ⚠️ Precisamos
};
```

### Passo 2: Criar/Editar Arquivo .env

Na raiz do projeto, crie ou edite o arquivo `.env`:

```env
# Supabase (já configurado)
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ
VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN_AQUI
VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID_AQUI
VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET_AQUI
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID_AQUI
VITE_FIREBASE_APP_ID=SEU_APP_ID_AQUI

# Firebase OAuth Client ID (para referência)
VITE_FIREBASE_OAUTH_CLIENT_ID=469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com
```

### Passo 3: Preencher os Valores Faltantes

Substitua os valores `SEU_*_AQUI` pelas informações do Firebase Console.

**Exemplo de como deve ficar:**
```env
VITE_FIREBASE_API_KEY=AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ
VITE_FIREBASE_AUTH_DOMAIN=lwdigitalforge-577c4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lwdigitalforge-577c4
VITE_FIREBASE_STORAGE_BUCKET=lwdigitalforge-577c4.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=469330532024
VITE_FIREBASE_APP_ID=1:469330532024:web:abc123def456
```

### Passo 4: Habilitar Authentication no Firebase

1. No Firebase Console, vá em **Authentication** > **Get Started**
2. Habilite os seguintes provedores:
   - ✅ **Email/Password** (Enable)
   - ✅ **Google** (Enable)
     - Use o Client ID: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j.apps.googleusercontent.com`

### Passo 5: Configurar URLs de Redirecionamento

#### Para Google OAuth no Firebase:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto do Firebase
3. Vá em **APIs & Services** > **Credentials**
4. Encontre o OAuth 2.0 Client ID: `469330532024-1sv5onbtikt2qoapn0js0u7pckt86k7j`
5. Adicione as URLs autorizadas:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://seu-dominio.com
https://wwwwyuwighdehmvnolrl.supabase.co
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://seu-dominio.com/auth/callback
https://wwwwyuwighdehmvnolrl.supabase.co/auth/v1/callback
```

### Passo 6: Reiniciar o Servidor

Após configurar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🧪 Testar a Configuração

1. Abra o console do navegador (F12)
2. Verifique se aparece: `✅ Firebase inicializado com sucesso`
3. Se aparecer `⚠️ Firebase não configurado`, verifique:
   - Se o arquivo `.env` está na raiz do projeto
   - Se todas as variáveis começam com `VITE_`
   - Se reiniciou o servidor após adicionar as variáveis

## 🔍 Como Encontrar o Project ID

Se você não souber o Project ID:
1. No Firebase Console, o Project ID aparece no topo da página
2. Ou vá em **Project Settings** > **General** > **Project ID**

## 🔍 Como Encontrar o Auth Domain

O Auth Domain geralmente segue o padrão:
- `[project-id].firebaseapp.com`

Exemplo: Se o Project ID é `lwdigitalforge-577c4`, o Auth Domain é `lwdigitalforge-577c4.firebaseapp.com`

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git (já está no `.gitignore`)
- Mantenha suas credenciais seguras
- Use variáveis de ambiente diferentes para desenvolvimento e produção

## 📚 Próximos Passos

Após configurar as credenciais:
1. ✅ Aplicar a migration do banco de dados
2. ✅ Testar cadastro no Supabase → Firebase
3. ✅ Testar login com Google → Firebase

Consulte `GUIA_RAPIDO_SINCRONIZACAO.md` para mais detalhes.

---

**Precisa de ajuda?** Verifique os logs no console do navegador ou consulte a documentação completa em `SINCRONIZACAO_FIREBASE_SUPABASE.md`.

