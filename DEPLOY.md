# 🚀 Guia Rápido de Deploy - Vercel

Este guia explica como configurar o deploy automático para Vercel via GitHub Actions.

## ⚡ Configuração Rápida

### **Passo 1: Obter Credenciais do Vercel**

1. **Instalar Vercel CLI (se ainda não tiver):**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Fazer primeiro deploy manual (para obter os IDs):**
   ```bash
   vercel
   ```
   
   Siga as instruções:
   - Escolha seu time/organização
   - Escolha o projeto (ou crie um novo)
   - Confirme as configurações

4. **Obter os IDs necessários:**
   
   Após o deploy, você terá um arquivo `.vercel/project.json` com os IDs:
   ```json
   {
     "orgId": "team_xxxxx",
     "projectId": "prj_xxxxx"
   }
   ```
   
   **OU** obtenha no dashboard do Vercel:
   - `VERCEL_ORG_ID`: Vá em Settings → General → Team ID
   - `VERCEL_PROJECT_ID`: Vá em Settings → General → Project ID

5. **Obter Token do Vercel:**
   - Acesse: https://vercel.com/account/tokens
   - Clique em "Create Token"
   - Dê um nome (ex: "GitHub Actions")
   - Copie o token gerado

### **Passo 2: Configurar Secrets no GitHub**

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione os seguintes secrets:

   | Nome do Secret | Valor | Onde Obter |
   |----------------|-------|------------|
   | `VERCEL_TOKEN` | Token do Vercel | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
   | `VERCEL_ORG_ID` | ID da organização | `.vercel/project.json` ou Settings → General |
   | `VERCEL_PROJECT_ID` | ID do projeto | `.vercel/project.json` ou Settings → General |
   | `VITE_SUPABASE_URL` | URL do Supabase | Dashboard do Supabase |
   | `VITE_SUPABASE_ANON_KEY` | Chave anônima | Dashboard do Supabase |
   | `VITE_MERCADOPAGO_PUBLIC_KEY` | Chave pública MP | Dashboard do Mercado Pago |

### **Passo 3: Verificar Deploy Automático**

Após configurar os secrets:

1. Faça um push para a branch `main`:
   ```bash
   git push origin main
   ```

2. Verifique o workflow:
   - Vá em **Actions** no GitHub
   - Veja o workflow "Deploy to Vercel" sendo executado
   - Aguarde a conclusão

3. Verifique o deploy:
   - Acesse o dashboard do Vercel
   - Veja o novo deploy sendo criado
   - Acesse a URL de produção

## 🔍 Verificando se Funcionou

### **No GitHub:**
- ✅ Workflow aparece em **Actions**
- ✅ Workflow completa com sucesso (verde)
- ✅ Sem erros nos logs

### **No Vercel:**
- ✅ Novo deploy aparece no dashboard
- ✅ Status: "Ready" ou "Building"
- ✅ URL de produção atualizada

## 🐛 Troubleshooting

### **Erro: "VERCEL_TOKEN not found"**
- Verifique se o secret `VERCEL_TOKEN` está configurado no GitHub
- Certifique-se de que o nome está exatamente como `VERCEL_TOKEN`

### **Erro: "VERCEL_ORG_ID not found"**
- Verifique se o secret `VERCEL_ORG_ID` está configurado
- Certifique-se de que o ID está correto (começa com `team_`)

### **Erro: "VERCEL_PROJECT_ID not found"**
- Verifique se o secret `VERCEL_PROJECT_ID` está configurado
- Certifique-se de que o ID está correto (começa com `prj_`)

### **Erro: "Build failed"**
- Verifique se as variáveis de ambiente estão configuradas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_MERCADOPAGO_PUBLIC_KEY`
- Verifique os logs do workflow para mais detalhes

### **Deploy não executa automaticamente**
- Verifique se você está fazendo push na branch `main`
- Verifique se o workflow está ativo em **Actions** → **Workflows**
- Tente executar manualmente: **Actions** → **Deploy to Vercel** → **Run workflow**

## 📝 Notas Importantes

- ⚠️ **Não commite o arquivo `.vercel/project.json`** - ele contém informações sensíveis
- ✅ O arquivo já está no `.gitignore`
- 🔒 Mantenha os tokens seguros e não os compartilhe
- 🔄 O deploy automático só funciona na branch `main` (ou a branch configurada)

## 🎯 Próximos Passos

Após configurar o deploy automático:

1. ✅ Teste fazendo um pequeno commit e push
2. ✅ Verifique se o deploy foi executado
3. ✅ Teste a aplicação na URL de produção
4. ✅ Configure domínio personalizado (opcional) no Vercel

## 📚 Recursos

- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)


