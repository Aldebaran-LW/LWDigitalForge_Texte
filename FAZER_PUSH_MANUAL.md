# 🚀 Fazer Push Manualmente - Guia Rápido

## ⚠️ Problema

O push pode não ter sido realizado. Siga estes passos:

---

## 📋 Opção 1: Usar o Script PowerShell (Recomendado)

1. Abra o PowerShell no diretório do projeto
2. Execute:

```powershell
.\scripts\verificar-e-push.ps1
```

O script irá:
- ✅ Verificar a branch atual
- ✅ Verificar se há commits não enviados
- ✅ Fazer commit se necessário
- ✅ Fazer push para o GitHub

---

## 📋 Opção 2: Comandos Manuais

### **Passo 1: Verificar Branch**

```bash
git branch
```

**Deve mostrar:** `* feat/supabase-registered-apps-integration`

Se não estiver, execute:
```bash
git checkout feat/supabase-registered-apps-integration
```

---

### **Passo 2: Verificar Status**

```bash
git status
```

Se houver arquivos modificados, adicione e faça commit:
```bash
git add .
git commit -m "docs: adicionar documentação sobre configuração de token GitHub e atualizar .gitignore"
```

---

### **Passo 3: Fazer Push**

```bash
git push origin feat/supabase-registered-apps-integration
```

**OU se a branch não existir remotamente:**

```bash
git push -u origin feat/supabase-registered-apps-integration
```

---

### **Passo 4: Autenticação (se pedir)**

**Username:** `Aldebaran-LW`

**Password:** `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`

---

## 🔍 Verificar se Funcionou

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/tree/feat/supabase-registered-apps-integration
2. Verifique se os arquivos aparecem:
   - `CONFIGURAR_TOKEN_GITHUB.md`
   - `COMO_USAR_TOKEN_GITHUB.md`
   - `.gitignore` (com as novas linhas)

---

## 🆘 Problemas Comuns

### **"fatal: The current branch has no upstream branch"**
```bash
git push -u origin feat/supabase-registered-apps-integration
```

### **"remote: Invalid username or password"**
- Use o token como senha: `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`
- Username: `Aldebaran-LW`

### **"Permission denied"**
- Verifique se o token tem permissões de `repo`
- Tente gerar um novo token em: https://github.com/settings/tokens

---

## ✅ Verificação Final

Execute para ver o último commit:

```bash
git log --oneline -1
```

**Execute os comandos e me diga o resultado!** 🚀
