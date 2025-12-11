# Instruções para Merge do Branch feat/supabase-registered-apps-integration para main

## 📊 Resumo do Merge

- **Branch origem**: `feat/supabase-registered-apps-integration`
- **Branch destino**: `main`
- **Commits à frente**: 5 commits
- **Status**: Pronto para merge

## 🚀 Opção 1: Merge via GitHub (Recomendado)

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte
2. Vá para a aba "Pull Requests"
3. Clique em "New Pull Request"
4. Selecione:
   - **base**: `main`
   - **compare**: `feat/supabase-registered-apps-integration`
5. Revise as mudanças
6. Clique em "Create Pull Request"
7. Após revisão, clique em "Merge pull request"

## 💻 Opção 2: Merge Local (se necessário limpar diretórios bloqueados)

```bash
# 1. Limpar mudanças locais
git reset --hard origin/feat/supabase-registered-apps-integration

# 2. Fazer checkout do main
git checkout main
git pull origin main

# 3. Fazer merge
git merge origin/feat/supabase-registered-apps-integration --no-ff -m "Merge feat/supabase-registered-apps-integration: migração completa para sistema próprio de produtos com Supabase"

# 4. Push para o remoto
git push origin main
```

## 📝 Mudanças Principais

- ✅ Migração completa para sistema próprio de produtos (`registered_apps`)
- ✅ Edge Functions para checkout e webhook Mercado Pago
- ✅ Sistema de trials implementado
- ✅ Documentação completa adicionada
- ✅ Correções de segurança e estrutura
- ✅ Workflows CI/CD configurados

## ⚠️ Nota

Há alguns diretórios bloqueados localmente (`assets`, `scripts`). O merge via GitHub web interface é a opção mais segura neste caso.



