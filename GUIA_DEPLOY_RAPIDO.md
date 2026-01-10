# 🚀 Guia Rápido de Deploy - check-subscription

## ⚡ Passos Rápidos

### 1️⃣ Login no Supabase

Abra um terminal PowerShell e execute:

```powershell
npx supabase login
```

Isso vai:
- Abrir seu navegador
- Pedir para fazer login no Supabase
- Autorizar o CLI
- Salvar o token automaticamente

**✅ Quando ver "Logged in as [seu-email]", está pronto!**

---

### 2️⃣ Deploy da Função

Execute um dos comandos abaixo:

**Opção A (Script):**
```powershell
.\deploy-check-subscription.ps1
```

**Opção B (Direto):**
```powershell
npx supabase functions deploy check-subscription
```

**✅ Quando ver "Deployed Function check-subscription", está deployado!**

---

### 3️⃣ Testar a Função

```powershell
npm run test:check-subscription:prod
```

**✅ Se todos os testes passarem, está funcionando!**

---

## 📍 URL da Função Após Deploy

```
https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
```

---

## 🔍 Verificar se Deploy Funcionou

Teste rápido com cURL:

```powershell
curl -X POST https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"00000000-0000-0000-0000-000000000000\",\"email\":\"test@test.com\"}'
```

Se retornar JSON com `hasAccess: false`, está funcionando! ✅

---

## ❌ Problemas Comuns

### "Access token not provided"
→ Execute `npx supabase login` primeiro

### "Function not found"
→ Certifique-se de estar no diretório raiz do projeto

### "Permission denied"
→ Verifique se você tem acesso ao projeto no Supabase Dashboard

---

## 📝 Checklist

- [ ] Login no Supabase (`npx supabase login`)
- [ ] Deploy executado com sucesso
- [ ] Testes passaram (`npm run test:check-subscription:prod`)
- [ ] Função acessível via URL

---

**🎉 Pronto! A função está no ar!**










