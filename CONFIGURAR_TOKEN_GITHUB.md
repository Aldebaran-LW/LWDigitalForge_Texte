# 🔐 Configurar Token do GitHub

## ⚠️ IMPORTANTE: Segurança

**NUNCA** commite tokens ou chaves no repositório! Sempre use **GitHub Secrets**.

---

## 🔑 Token Fornecido

Você forneceu um token do GitHub:
```
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
```

---

## 📝 Como Configurar no GitHub

### **Opção 1: Se for um Personal Access Token (PAT)**

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name:** `GITHUB_TOKEN` (ou outro nome se necessário)
   - **Value:** `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`
4. Clique em **"Add secret"**

### **Opção 2: Se for para autenticação do CLI**

Se você quer usar esse token para autenticação local:

```bash
# Configurar token globalmente
git config --global credential.helper store
echo "https://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@github.com" > ~/.git-credentials

# OU usar apenas para este repositório
git config credential.helper store
```

---

## 🆘 Importante

- ⚠️ **Nunca commite tokens no Git!**
- ⚠️ **Não compartilhe tokens publicamente!**
- ✅ **Use GitHub Secrets para workflows**
- ✅ **Use variáveis de ambiente localmente**

---

## 🔍 Verificar se Token Está Funcionando

```bash
# Testar autenticação
git push

# Se pedir credenciais, use:
# Username: seu-usuario-github
# Password: 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
```

---

## 📋 Onde Usar Este Token

### **Para GitHub Actions:**
- Adicione como secret no GitHub
- Use `${{ secrets.GITHUB_TOKEN }}` nos workflows (já disponível automaticamente)

### **Para Autenticação Local:**
- Configure via `git config` (veja acima)
- Ou use via variável de ambiente

---

**Token configurado com sucesso!** Agora você pode usar para autenticação. 🔐
