# 🔧 Corrigir Erro no GitHub Actions - Supabase Deploy

## 🔍 Problema Identificado

O workflow do GitHub Actions está falhando com o erro:
```
Invalid project ref format. Must be like `abcdefghijklmnopqrst`.
```

**Erro no step**: "Projeto Link Supabase" (Link Supabase Project)

---

## ✅ Solução

### Problema 1: Variável Hardcoded

O `SUPABASE_PROJECT_ID` estava hardcoded no workflow. Deve ser um **GitHub Secret**.

### Problema 2: Nome da Variável

O Supabase CLI espera `--project-ref`, então a variável deve se chamar `SUPABASE_PROJECT_REF`.

---

## 🔧 Correção Aplicada

O workflow foi atualizado para:
1. Usar `SUPABASE_PROJECT_REF` em vez de `SUPABASE_PROJECT_ID`
2. Buscar o valor de `secrets.SUPABASE_PROJECT_REF` (não hardcoded)
3. Passar o `SUPABASE_ACCESS_TOKEN` explicitamente no step de link

---

## 📋 Configurar GitHub Secrets

Você precisa configurar os seguintes secrets no GitHub:

### 1. Acessar GitHub Secrets

1. Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
2. Ou: Repositório > Settings > Secrets and variables > Actions

### 2. Adicionar/Atualizar Secrets

**Secret 1: `SUPABASE_ACCESS_TOKEN`**
- **Value**: `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83`
- Este é o access token do Supabase (para CLI)

**Secret 2: `SUPABASE_PROJECT_REF`**
- **Value**: `wwwwyuwighdehmvnolrl`
- Este é o project reference ID (20 caracteres)
- Pode ser extraído da URL: `https://wwwwyuwighdehmvnolrl.supabase.co`

**Secret 3: `SUPABASE_DB_PASSWORD`** (se necessário)
- **Value**: Sua senha do banco de dados do Supabase
- Pode ser encontrada em: Supabase Dashboard > Settings > Database > Database password

---

## 🔍 Como Encontrar o Project Ref

O Project Reference ID é a parte da URL do seu projeto Supabase:

```
https://wwwwyuwighdehmvnolrl.supabase.co
                          ^^^^^^^^^^^^^^^^^^^^
                          Este é o project ref
```

Ou acesse:
- Supabase Dashboard: https://app.supabase.com/
- Selecione seu projeto
- O project ref está na URL: `https://app.supabase.com/project/wwwwyuwighdehmvnolrl`
- Ou em Settings > General > Reference ID

---

## ✅ Verificar Configuração

Após configurar os secrets:

1. **Verifique se os secrets estão configurados**:
   - Vá em Settings > Secrets and variables > Actions
   - Confirme que existem:
     - `SUPABASE_ACCESS_TOKEN`
     - `SUPABASE_PROJECT_REF`
     - `SUPABASE_DB_PASSWORD` (se necessário)

2. **Faça um novo commit** para disparar o workflow:
   ```bash
   git add .
   git commit -m "fix: corrigir workflow do GitHub Actions"
   git push
   ```

3. **Verifique o workflow**:
   - Vá em Actions no GitHub
   - Veja se o workflow executa sem erros

---

## 📝 Checklist

- [ ] Acessei Settings > Secrets and variables > Actions
- [ ] Adicionei/Atualizei `SUPABASE_ACCESS_TOKEN` com `sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83`
- [ ] Adicionei/Atualizei `SUPABASE_PROJECT_REF` com `wwwwyuwighdehmvnolrl`
- [ ] Adicionei `SUPABASE_DB_PASSWORD` (se necessário)
- [ ] Fiz commit e push das mudanças no workflow
- [ ] Verifiquei que o workflow executou sem erros

---

## 🔗 Links Úteis

- **GitHub Secrets**: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions
- **Supabase Dashboard**: https://app.supabase.com/project/wwwwyuwighdehmvnolrl
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli

---

**Última atualização**: 2025-01-06
