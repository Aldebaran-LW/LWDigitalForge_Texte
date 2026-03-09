# PhotoVault - Google Photos + Google Drive

O PhotoVault foi integrado ao portal como uma area protegida em:

- ` /portal/photovault`

Ele permite:

- conectar uma conta Google via OAuth;
- listar fotos e videos do Google Photos;
- criar "cofres" (particoes) protegidos por senha;
- gerar uma pasta dedicada para cada cofre no Google Drive;
- copiar os itens selecionados do Google Photos para o cofre escolhido;
- registrar historico resumido das transferencias no Supabase.

## Arquitetura

### Frontend

- `src/pages/portal/PortalPhotoVault.jsx`
- `src/lib/photovaultCrypto.js`

### Backend Vercel

- `api/google/oauth/start.js`
- `api/google/oauth/callback.js`
- `api/google/oauth/disconnect.js`
- `api/google/session.js`
- `api/google/photos/list.js`
- `api/google/photos/transfer.js`
- `api/google/drive/create-folder.js`

### Banco / Supabase

- `supabase/migrations/20260309000000_create_photovault_tables.sql`

## Variaveis de ambiente necessarias

Defina estas variaveis na Vercel e no seu `.env` local:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...
GOOGLE_COOKIE_SECRET=... # opcional
```

As variaveis do Supabase ja usadas pelo portal continuam obrigatorias:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Configuracao do Google Cloud

1. Acesse `Google Cloud Console > APIs & Services`.
2. Ative:
   - **Google Photos Library API**
   - **Google Drive API**
3. Configure a **OAuth consent screen**.
4. Crie um **OAuth Client ID** do tipo **Web application**.
5. Adicione os domínios:

### Origins autorizadas

```txt
http://localhost:3001
https://SEU-PROJETO.vercel.app
```

### Redirect URIs autorizadas

```txt
http://localhost:3001/api/google/oauth/callback
https://SEU-PROJETO.vercel.app/api/google/oauth/callback
```

## Como aplicar no Supabase

Rode a migration do repositório normalmente com seu fluxo atual de deploy do Supabase.

As tabelas criadas sao:

- `photo_vaults`
- `photo_vault_transfers`

As senhas dos cofres **nao** sao salvas em texto puro: o hash PBKDF2 e gerado no cliente antes de gravar no banco.

## Fluxo de uso

1. Entrar no portal.
2. Abrir `/portal/photovault`.
3. Conectar a conta Google.
4. Criar um cofre com nome + senha.
5. Desbloquear o cofre.
6. Selecionar itens do Google Photos.
7. Transferir para o Google Drive.

## Observacoes de deploy

- O backend foi feito com **funcoes serverless em `/api`**, entao e compativel com Vercel.
- Os tokens Google ficam em **cookie httpOnly criptografado**.
- Para manter o processamento estavel em serverless, cada envio aceita ate **12 itens por lote**.

## Melhorias futuras sugeridas

- busca por albums do Google Photos;
- fila assíncrona para lotes maiores;
- deduplicacao por hash/nome na pasta do Drive;
- compartilhamento granular de cofres;
- expiracao automatica do desbloqueio por inatividade.
