# 🖥️ Comandos Exatos para Executar

## ⚠️ ONDE EXECUTAR?

**Execute no SEU TERMINAL LOCAL (PowerShell ou CMD)**
**NÃO execute no Supabase Dashboard!**

---

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ Abrir o Terminal

- **Windows:** Pressione `Win + X` e escolha "Windows PowerShell" ou "Terminal"
- Ou abra o CMD: `Win + R` → digite `cmd` → Enter

### 2️⃣ Navegar até a Pasta do Projeto

```powershell
cd C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte
```

### 3️⃣ Obter o Access Token (no navegador)

1. Abra: https://supabase.com/dashboard/account/tokens
2. Clique em **"Generate New Token"**
3. Dê um nome: `CLI Deploy`
4. **Copie o token** (aparece só uma vez!)

### 4️⃣ Executar o Deploy

**OPÇÃO A: Script Automatizado (Mais Fácil) ✅**

```powershell
.\DEPLOY_COM_TOKEN.ps1
```

Quando pedir, cole o token que você copiou.

---

**OPÇÃO B: Comandos Manuais**

```powershell
# 1. Configurar o token (cole o seu token aqui)
$env:SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxxxxxxxxxxxxx"

# 2. Fazer o deploy
npx supabase functions deploy check-subscription

# 3. Testar (opcional)
npm run test:check-subscription:prod
```

---

## 📝 EXEMPLO COMPLETO NO TERMINAL

```
PS C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte> $env:SUPABASE_ACCESS_TOKEN="sbp_abc123..."
PS C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte> npx supabase functions deploy check-subscription

Deploying function check-subscription...
Function check-subscription deployed successfully!

PS C:\Users\LUCAS_W\Documents\GitHub\LWDigitalForge_Texte> npm run test:check-subscription:prod
```

---

## ✅ O QUE ESPERAR

**Se der certo, você verá:**
```
✅ Deployed Function check-subscription
```

**Se der erro:**
- "Access token not provided" → Você não configurou o token
- "Function not found" → Verifique se está na pasta correta
- "Permission denied" → Verifique se o token tem permissões

---

## 🆘 PROBLEMAS COMUNS

### Erro: "npx não encontrado"
**Solução:** Instale Node.js: https://nodejs.org/

### Erro: "supabase não encontrado"
**Solução:** 
```powershell
npm install -g supabase
```

### Erro: "Access token not provided"
**Solução:** Configure o token antes:
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
```

---

## 📍 RESUMO RÁPIDO

1. ✅ Abra o PowerShell/CMD
2. ✅ Vá até a pasta do projeto
3. ✅ Obtenha o token em: https://supabase.com/dashboard/account/tokens
4. ✅ Execute: `.\DEPLOY_COM_TOKEN.ps1` ou os comandos manuais acima

---

**🎯 Tudo isso é executado no SEU computador, não no Supabase!**










