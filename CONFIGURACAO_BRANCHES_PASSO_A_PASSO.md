# 🚀 Configuração de Supabase Branches - Passo a Passo

## 📋 Pré-requisitos

- ✅ Projeto Supabase: `wwwwyuwighdehmvnolrl`
- ✅ Repositório GitHub: `Aldebaran-LW/LWDigitalForge_Texte`
- ✅ Branch de feature: `feat/supabase-registered-apps-integration`
- ✅ Secrets do GitHub já configurados

## 🎯 Opção Escolhida: Branch Persistente (Manual)

Vamos criar uma branch persistente para desenvolvimento, que é mais controlada e permite testes contínuos.

---

## 📝 Passo 1: Criar Branch no Supabase Dashboard

### **1.1 Acessar o Dashboard**
1. Acesse: https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl
2. Faça login na sua conta

### **1.2 Navegar para Branches**
1. No menu lateral, clique em **"Branches"** (ou acesse diretamente: Settings → Branches)
2. Se não vir a opção, pode estar em: **Settings → Integrations → Branches**

### **1.3 Criar Nova Branch**
1. Clique em **"Create Branch"** ou **"New Branch"**
2. Preencha os campos:
   - **Branch Name**: `feat-supabase-registered-apps-integration`
   - **Base Branch**: `main` (ou deixe padrão)
   - **Description** (opcional): "Branch para desenvolvimento da integração de apps registrados"
3. Clique em **"Create Branch"**

### **1.4 Aguardar Criação**
- A branch será criada (pode levar alguns minutos)
- Você receberá um **Branch ID** único (algo como: `abc123xyz`)

---

## 📝 Passo 2: Obter Credenciais da Branch

### **2.1 Acessar Configurações da Branch**
1. Após a branch ser criada, **mude para a branch** usando o seletor no topo do dashboard
2. Vá em **Settings → API**

### **2.2 Copiar Credenciais**
Você precisará de:
- **Project URL**: `https://[branch-id].supabase.co`
- **anon/public key**: `eyJhbGc...` (chave longa)

**⚠️ IMPORTANTE:** Anote essas credenciais! Você precisará delas no próximo passo.

---

## 📝 Passo 3: Configurar Secrets no GitHub

### **3.1 Acessar Secrets do GitHub**
1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Clique em **"New repository secret"**

### **3.2 Adicionar Secrets da Branch**

Adicione os seguintes secrets:

#### **Secret 1: URL da Branch**
- **Name**: `VITE_SUPABASE_URL_DEV`
- **Value**: A URL da branch (ex: `https://abc123xyz.supabase.co`)

#### **Secret 2: Anon Key da Branch**
- **Name**: `VITE_SUPABASE_ANON_KEY_DEV`
- **Value**: A anon key da branch

#### **Secret 3: Branch ID (opcional, para workflows)**
- **Name**: `SUPABASE_BRANCH_ID`
- **Value**: O ID da branch (ex: `abc123xyz`)

---

## 📝 Passo 4: Atualizar Workflows

Os workflows já estão preparados! Mas vamos verificar se precisam de ajustes.

### **4.1 Verificar Workflow de Branch**
O arquivo `.github/workflows/supabase-branch-deploy.yml` já está configurado para:
- ✅ Detectar se a branch existe
- ✅ Linkar com a branch correta
- ✅ Aplicar migrations na branch

### **4.2 Atualizar Workflow do Vercel (se necessário)**
Se quiser que o frontend use a branch do Supabase em previews, precisamos atualizar o workflow do Vercel.

---

## 📝 Passo 5: Testar a Configuração

### **5.1 Fazer Push na Branch de Feature**
```bash
# Certifique-se de estar na branch correta
git checkout feat/supabase-registered-apps-integration

# Fazer uma mudança de teste (ou já tem mudanças)
git add .
git commit -m "test: testar deploy para branch do Supabase"
git push
```

### **5.2 Verificar Workflow**
1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
2. Procure pelo workflow **"Deploy to Supabase Branch (Development)"**
3. Verifique se executou com sucesso

### **5.3 Verificar Migrations**
1. No Supabase Dashboard, mude para a branch criada
2. Vá em **Database → Migrations**
3. Verifique se as migrations foram aplicadas

---

## 🔧 Alternativa: GitHub Integration (Automático)

Se preferir que branches sejam criadas automaticamente para cada PR:

### **Passos:**
1. Acesse: Supabase Dashboard → Settings → Integrations → GitHub
2. Clique em **"Connect GitHub"**
3. Autorize o Supabase a acessar seu repositório
4. Selecione o repositório: `Aldebaran-LW/LWDigitalForge_Texte`
5. Habilite **"Preview Branches"**
6. Configure:
   - **Base Branch**: `main`
   - **Auto-delete**: Após PR fechado (recomendado)

### **Como Funciona:**
- Cada Pull Request cria automaticamente uma branch do Supabase
- Migrations são aplicadas automaticamente
- Branch é deletada quando PR fecha

---

## ✅ Checklist de Configuração

- [ ] Branch criada no Supabase Dashboard
- [ ] Credenciais da branch anotadas
- [ ] Secrets adicionados no GitHub:
  - [ ] `VITE_SUPABASE_URL_DEV`
  - [ ] `VITE_SUPABASE_ANON_KEY_DEV`
  - [ ] `SUPABASE_BRANCH_ID` (opcional)
- [ ] Workflow testado com sucesso
- [ ] Migrations aplicadas na branch

---

## 🆘 Troubleshooting

### **Erro: "Branch not found"**
- Verifique se a branch foi criada no dashboard
- Confirme o nome da branch (sem espaços, apenas hífens)

### **Erro: "Invalid credentials"**
- Verifique se os secrets estão corretos no GitHub
- Confirme que copiou a URL e key da branch (não do projeto principal)

### **Migrations não aplicam**
- Verifique se está linkado à branch correta
- Confirme que o `SUPABASE_PROJECT_ID` está correto no workflow

---

## 📚 Próximos Passos

Após configurar:
1. ✅ Testar migrations na branch
2. ✅ Desenvolver features sem afetar produção
3. ✅ Fazer merge para `main` quando pronto
4. ✅ Migrations serão aplicadas em produção automaticamente

---

**Precisa de ajuda?** Consulte:
- `SEGURANCA_BRANCHES.md` - Segurança e recuperação
- `RECUPERACAO_ARQUIVOS.md` - Como recuperar arquivos
- `SUPABASE_BRANCHES_SETUP.md` - Visão geral
