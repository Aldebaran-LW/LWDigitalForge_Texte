# 🚀 Próximos Passos - Deploy Automático

## ✅ Status Atual

- ✅ Todos os secrets configurados no GitHub
- ✅ Secrets configurados no Supabase
- ✅ Workflow de deploy criado
- ✅ Integração com Mercado Pago completa

## 📋 Próximos Passos

### **1. Fazer Merge para a Branch `main`**

Você está na branch `feat/supabase-registered-apps-integration`. Para o deploy automático funcionar, você precisa fazer merge para `main`:

**Opção A: Via GitHub (Recomendado)**
1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte
2. Crie um Pull Request da branch `feat/supabase-registered-apps-integration` para `main`
3. Revise as mudanças
4. Faça o merge

**Opção B: Via Terminal**
```bash
# Mudar para a branch main
git checkout main

# Fazer merge da branch de feature
git merge feat/supabase-registered-apps-integration

# Fazer push
git push origin main
```

### **2. Verificar o Deploy Automático**

Após fazer push para `main`:

1. **Verificar GitHub Actions:**
   - Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
   - Veja o workflow "Deploy to Vercel" sendo executado
   - Aguarde a conclusão (verde = sucesso)

2. **Verificar Vercel:**
   - Acesse o dashboard do Vercel
   - Veja o novo deploy sendo criado
   - Acesse a URL de produção

### **3. Deploy das Edge Functions do Supabase**

As Edge Functions também precisam ser deployadas:

```bash
# Deploy da função create-checkout
npx supabase functions deploy create-checkout

# Deploy da função webhook
npx supabase functions deploy mercadopago-webhook
```

**OU** usar o workflow do Supabase (já configurado):
- O workflow `.github/workflows/supabase_deploy.yml` fará deploy das migrations automaticamente
- Para as Edge Functions, você ainda precisa fazer deploy manual via CLI

### **4. Configurar Webhook no Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Suas integrações** → **Webhooks**
3. Adicione a URL:
   ```
   https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/mercadopago-webhook
   ```
4. Selecione os eventos: **Pagamentos**

## ✅ Checklist Final

- [ ] Fazer merge para `main`
- [ ] Verificar workflow do GitHub Actions executando
- [ ] Verificar deploy no Vercel
- [ ] Deploy das Edge Functions no Supabase
- [ ] Configurar webhook no Mercado Pago
- [ ] Testar checkout em ambiente de produção

## 🎉 Pronto!

Após completar esses passos, seu sistema estará totalmente funcional com:
- ✅ Deploy automático na Vercel
- ✅ Integração completa com Mercado Pago
- ✅ Webhook para atualização automática de status
- ✅ Sistema de checkout funcional
