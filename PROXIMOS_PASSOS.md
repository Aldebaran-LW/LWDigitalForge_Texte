# 🚀 Próximos Passos - Deploy da Branch feat/supabase-registered-apps-integration

Este guia contém todos os passos necessários para fazer o deploy completo após o merge da branch.

## 📋 Checklist de Deploy

### 1. ✅ Merge da Branch

A branch `feat/supabase-registered-apps-integration` está pronta para merge na `main`.

**Como fazer o merge:**
- Via GitHub: Abra um Pull Request e faça o merge
- Via CLI: 
  ```bash
  git checkout main
  git merge feat/supabase-registered-apps-integration
  git push origin main
  ```

---

### 2. 🔐 Configurar Variáveis de Ambiente

#### 2.1. Localmente

1. Copie o arquivo `env.example.txt` para `.env`:
   ```bash
   # Windows PowerShell
   Copy-Item env.example.txt .env
   
   # Linux/Mac
   cp env.example.txt .env
   ```

2. Edite o arquivo `.env` e preencha com seus valores:
   ```env
   VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA
   VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-a2044252-584b-4715-a558-bf11c837874a
   ```
   
   **Credenciais do Mercado Pago:**
   - **Public Key:** `APP_USR-a2044252-584b-4715-a558-bf11c837874a` ✅
   - **Client ID:** `8481516429434319` (para referência)
   
   **⚠️ IMPORTANTE:** Você também precisa do **Access Token** do Mercado Pago:
   - No painel do Mercado Pago, clique no ícone de olho 👁️ ao lado do Access Token mascarado
   - Copie o token completo e adicione ao `.env` como `MERCADOPAGO_ACCESS_TOKEN`

#### 2.2. No Host de Deploy (Vercel/Netlify/etc)

Configure as mesmas variáveis no painel do seu provedor de hosting:

- **Vercel**: Settings > Environment Variables
- **Netlify**: Site settings > Environment variables
- **Outros**: Consulte a documentação do seu provedor

**Variáveis necessárias:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MERCADOPAGO_PUBLIC_KEY` (para checkout no frontend)

---

### 3. 🗄️ Executar Migração SQL

A migração cria todas as tabelas necessárias no Supabase.

#### Passo a Passo:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie o conteúdo do arquivo `supabase/migrations/20250101000000_initial_schema.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione `Ctrl+Enter`)

**Arquivo da migração:**
```
supabase/migrations/20250101000000_initial_schema.sql
```

**O que a migração cria:**
- ✅ Tabela `profiles` (perfis de usuários)
- ✅ Tabela `registered_apps` (produtos/apps)
- ✅ Tabela `user_purchases` (compras)
- ✅ Tabela `user_trials` (testes gratuitos)
- ✅ RLS (Row Level Security) policies
- ✅ Triggers e funções auxiliares

---

### 4. 🚀 Deploy da Edge Function

A Edge Function `mercadopago-webhook` processa notificações de pagamento do Mercado Pago.

#### Pré-requisitos:

1. **Instalar Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Fazer login:**
   ```bash
   supabase login
   ```

3. **Linkar o projeto:**
   ```bash
   supabase link --project-ref wwwwyuwighdehmvnolrl
   ```

#### Deploy da Function:

**Opção 1: Usando o script PowerShell (Windows)**
```powershell
.\deploy-edge-function.ps1
```

**Opção 2: Comando manual**
```bash
supabase functions deploy mercadopago-webhook
```

#### Configurar Secrets da Edge Function:

Após o deploy, configure as variáveis de ambiente da função:

```bash
supabase secrets set MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

**Onde obter:**
- `MERCADOPAGO_ACCESS_TOKEN`: Painel do Mercado Pago > Credenciais
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard > Settings > API > service_role key

---

### 5. ✅ Verificações Pós-Deploy

#### 5.1. Verificar Tabelas Criadas

No SQL Editor do Supabase, execute:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deve retornar:
- `profiles`
- `registered_apps`
- `user_purchases`
- `user_trials`

#### 5.2. Testar Edge Function

1. Acesse: `https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/mercadopago-webhook`
2. Deve retornar uma resposta (mesmo que erro, significa que está funcionando)

#### 5.3. Verificar RLS Policies

No SQL Editor, execute:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Deve retornar várias políticas de segurança.

---

### 6. 🔧 Configurações Adicionais

#### 6.1. Configurar Webhook no Mercado Pago

1. Acesse o painel do Mercado Pago
2. Vá em **Webhooks** ou **Notificações**
3. Configure a URL:
   ```
   https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/mercadopago-webhook
   ```
4. Selecione os eventos: `payment.created`, `payment.updated`

#### 6.2. Criar Primeiro Admin

No SQL Editor, execute (substitua o UUID pelo ID do seu usuário):
```sql
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE id = 'seu-user-id-aqui';
```

Para encontrar seu user ID:
```sql
SELECT id, email FROM auth.users;
```

---

### 7. 📝 Próximas Ações Recomendadas

- [ ] Criar produtos iniciais na tabela `registered_apps`
- [ ] Testar fluxo completo de compra
- [ ] Configurar domínio customizado (se necessário)
- [ ] Configurar SSL/HTTPS
- [ ] Revisar logs de erro no Supabase Dashboard
- [ ] Configurar backups automáticos

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"
- **Solução**: Execute a migração SQL novamente

### Erro: "permission denied"
- **Solução**: Verifique as RLS policies e o role do usuário

### Edge Function não responde
- **Solução**: Verifique se os secrets estão configurados corretamente

### Variáveis de ambiente não funcionam
- **Solução**: Reinicie o servidor de desenvolvimento após criar o `.env`

---

## 📚 Documentação Adicional

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Última atualização:** 2025-01-01

