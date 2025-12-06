# 🌿 Criar Branch no Supabase Dashboard - Guia Visual

## 🎯 Objetivo
Criar a branch `feat-supabase-registered-apps-integration` no Supabase para desenvolvimento isolado.

---

## 📝 Passo a Passo Detalhado

### **Passo 1: Acessar o Dashboard**

1. Abra seu navegador
2. Acesse: **https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl**
3. Faça login se necessário

### **Passo 2: Navegar para Branches**

Você tem **duas opções** para acessar a seção de Branches:

#### **Opção A: Menu Lateral (Recomendado)**
1. No menu lateral esquerdo, procure por **"Branches"**
2. Clique em **"Branches"**

#### **Opção B: Settings → Integrations**
1. Clique em **"Settings"** (ícone de engrenagem) no menu lateral
2. Vá em **"Integrations"**
3. Procure por **"Branches"** ou **"Database Branches"**

**💡 Dica:** Se não encontrar a opção "Branches", pode ser que seu projeto ainda não tenha essa feature habilitada. Nesse caso, você pode precisar habilitar primeiro em Settings → Integrations → GitHub.

### **Passo 3: Criar Nova Branch**

1. Na página de Branches, clique no botão **"Create Branch"** ou **"New Branch"**
   - Geralmente está no canto superior direito
   - Ou pode ser um botão grande no centro da página

2. Preencha o formulário:

   **Branch Name:**
   ```
   feat-supabase-registered-apps-integration
   ```
   ⚠️ **IMPORTANTE:** Use hífens, não underscores ou espaços!

   **Base Branch:**
   - Selecione `main` (ou deixe o padrão)

   **Description (Opcional):**
   ```
   Branch para desenvolvimento da integração de apps registrados
   ```

3. Clique em **"Create Branch"** ou **"Create"**

### **Passo 4: Aguardar Criação**

- ⏱️ A criação pode levar **1-3 minutos**
- Você verá uma mensagem de progresso
- Aguarde até ver a branch listada

### **Passo 5: Obter Credenciais da Branch**

Após a branch ser criada:

1. **Mude para a branch:**
   - No topo do dashboard, você verá um **seletor de branch**
   - Clique nele e selecione `feat-supabase-registered-apps-integration`

2. **Acessar Settings → API:**
   - Com a branch selecionada, vá em **Settings** (menu lateral)
   - Clique em **"API"**

3. **Copiar Credenciais:**
   - **Project URL:** Copie a URL completa
     - Exemplo: `https://abc123xyz.supabase.co`
   - **anon public key:** Copie a chave longa
     - Começa com `eyJ...`
     - É uma string muito longa

4. **Anotar o Branch ID:**
   - O Branch ID geralmente está na URL ou no nome da branch
   - Ou pode ser encontrado na página de detalhes da branch

---

## 📋 Checklist Pós-Criação

Após criar a branch, você precisará:

- [ ] Branch criada com sucesso
- [ ] Credenciais copiadas:
  - [ ] Project URL da branch
  - [ ] anon public key da branch
  - [ ] Branch ID (opcional, mas recomendado)
- [ ] Próximo passo: Adicionar secrets no GitHub

---

## 🆘 Problemas Comuns

### ❌ "Branches option not found"
**Possíveis causas:**
- Feature não habilitada no seu plano
- Precisa habilitar GitHub Integration primeiro

**Solução:**
1. Vá em Settings → Integrations → GitHub
2. Conecte seu repositório GitHub
3. Isso pode habilitar a opção de Branches

### ❌ "Branch name already exists"
**Solução:**
- Use um nome diferente ou delete a branch existente primeiro

### ❌ "Error creating branch"
**Solução:**
- Verifique se você tem permissões de administrador no projeto
- Tente novamente após alguns minutos
- Verifique se há limites no seu plano

---

## 🔗 Próximos Passos

Após criar a branch:

1. ✅ **Adicionar Secrets no GitHub:**
   - Siga: `CONFIGURACAO_RAPIDA.md` - Passo 3

2. ✅ **Testar a Configuração:**
   - Fazer push na branch Git
   - Verificar workflow no GitHub Actions

---

## 📸 Onde Encontrar (Referência Visual)

```
Supabase Dashboard
├── Menu Lateral
│   ├── Home
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Database
│   ├── Authentication
│   ├── Storage
│   ├── Edge Functions
│   ├── Branches ← AQUI!
│   └── Settings
│       └── API ← Para pegar credenciais
```

---

**Precisa de ajuda?** 
- Consulte: `CONFIGURACAO_RAPIDA.md` para o guia completo
- Ou: `CONFIGURACAO_BRANCHES_PASSO_A_PASSO.md` para detalhes
