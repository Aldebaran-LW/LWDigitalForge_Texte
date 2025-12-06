# 🧪 Testar Configuração - Projetos Separados

## ✅ O que já foi feito

- [x] Projeto de desenvolvimento criado
- [x] Estrutura do banco copiada
- [x] Dados copiados
- [x] Secrets configurados no GitHub

---

## 🚀 Próximo Passo: Testar o Deploy

### **Passo 1: Verificar se está na branch correta**

```bash
# Verificar branch atual
git branch

# Se não estiver na branch de feature, mude:
git checkout feat/supabase-registered-apps-integration
```

### **Passo 2: Fazer um commit de teste**

```bash
# Adicionar mudanças (se houver)
git add .

# Fazer commit
git commit -m "test: testar deploy para projeto de desenvolvimento"

# Fazer push
git push origin feat/supabase-registered-apps-integration
```

### **Passo 3: Verificar Workflow no GitHub Actions**

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
2. Procure pelo workflow **"Deploy to Supabase Branch (Development)"**
3. Clique na execução mais recente
4. Verifique se:
   - ✅ Workflow executou com sucesso
   - ✅ Linkou ao projeto correto (`vedrmtowoosqxzqxgxpb`)
   - ✅ Migrations foram aplicadas (se houver novas)

### **Passo 4: Verificar Deploy do Frontend (Vercel)**

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
2. Procure pelo workflow **"Deploy to Vercel"**
3. Verifique se:
   - ✅ Build foi bem-sucedido
   - ✅ Deploy foi criado como **preview** (não produção)
   - ✅ URL de preview foi gerada

### **Passo 5: Testar a Aplicação**

1. Acesse a URL de preview do Vercel
2. Verifique se:
   - ✅ Aplicação carrega corretamente
   - ✅ Conecta ao banco de desenvolvimento
   - ✅ Dados aparecem corretamente
   - ✅ Autenticação funciona

---

## 🔍 Verificações Adicionais

### **Verificar se o Frontend está usando o banco correto**

1. Abra o DevTools do navegador (F12)
2. Vá em **Console**
3. Verifique se há erros de conexão
4. Vá em **Network** → **Fetch/XHR**
5. Procure por requisições para Supabase
6. Verifique se a URL é do projeto de desenvolvimento:
   - ✅ Deve ser: `https://vedrmtowoosqxzqxgxpb.supabase.co`
   - ❌ NÃO deve ser: `https://wwwwyuwighdehmvnolrl.supabase.co`

### **Verificar Migrations no Projeto de Desenvolvimento**

1. Acesse: https://supabase.com/dashboard/project/vedrmtowoosqxzqxgxpb
2. Vá em **Database → Migrations**
3. Verifique se as migrations foram aplicadas

### **Verificar Dados no Projeto de Desenvolvimento**

1. Acesse: https://supabase.com/dashboard/project/vedrmtowoosqxzqxgxpb
2. Vá em **Table Editor**
3. Verifique se as tabelas têm dados

---

## 📋 Checklist de Teste

- [ ] Push feito na branch `feat/supabase-registered-apps-integration`
- [ ] Workflow "Deploy to Supabase Branch" executou com sucesso
- [ ] Workflow linkou ao projeto correto (`vedrmtowoosqxzqxgxpb`)
- [ ] Workflow "Deploy to Vercel" executou com sucesso
- [ ] Preview do Vercel foi criado
- [ ] Aplicação carrega no preview
- [ ] Aplicação conecta ao banco de desenvolvimento
- [ ] Dados aparecem corretamente
- [ ] Autenticação funciona

---

## 🆘 Problemas Comuns

### **Erro: "Project not found"**
- Verifique se o secret `SUPABASE_PROJECT_ID_DEV` está correto
- Confirme que o Project ID é `vedrmtowoosqxzqxgxpb`

### **Erro: "Invalid credentials"**
- Verifique se os secrets `VITE_SUPABASE_URL_DEV` e `VITE_SUPABASE_ANON_KEY_DEV` estão corretos
- Confirme que copiou as credenciais do projeto de **desenvolvimento**

### **Frontend ainda usa banco de produção**
- Verifique se os secrets `_DEV` estão configurados no GitHub
- Confirme que o workflow do Vercel está usando os secrets corretos
- Verifique a URL no console do navegador

### **Migrations não aplicam**
- Verifique se está linkado ao projeto correto
- Confirme que o `SUPABASE_PROJECT_ID_DEV` está configurado

---

## 🎉 Se tudo funcionou!

Agora você tem:
- ✅ **Produção isolada** - zero risco
- ✅ **Desenvolvimento isolado** - pode testar à vontade
- ✅ **Deploy automático** - workflows configurados
- ✅ **Ambientes separados** - main → produção, feature → desenvolvimento

---

## 📝 Próximos Passos Após Teste

1. ✅ Desenvolver features na branch de feature
2. ✅ Testar migrations no projeto de desenvolvimento
3. ✅ Fazer merge para `main` quando pronto
4. ✅ Migrations serão aplicadas em produção automaticamente

---

**Precisa de ajuda?** Me diga o que aconteceu quando você fez o push!
