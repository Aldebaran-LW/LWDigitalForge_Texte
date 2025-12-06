# 🏗️ Configurar Projetos Supabase Separados

## 🎯 Objetivo

Configurar dois projetos Supabase separados:
- **Projeto Produção:** `wwwwyuwighdehmvnolrl` (já existe)
- **Projeto Desenvolvimento:** Novo projeto para testes

---

## 📝 Passo 1: Criar Novo Projeto Supabase

### **1.1 Acessar Dashboard**
1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"** (botão verde no topo)

### **1.2 Preencher Formulário**
- **Name:** `LW_Digital_Forge_Dev` (ou `LW_Digital_Forge_Development`)
- **Database Password:** 
  - Crie uma senha forte
  - **⚠️ ANOTE BEM!** Você precisará dela depois
- **Region:** Escolha a mesma região do projeto de produção (recomendado)
- **Pricing Plan:** FREE (ou o mesmo do projeto principal)

### **1.3 Criar Projeto**
- Clique em **"Create new project"**
- ⏱️ Aguarde 1-2 minutos enquanto o projeto é criado

### **1.4 Anotar Project ID**
- Após criar, você verá o **Project ID** (algo como: `abcdefghijklmnop`)
- **⚠️ ANOTE ESSE ID!** Você precisará dele

---

## 📝 Passo 2: Aplicar Migrations no Novo Projeto

### **Opção A: Via SQL Editor (Mais Simples)**

1. No novo projeto, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `supabase/migrations/20250101000000_initial_schema.sql` do seu projeto
4. Copie todo o conteúdo SQL
5. Cole no SQL Editor do novo projeto
6. Clique em **"Run"** ou pressione `Ctrl+Enter`

### **Opção B: Via CLI (Mais Automatizado)**

```bash
# Linkar ao novo projeto
supabase link --project-ref [NOVO-PROJECT-ID]

# Aplicar migrations
supabase db push
```

---

## 📝 Passo 3: Obter Credenciais do Novo Projeto

1. No novo projeto, vá em **Settings → API**
2. Copie:
   - **Project URL:** `https://[novo-project-id].supabase.co`
   - **anon public key:** Chave longa começando com `eyJ...`

---

## 📝 Passo 4: Configurar Secrets no GitHub

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Clique em **"New repository secret"** e adicione:

### **Secret 1: Project ID de Desenvolvimento**
- **Name:** `SUPABASE_PROJECT_ID_DEV`
- **Value:** O Project ID do novo projeto (ex: `abcdefghijklmnop`)

### **Secret 2: URL de Desenvolvimento**
- **Name:** `VITE_SUPABASE_URL_DEV`
- **Value:** A URL do novo projeto (ex: `https://abcdefghijklmnop.supabase.co`)

### **Secret 3: Anon Key de Desenvolvimento**
- **Name:** `VITE_SUPABASE_ANON_KEY_DEV`
- **Value:** A anon key do novo projeto

### **Secret 4: Database Password (Opcional, para CLI)**
- **Name:** `SUPABASE_DB_PASSWORD_DEV`
- **Value:** A senha do banco do novo projeto

---

## 📝 Passo 5: Verificar Workflows

Os workflows já estão configurados para usar projetos separados! ✅

- **`supabase_deploy.yml`** → Usa projeto de produção (`main`)
- **`supabase-branch-deploy.yml`** → Usa projeto de desenvolvimento (secrets `_DEV`)

---

## ✅ Como Funciona Agora

```
Branch Git: main
    ↓
Workflow: supabase_deploy.yml
    ↓
Projeto Supabase: wwwwwyuwighdehmvnolrl (PRODUÇÃO)
    ↓
Banco: Produção

---

Branch Git: feat/supabase-registered-apps-integration
    ↓
Workflow: supabase-branch-deploy.yml
    ↓
Projeto Supabase: [NOVO-PROJECT-ID] (DESENVOLVIMENTO)
    ↓
Banco: Desenvolvimento
```

---

## 🧪 Testar Configuração

### **1. Fazer Push na Branch de Feature**
```bash
git checkout feat/supabase-registered-apps-integration
git add .
git commit -m "test: testar deploy para projeto de desenvolvimento"
git push
```

### **2. Verificar Workflow**
1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
2. Procure pelo workflow **"Deploy to Supabase Branch (Development)"**
3. Verifique se executou com sucesso
4. Verifique se linkou ao projeto correto (deve mostrar o novo Project ID)

### **3. Verificar Migrations**
1. No projeto de desenvolvimento, vá em **Database → Migrations**
2. Verifique se as migrations foram aplicadas

---

## 📋 Checklist

- [ ] Novo projeto Supabase criado
- [ ] Project ID anotado
- [ ] Migrations aplicadas no novo projeto
- [ ] Credenciais copiadas (URL e anon key)
- [ ] Secrets adicionados no GitHub:
  - [ ] `SUPABASE_PROJECT_ID_DEV`
  - [ ] `VITE_SUPABASE_URL_DEV`
  - [ ] `VITE_SUPABASE_ANON_KEY_DEV`
- [ ] Workflow testado com sucesso

---

## 🆘 Troubleshooting

### **Erro: "Project not found"**
- Verifique se o `SUPABASE_PROJECT_ID_DEV` está correto
- Confirme que você tem acesso ao projeto

### **Erro: "Invalid credentials"**
- Verifique se copiou a URL e key do projeto de **desenvolvimento** (não produção)
- Confirme que não há espaços extras nos secrets

### **Migrations não aplicam**
- Verifique se linkou ao projeto correto
- Confirme que o `SUPABASE_PROJECT_ID_DEV` está configurado

---

## 🎉 Pronto!

Agora você tem:
- ✅ **Produção isolada** - zero risco
- ✅ **Desenvolvimento isolado** - pode testar à vontade
- ✅ **Deploy automático** - workflows configurados
- ✅ **Gratuito** - plano FREE permite múltiplos projetos

---

**Próximos passos:**
- Desenvolver features na branch de feature
- Testar migrations no projeto de desenvolvimento
- Fazer merge para `main` quando pronto
- Migrations serão aplicadas em produção automaticamente
