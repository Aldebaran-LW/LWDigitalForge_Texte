# ⚡ Configuração Rápida - Supabase Branches

## 🎯 Resumo Executivo

Configurar uma branch do Supabase para desenvolvimento isolado em **3 passos simples**.

---

## 📝 Passo 1: Criar Branch (2 minutos)

1. Acesse: https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/branches
2. Clique em **"Create Branch"**
3. Nome: `feat-supabase-registered-apps-integration`
4. Base: `main`
5. Clique em **"Create"**

**⏱️ Aguarde 1-2 minutos** enquanto a branch é criada.

---

## 📝 Passo 2: Copiar Credenciais (1 minuto)

1. **Mude para a branch** usando o seletor no topo do dashboard
2. Vá em **Settings → API**
3. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public key** (chave longa começando com `eyJ...`)

---

## 📝 Passo 3: Adicionar Secrets no GitHub (2 minutos)

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Clique em **"New repository secret"** (3 vezes):

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL_DEV`
   - Value: URL da branch (copiada no passo 2)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY_DEV`
   - Value: anon key da branch (copiada no passo 2)

   **Secret 3 (opcional):**
   - Name: `SUPABASE_BRANCH_ID`
   - Value: ID da branch (parte da URL, ex: `abc123`)

---

## ✅ Pronto!

Agora quando você fizer push na branch `feat/supabase-registered-apps-integration`:
- ✅ Migrations serão aplicadas na branch do Supabase (não em produção)
- ✅ Frontend preview usará a branch do Supabase (se secrets configurados)
- ✅ Produção permanece intacta

---

## 🧪 Testar

```bash
# Fazer push na branch
git push origin feat/supabase-registered-apps-integration

# Verificar workflow
# Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
```

---

## 🆘 Problemas?

- **Branch não aparece?** Verifique se foi criada no dashboard
- **Workflow falha?** Verifique se os secrets estão corretos
- **Migrations não aplicam?** Verifique se está linkado à branch correta

**Guia completo:** Veja `CONFIGURACAO_BRANCHES_PASSO_A_PASSO.md`
