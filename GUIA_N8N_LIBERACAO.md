# 🔄 Guia: Configurar n8n para Liberação Automática

## 📋 Visão Geral

Este guia explica como configurar n8n para automatizar a liberação de usuários no sistema.

---

## ⚠️ Nota Importante

**Para n8n Cloud (recomendado):** Você **não precisa** dos arquivos `Dockerfile.n8n` ou `render.yaml`. Eles são apenas para deploy self-hosted.

---

## 🚀 Opções de Instalação

### **Opção 1: n8n Cloud (Mais Fácil - Recomendado para Começar)**

- ✅ Setup em minutos
- ✅ Sem configuração de servidor
- ✅ HTTPS e segurança gerenciados
- 💰 Custo: ~$20/mês (plano básico)

**Quando usar:** Se quer começar rápido e não se importa com o custo mensal.

---

### **Opção 2: n8n Self-Hosted no Render (Recomendado)**

- ✅ Grátis (com limite de uso)
- ✅ Fácil deploy
- ✅ Escalável
- ⚠️ Precisa configurar variáveis de ambiente

**Quando usar:** Se já usa Render ou quer uma solução self-hosted grátis.

---

### **Opção 3: n8n Self-Hosted no Hostinger VPS**

- ✅ Controle total
- ✅ Grátis (se já tem VPS)
- ⚠️ Precisa gerenciar servidor
- ⚠️ Precisa configurar HTTPS (Let's Encrypt)

**Quando usar:** Se já tem VPS no Hostinger e quer controle total.

---

## 🎯 Workflow n8n: Liberação Automática

O workflow n8n será configurado para:

1. **Trigger:** Cron (executa a cada hora)
2. **Supabase Query:** Buscar usuários que precisam atualização
3. **Loop:** Para cada usuário
4. **Supabase Function:** Chamar `update_user_liberado_status`
5. **Notificação:** Enviar email/webhook em caso de erro

---

## 📦 Opção 1: n8n Cloud (Mais Rápido)

### **Passo 1: Criar Conta**

1. Acesse: https://n8n.io
2. Clique em "Start Free"
3. Crie sua conta

### **Passo 2: Criar Workflow**

1. No dashboard, clique em "Add workflow"
2. Importe o workflow do arquivo `n8n-workflow-liberacao.json` (será criado)
3. Configure as credenciais do Supabase

### **Passo 3: Configurar Credenciais**

1. Vá em "Credentials" → "Add Credential"
2. Selecione "Supabase"
3. Preencha:
   - **Host:** `wwwwyuwighdehmvnolrl.supabase.co`
   - **Service Role Secret:** (sua service role key)
   - **Project ID:** `wwwwyuwighdehmvnolrl`

### **Passo 4: Ativar Workflow**

1. Salve o workflow
2. Ative o toggle "Active" no canto superior direito
3. O workflow executará automaticamente conforme o cron configurado

---

## 🖥️ Opção 2: n8n Self-Hosted no Render

### **Passo 1: Preparar Repositório**

O arquivo `render.yaml` será criado com a configuração.

### **Passo 2: Deploy no Render**

1. Acesse: https://render.com
2. Conecte seu repositório GitHub
3. Render detectará o `render.yaml` automaticamente
4. Configure as variáveis de ambiente:
   - `N8N_ENCRYPTION_KEY` (gere uma chave aleatória)
   - `N8N_USER_MANAGEMENT_DISABLED=false`
   - `N8N_BASIC_AUTH_ACTIVE=true`
   - `N8N_BASIC_AUTH_USER=admin`
   - `N8N_BASIC_AUTH_PASSWORD=` (defina uma senha forte)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### **Passo 3: Importar Workflow**

1. Acesse o n8n (URL fornecida pelo Render)
2. Faça login
3. Importe o workflow `n8n-workflow-liberacao.json`

### **Passo 4: Ativar**

Ative o workflow e ele executará automaticamente.

---

## 🖥️ Opção 3: n8n Self-Hosted no Hostinger VPS

### **Passo 1: Conectar ao VPS**

```bash
ssh usuario@seu-vps-ip
```

### **Passo 2: Instalar Node.js**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### **Passo 3: Instalar n8n**

```bash
# Instalar n8n globalmente
sudo npm install n8n -g

# Ou usar npx (recomendado)
npx n8n
```

### **Passo 4: Configurar PM2 (Gerenciador de Processos)**

```bash
# Instalar PM2
sudo npm install pm2 -g

# Criar arquivo de configuração
cat > ~/n8n-ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'n8n',
    script: 'n8n',
    env: {
      N8N_ENCRYPTION_KEY: 'sua-chave-aleatoria-aqui',
      N8N_HOST: '0.0.0.0',
      N8N_PORT: 5678,
      N8N_PROTOCOL: 'http',
      WEBHOOK_URL: 'https://seu-dominio.com/',
      GENERIC_TIMEZONE: 'America/Sao_Paulo',
    }
  }]
}
EOF

# Iniciar n8n
pm2 start n8n-ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar para iniciar no boot
pm2 startup
```

### **Passo 5: Configurar Nginx (Reverse Proxy)**

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/n8n
```

Conteúdo do arquivo:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Passo 6: Configurar SSL (Let's Encrypt)**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Testar renovação automática
sudo certbot renew --dry-run
```

### **Passo 7: Acessar n8n**

1. Acesse: `https://seu-dominio.com`
2. Crie sua conta
3. Importe o workflow

---

## 📄 Workflow n8n: Estrutura

### **Workflow Simplificado (Recomendado):**

1. **Trigger: Cron** - Executa a cada hora
2. **HTTP Request** - Chama função RPC `update_all_users_liberado_status`
3. **IF** - Verifica sucesso (status code 200/204)
4. **Set** - Define status de sucesso/erro

### **Workflow Alternativo (Se necessário):**

1. **Trigger: Cron**
2. **HTTP Request** - Buscar todos os IDs de usuários
3. **Split In Batches** - Dividir em lotes
4. **Loop** - Para cada usuário
5. **HTTP Request** - Chamar `update_user_liberado_status` para cada um

**Nota:** O workflow simplificado é mais eficiente pois chama a função RPC que atualiza todos de uma vez.

---

## 🔐 Variáveis de Ambiente

Configure estas variáveis no n8n:

- `SUPABASE_URL`: `https://wwwwyuwighdehmvnolrl.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: (sua service role key)
- `SUPABASE_PROJECT_ID`: `wwwwyuwighdehmvnolrl`

---

## 📊 Workflow JSON

O arquivo `n8n-workflow-liberacao.json` contém a exportação completa do workflow.

**Como importar:**
1. No n8n, clique em "Workflows" → "Import from File"
2. Selecione o arquivo JSON
3. Configure as credenciais do Supabase
4. Ative o workflow

---

## ✅ Testando o Workflow

1. **Teste Manual:**
   - Clique em "Execute Workflow"
   - Verifique os logs de cada node

2. **Teste com Cron:**
   - Configure cron para executar em 1 minuto (teste)
   - Verifique se executou corretamente
   - Altere de volta para 1 hora

3. **Verificar Resultados:**
   - Verifique logs no n8n
   - Verifique tabela `profiles` no Supabase
   - Confirme que `is_liberado` foi atualizado

---

## 🔧 Troubleshooting

### **Erro: "Credential not found"**
- Verifique se as credenciais do Supabase estão configuradas
- Teste a conexão nas credenciais

### **Erro: "Function not found"**
- Verifique se a função `update_user_liberado_status` existe no Supabase
- Execute o SQL de criação da função se necessário

### **Workflow não executa**
- Verifique se o workflow está ativo
- Verifique configuração do cron
- Verifique logs do n8n

### **Erro de permissão**
- Use `SUPABASE_SERVICE_ROLE_KEY` (não anon key)
- Service Role Key ignora RLS

---

## 📝 Próximos Passos

1. ✅ Escolher opção de instalação (Cloud, Render, ou Hostinger)
2. ✅ Instalar/configurar n8n
3. ✅ Importar workflow `n8n-workflow-liberacao.json`
4. ✅ Configurar credenciais
5. ✅ Testar workflow manualmente
6. ✅ Ativar cron automático
7. ✅ Monitorar execuções

---

## 🎯 Resumo

- **n8n Cloud:** Mais fácil, ~$20/mês
- **Render:** Self-hosted grátis, fácil deploy
- **Hostinger VPS:** Self-hosted grátis, mais controle, mais configuração

**Recomendação:** Começar com **n8n Cloud** para testar, depois migrar para self-hosted se necessário.

---

**Próximo passo:** Vou criar o arquivo JSON do workflow e os arquivos de configuração!
