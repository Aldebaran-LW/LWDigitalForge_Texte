# 📋 Resumo: Como Verificar Logs da Vercel

## 🎯 Passo a Passo Rápido

### 1. Acessar Vercel Dashboard
- URL: https://vercel.com/dashboard
- Fazer login

### 2. Selecionar Projeto
- Procurar: `ponto-diario-1` (ou nome do projeto JornadaPro)
- Clicar no projeto

### 3. Acessar Logs
**Opção A:** Menu superior → **"Logs"**
**Opção B:** Menu superior → **"Deployments"** → último deploy → **"Functions"**

### 4. Filtrar Logs
- Procurar por: `/api/verify-subscription`
- Ou procurar por: `[Verify]`, `[Subscription]`, `[Cache]`
- Ou procurar por: erros (mensagens em vermelho)

---

## 🔍 O Que Procurar

### ✅ Logs Esperados (Funcionando):
```
🔍 [Verify] Verificando no banco: { userId: '...', appId: '...' }
✅ [Verify] Resultado: { hasAccess: true, ... }
```

### ❌ Logs de Erro (Problema):
```
❌ [Verify] Erro: ...
❌ [Verify] Erro ao buscar assinaturas: ...
❌ [Verify] Erro ao buscar compra: ...
```

---

## ✅ Ação Imediata

1. **Acessar:** https://vercel.com/dashboard
2. **Selecionar projeto:** `ponto-diario-1`
3. **Acessar:** "Logs" ou "Deployments" → último deploy → "Functions"
4. **Filtrar:** `/api/verify-subscription` ou `[Verify]`
5. **Testar API route** em outra aba para gerar logs
6. **Verificar** se aparecem novos logs ou erros
7. **Me dizer** o que aparece nos logs

---

**ACESSAR LOGS DA VERCEL AGORA!** 🔍
