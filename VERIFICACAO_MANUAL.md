# 🔍 Verificação Manual da Configuração de Branches

## 📋 Checklist Rápido

### ✅ 1. Verificar Supabase CLI (Local)

```powershell
# Verificar se está instalado
supabase --version

# Se não estiver, instalar:
npm install -g supabase

# Fazer login
supabase login
```

### ✅ 2. Verificar Branch no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl/branches
2. Verifique se a branch `feat-supabase-registered-apps-integration` existe
3. Se não existir, crie seguindo `CONFIGURACAO_RAPIDA.md`

### ✅ 3. Verificar Secrets no GitHub

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Verifique se os seguintes secrets existem:
   - ✅ `VITE_SUPABASE_URL_DEV`
   - ✅ `VITE_SUPABASE_ANON_KEY_DEV`
   - ⚠️ `SUPABASE_BRANCH_ID` (opcional)

### ✅ 4. Verificar Workflows

Verifique se os arquivos existem:
- ✅ `.github/workflows/supabase-branch-deploy.yml`
- ✅ `.github/workflows/vercel_deploy.yml`
- ✅ `.github/workflows/supabase_deploy.yml`

### ✅ 5. Testar Configuração

```bash
# Fazer push na branch
git push origin feat/supabase-registered-apps-integration

# Verificar workflow no GitHub Actions
# Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/actions
```

---

## 🔧 Comandos Úteis

### Verificar Branches via CLI

```bash
# Listar branches do projeto
supabase branches list --project-ref wwwwwyuwighdehmvnolrl

# Ver detalhes de uma branch específica
supabase branches get feat-supabase-registered-apps-integration --project-ref wwwwwyuwighdehmvnolrl
```

### Verificar Migrations

```bash
# Ver migrations aplicadas
supabase migration list --project-ref wwwwwyuwighdehmvnolrl

# Ver migrations na branch (se linkado)
supabase migration list
```

### Linkar Projeto Localmente

```bash
# Linkar ao projeto principal
supabase link --project-ref wwwwwyuwighdehmvnolrl

# Linkar à branch (se souber o ID)
supabase link --project-ref <branch-id>
```

---

## 🆘 Problemas Comuns

### ❌ "Supabase CLI não encontrado"
**Solução:**
```bash
npm install -g supabase
```

### ❌ "Not logged in"
**Solução:**
```bash
supabase login
```

### ❌ "Branch not found"
**Solução:**
1. Verifique se a branch foi criada no dashboard
2. Confirme o nome da branch (sem espaços, apenas hífens)
3. Verifique se está usando o PROJECT_ID correto

### ❌ "Invalid credentials"
**Solução:**
1. Verifique se os secrets no GitHub estão corretos
2. Confirme que copiou a URL e key da **branch** (não do projeto principal)
3. Verifique se não há espaços extras nos secrets

---

## 📚 Próximos Passos

Após verificar tudo:
1. ✅ Criar branch no Supabase (se ainda não criou)
2. ✅ Adicionar secrets no GitHub
3. ✅ Fazer push e testar workflow
4. ✅ Verificar migrations aplicadas

**Guias:**
- `CONFIGURACAO_RAPIDA.md` - Configuração rápida (3 passos)
- `CONFIGURACAO_BRANCHES_PASSO_A_PASSO.md` - Guia detalhado completo
