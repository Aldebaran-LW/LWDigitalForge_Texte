# 🚀 Guia: Deploy n8n no Render

## 📋 Visão Geral

Este guia explica como fazer deploy do n8n self-hosted no Render de forma gratuita.

---

## ✅ Pré-requisitos

1. ✅ Conta no Render (grátis): https://render.com
2. ✅ Conta no GitHub (para conectar repositório)
3. ✅ Service Role Key do Supabase

---

## 📦 Passo 1: Preparar Repositório

### **1.1. Verificar Arquivos**

Certifique-se de que estes arquivos estão no repositório:

- ✅ `render.yaml` - Configuração do Render
- ✅ `Dockerfile.n8n` - Dockerfile para n8n

### **1.2. Commit e Push**

Se ainda não fez commit dos arquivos:

```bash
git add render.yaml Dockerfile.n8n
git commit -m "feat: adicionar configuração n8n para Render"
git push origin main
```

---

## 🔧 Passo 2: Deploy no Render

### **2.1. Conectar Repositório**

1. Acesse: https://dashboard.render.com
2. Clique em "New +"
3. Selecione "Blueprint" (para usar render.yaml)
4. Conecte seu repositório GitHub
5. Selecione o repositório: `LWDigitalForge_Texte`
6. Clique em "Apply"

**OU** (se blueprint não funcionar):

1. Acesse: https://dashboard.render.com
2. Clique em "New +"
3. Selecione "Web Service"
4. Conecte seu repositório GitHub
5. Configure manualmente (veja passo 2.3)

### **2.2. Configuração Automática (com Blueprint)**

Se usou Blueprint, o Render detectará o `render.yaml` automaticamente.

**Verifique:**
- ✅ Tipo: Web Service
- ✅ Nome: `n8n`
- ✅ Build Command: (deixe vazio, Dockerfile cuida disso)
- ✅ Start Command: (deixe vazio, Dockerfile cuida disso)

### **2.3. Configuração Manual (sem Blueprint)**

Se não usou Blueprint, configure manualmente:

**Name:** `n8n` (ou qualquer nome)

**Environment:** `Docker`

**Build Command:** (deixe vazio)

**Start Command:** (deixe vazio)

**Instance Type:** Free (ou Starter para produção)

**Region:** Oregon (ou mais próximo)

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

No painel do Render, vá em "Environment" e adicione:

### **Variáveis Obrigatórias:**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `N8N_ENCRYPTION_KEY` | (gere uma chave) | Chave para criptografar dados |
| `N8N_USER_MANAGEMENT_DISABLED` | `false` | Habilitar gerenciamento de usuários |
| `N8N_BASIC_AUTH_ACTIVE` | `true` | Ativar autenticação básica |
| `N8N_BASIC_AUTH_USER` | `admin` | Usuário para login |
| `N8N_BASIC_AUTH_PASSWORD` | (defina uma senha forte) | Senha para login |
| `N8N_HOST` | `0.0.0.0` | Host do n8n |
| `N8N_PORT` | `5678` | Porta do n8n |
| `N8N_PROTOCOL` | `https` | Protocolo |
| `GENERIC_TIMEZONE` | `America/Sao_Paulo` | Timezone |

### **Variáveis do Supabase (para o workflow):**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `SUPABASE_URL` | `https://wwwwyuwighdehmvnolrl.supabase.co` | URL do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | (sua service role key) | Service Role Key (secreta!) |

### **Gerar N8N_ENCRYPTION_KEY:**

No terminal, execute:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Ou use um gerador online: https://randomkeygen.com/

**⚠️ IMPORTANTE:** Salve esta chave em local seguro! Se perdê-la, não conseguirá acessar os dados do n8n.

---

## 🚀 Passo 4: Deploy

1. Clique em "Create Web Service" (ou "Apply" se usou Blueprint)
2. O Render começará a fazer build
3. Aguarde alguns minutos (primeiro build pode levar 5-10 minutos)
4. Quando concluir, você verá a URL do serviço (ex: `n8n-xxxx.onrender.com`)

---

## 🔗 Passo 5: Acessar n8n

