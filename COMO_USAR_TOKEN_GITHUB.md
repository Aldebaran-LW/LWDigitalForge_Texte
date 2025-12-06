# 🔐 Como Usar o Token do GitHub

## ⚠️ IMPORTANTE: Segurança

**NUNCA** commite tokens no repositório! O token que você forneceu foi adicionado ao `.gitignore` para proteção.

---

## 🔑 Token Fornecido

```
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
```

---

## 📝 Como Configurar

### **Opção 1: Para Autenticação Git Local (Recomendado)**

Se você quer usar esse token para fazer push/pull:

```bash
# Configurar credenciais (Windows)
git config credential.helper wincred

# OU usar token diretamente na URL
git remote set-url origin https://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@github.com/Aldebaran-LW/LWDigitalForge_Texte.git
```

### **Opção 2: Adicionar como Secret no GitHub (Para Workflows)**

Se você precisa usar esse token em workflows do GitHub Actions:

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name:** `GITHUB_PAT` (ou outro nome)
   - **Value:** `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`
4. Clique em **"Add secret"**

**Nota:** O GitHub já fornece `GITHUB_TOKEN` automaticamente nos workflows, então você geralmente não precisa adicionar um token manualmente.

---

## 🎯 Para que Usar Este Token?

### **Autenticação Git:**
- Fazer push/pull sem digitar senha
- Autenticação em repositórios privados

### **GitHub Actions:**
- Geralmente não é necessário (use `GITHUB_TOKEN` que é automático)
- Apenas se precisar de permissões especiais

---

## ✅ Verificar se Funciona

```bash
# Testar push
git push

# Se funcionar sem pedir credenciais, está configurado!
```

---

## 🆘 Importante

- ⚠️ **Token adicionado ao `.gitignore`** - não será commitado
- ⚠️ **Nunca compartilhe tokens publicamente**
- ✅ **Use apenas para autenticação local ou GitHub Secrets**

---

**Token configurado com segurança!** 🔐
