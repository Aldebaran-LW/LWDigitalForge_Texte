# 🚀 Criar Pull Request - Instruções

## ⚡ Opção Rápida (Recomendada)

**Clique neste link e crie o PR manualmente:**
👉 https://github.com/Aldebaran-LW/LWDigitalForge_Texte/compare/main...feat/supabase-registered-apps-integration

1. O link abrirá a página de comparação
2. Clique em "Create Pull Request"
3. Copie o conteúdo do arquivo `PULL_REQUEST.md` e cole na descrição
4. Clique em "Create Pull Request"

---

## 💻 Opção via Script PowerShell

Execute no PowerShell (como Administrador se necessário):

```powershell
# Opção 1: Script simplificado
.\criar-pr-simples.ps1

# Opção 2: Script original
.\criar-pr.ps1
```

**⚠️ Token:** Configure seu token do GitHub (não commitar tokens no repositório)

---

## 🔧 Opção Manual via PowerShell

Execute este comando diretamente (substitua `SEU_TOKEN_AQUI` pelo seu token):

```powershell
$token = "SEU_TOKEN_AQUI"
$body = Get-Content PULL_REQUEST.md -Raw
$json = @{
    title = "Merge feat/supabase-registered-apps-integration: migração completa para sistema próprio de produtos"
    head = "feat/supabase-registered-apps-integration"
    base = "main"
    body = $body
} | ConvertTo-Json -Depth 10

$headers = @{
    Authorization = "Bearer $token"
    Accept = "application/vnd.github.v3+json"
}

$response = Invoke-RestMethod `
    -Uri "https://api.github.com/repos/Aldebaran-LW/LWDigitalForge_Texte/pulls" `
    -Method Post `
    -Headers $headers `
    -Body $json `
    -ContentType "application/json"

Write-Host "✅ PR criado: $($response.html_url)" -ForegroundColor Green
Start-Process $response.html_url
```

---

## 📋 Informações do PR

- **Título:** Merge feat/supabase-registered-apps-integration: migração completa para sistema próprio de produtos
- **Base:** main
- **Head:** feat/supabase-registered-apps-integration
- **Descrição:** Ver arquivo `PULL_REQUEST.md`

---

## ✅ Após Criar o PR

1. Revise as mudanças (76 arquivos)
2. Verifique se não há conflitos
3. Faça o merge quando estiver pronto
4. Após merge, aplique as migrations no Supabase

---

**💡 Dica:** Se os scripts travarem, use sempre a opção rápida (link direto) que é mais confiável!

