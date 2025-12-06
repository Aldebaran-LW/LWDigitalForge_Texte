# 🔍 Verificar Deploy - Passo a Passo

## ✅ Push Realizado com Sucesso!

O código foi enviado para a branch `feat/supabase-registered-apps-integration`.

---

## 🚀 Agora Verifique os Workflows

### **1. Acessar GitHub Actions**

Acesse: **https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions**

Você deve ver **2 workflows** executando:

---

## 📋 Workflow 1: "Deploy to Supabase Branch (Development)"

### **O que verificar:**

1. **Status:** Deve estar em execução ou concluído com sucesso ✅
2. **Logs:** Clique no workflow e verifique:
   - ✅ "Linkando ao projeto de desenvolvimento: vedrmtowoosqxzqxgxpb"
   - ✅ "Encontradas X migrations"
   - ✅ "Deploy Migrations to Branch" - sucesso

### **Se der erro:**
- ❌ "Project not found" → Verifique o secret `SUPABASE_PROJECT_ID_DEV`
- ❌ "Invalid credentials" → Verifique o secret `SUPABASE_ACCESS_TOKEN`
- ❌ "Migrations failed" → Verifique os logs para detalhes

---

## 📋 Workflow 2: "Deploy to Vercel"

### **O que verificar:**

1. **Status:** Deve estar em execução ou concluído com sucesso ✅
2. **Build:** Deve compilar sem erros
3. **Deploy:** Deve criar um **preview** (não produção)
4. **URL:** Deve gerar uma URL de preview

### **Se der erro:**
- ❌ "Build failed" → Verifique os logs de build
- ❌ "Invalid secrets" → Verifique se os secrets `_DEV` estão configurados
- ❌ "Deploy failed" → Verifique o token do Vercel

---

## 🧪 Testar a Aplicação

### **1. Obter URL do Preview**

1. No workflow "Deploy to Vercel", procure pela URL de preview
2. Ou acesse: https://vercel.com/dashboard
3. Procure pelo projeto e veja os previews

### **2. Verificar Conexão com Banco**

1. Acesse a URL de preview
2. Abra DevTools (F12)
3. Vá em **Console**
4. Procure por requisições ao Supabase
5. Verifique se a URL é:
   - ✅ `https://vedrmtowoosqxzqxgxpb.supabase.co` (desenvolvimento)
   - ❌ NÃO deve ser: `https://wwwwyuwighdehmvnolrl.supabase.co` (produção)

### **3. Testar Funcionalidades**

- ✅ Login/Cadastro
- ✅ Listagem de produtos
- ✅ Carrinho
- ✅ Checkout (sandbox)

---

## 📊 Resumo do que Deve Acontecer

```
Push para feat/supabase-registered-apps-integration
    ↓
┌─────────────────────────────────────┐
│ Workflow 1: Supabase Deploy        │
│ ✅ Linka ao projeto DEV            │
│ ✅ Aplica migrations               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Workflow 2: Vercel Deploy          │
│ ✅ Build com secrets DEV           │
│ ✅ Cria preview                    │
│ ✅ URL: [preview-url]              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Preview Vercel                     │
│ ✅ Conecta ao banco DEV            │
│ ✅ Dados aparecem                  │
│ ✅ Funciona corretamente           │
└─────────────────────────────────────┘
```

---

## ✅ Checklist de Verificação

- [ ] Workflow "Deploy to Supabase Branch" executou
- [ ] Workflow linkou ao projeto correto (`vedrmtowoosqxzqxgxpb`)
- [ ] Migrations foram aplicadas (se houver novas)
- [ ] Workflow "Deploy to Vercel" executou
- [ ] Build foi bem-sucedido
- [ ] Preview foi criado
- [ ] URL de preview obtida
- [ ] Aplicação carrega no preview
- [ ] Aplicação conecta ao banco de desenvolvimento
- [ ] Dados aparecem corretamente

---

## 🆘 Se Algo Der Errado

### **Workflow não executou:**
- Verifique se o push foi bem-sucedido
- Verifique se está na branch correta
- Verifique se os workflows estão no repositório

### **Erro de autenticação:**
- Verifique os secrets no GitHub
- Confirme que os tokens estão corretos

### **Frontend não conecta ao banco correto:**
- Verifique se os secrets `_DEV` estão configurados
- Verifique a URL no console do navegador
- Confirme que o build usou os secrets corretos

---

## 🎉 Próximos Passos

Se tudo funcionou:
1. ✅ Continue desenvolvendo na branch de feature
2. ✅ Teste suas mudanças no preview
3. ✅ Quando pronto, faça merge para `main`
4. ✅ Migrations serão aplicadas em produção automaticamente

---

**Me diga o que você vê nos workflows!** 🚀