1. Acesse a URL fornecida pelo Render
2. Faça login com:
   - **Usuário:** `admin` (ou o que você definiu em `N8N_BASIC_AUTH_USER`)
   - **Senha:** (a senha que você definiu em `N8N_BASIC_AUTH_PASSWORD`)

3. Você será redirecionado para criar sua conta n8n
4. Crie sua conta (esta é a conta n8n, diferente da autenticação básica)

---

## 📋 Passo 6: Criar Workflow

### **6.1. Importar ou Criar Workflow**

Siga o guia: **`GUIA_N8N_WORKFLOW.md`**

Ou crie manualmente:

1. No n8n, clique em "Workflows" → "Add Workflow"
2. Adicione nodes conforme `GUIA_N8N_WORKFLOW.md`

### **6.2. Configurar Credenciais do Supabase**

No workflow, configure as credenciais do Supabase usando as variáveis de ambiente:

- `{{ $env.SUPABASE_URL }}`
- `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`

---

## ✅ Passo 7: Testar

1. Execute o workflow manualmente (Execute Workflow)
2. Verifique os logs
3. Confirme que a função foi chamada no Supabase
4. Verifique se `is_liberado` foi atualizado

---

## ⚙️ Configurações Adicionais

### **Auto-sleep no Free Tier**

O plano gratuito do Render coloca o serviço em "sleep" após 15 minutos de inatividade.

**Soluções:**
1. Usar plano Starter ($7/mês) - sem sleep
2. Usar cron job externo para "pingar" o serviço a cada 10 minutos
3. Usar serviço como https://cron-job.org para manter ativo

### **Cron Job para Manter Ativo (Grátis)**

Crie um cron job que chama a URL do n8n a cada 10 minutos:

1. Acesse: https://cron-job.org (ou similar)
2. Configure:
   - **URL:** `https://seu-n8n.onrender.com`
   - **Intervalo:** 10 minutos
   - **Método:** GET

---

## 🔧 Troubleshooting

### **Erro: "Build failed"**

- Verifique se o `Dockerfile.n8n` está correto
- Verifique logs do build no Render

### **Erro: "Service unavailable"**

- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique logs do serviço no Render

### **Erro: "Cannot connect to Supabase"**

- Verifique `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Teste a conexão manualmente

### **Workflow não executa automaticamente**

- Verifique se o workflow está ativo
- Verifique configuração do cron
- Verifique se o serviço não está em sleep (free tier)

### **Serviço em Sleep (Free Tier)**

- Use cron job externo para manter ativo
- Ou faça upgrade para Starter ($7/mês)

---

## 💰 Custos

### **Free Tier:**
- ✅ Grátis
- ⚠️ Serviço entra em sleep após 15 min inatividade
- ⚠️ Primeira inicialização após sleep leva ~30 segundos

### **Starter ($7/mês):**
- ✅ Sem sleep
- ✅ 512MB RAM
- ✅ Mais recursos

**Recomendação:** Começar com Free, depois fazer upgrade se necessário.

---

## 📝 Checklist

- [ ] Conta Render criada
- [ ] Repositório conectado
- [ ] `render.yaml` no repositório
- [ ] `Dockerfile.n8n` no repositório
- [ ] Variáveis de ambiente configuradas
- [ ] N8N_ENCRYPTION_KEY gerada
- [ ] Deploy concluído
- [ ] n8n acessível via URL
- [ ] Login funcionando
- [ ] Workflow criado
- [ ] Credenciais configuradas
- [ ] Workflow testado
- [ ] Workflow ativado

---

## 🎯 Próximos Passos

1. ✅ Deploy no Render
2. ✅ Acessar n8n
3. ✅ Criar workflow (seguir `GUIA_N8N_WORKFLOW.md`)
4. ✅ Configurar cron job para manter ativo (opcional, free tier)
5. ✅ Monitorar execuções

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs no Render Dashboard
2. Verifique variáveis de ambiente
3. Teste workflow manualmente primeiro
4. Consulte `GUIA_N8N_WORKFLOW.md` para detalhes do workflow

---

**✨ Agora você tem n8n rodando no Render de forma gratuita!**
