# 🚀 Deploy Rápido com Token

## 📋 Passo a Passo

### 1. Obter Token de Acesso

1. **Acesse:** https://app.supabase.com/account/tokens
2. **Clique em:** "Generate new token"
3. **Dê um nome** ao token (ex: "Deploy CLI")
4. **Copie o token gerado** (você só verá ele uma vez!)

---

### 2. Executar Deploy (PowerShell)

**Substitua `seu_token_aqui` pelo token que você copiou:**

```powershell
# Definir token como variável de ambiente
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"

# Deploy da função
npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl
```

---

### 3. Verificar Deploy

Após o deploy, você pode:

1. **Verificar no Dashboard:**
   - Acesse: https://app.supabase.com/
   - Functions → `check-subscription`
   - Verifique se o código foi atualizado

2. **Verificar Logs:**
   - Functions → `check-subscription` → Logs
   - Procure por: `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO`

---

## ✅ O que será deployado

O arquivo `supabase/functions/check-subscription/index.ts` contém:
- ✅ Logs de debug adicionados:
  - `console.log("🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO:", ...)`
  - `console.log("🔍 [Edge Function] targetAppId extraído:", ...)`

---

## 📋 Checklist

- [ ] Token obtido em: https://app.supabase.com/account/tokens
- [ ] Token copiado
- [ ] Comando executado com token
- [ ] Deploy concluído com sucesso
- [ ] Função verificada no Dashboard
- [ ] Logs verificados

---

**Após obter o token, execute os comandos acima!** ✅
