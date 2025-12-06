# 📋 Copiar Banco de Produção para Desenvolvimento

## 🎯 Objetivo

Copiar todo o banco de dados do projeto de **produção** (`wwwwyuwighdehmvnolrl`) para o projeto de **desenvolvimento** (`vedrmtowoosqxzqxgxpb`), incluindo:
- ✅ Estrutura (tabelas, índices, etc.)
- ✅ Dados (registros)
- ✅ Configurações (RLS, policies, etc.)

---

## 🚀 Método 1: Via Supabase CLI (Recomendado)

### **Passo 1: Fazer Dump do Banco de Produção**

```bash
# Linkar ao projeto de produção
supabase link --project-ref wwwwwyuwighdehmvnolrl

# Fazer dump do banco (estrutura + dados)
supabase db dump -f dump_producao.sql --data-only=false
```

Isso criará um arquivo `dump_producao.sql` com tudo do banco de produção.

### **Passo 2: Restaurar no Banco de Desenvolvimento**

```bash
# Linkar ao projeto de desenvolvimento
supabase link --project-ref vedrmtowoosqxzqxgxpb

# Restaurar o dump
supabase db reset --file dump_producao.sql
```

---

## 🚀 Método 2: Via SQL Editor (Mais Simples)

### **Passo 1: Gerar Dump via SQL Editor**

1. No projeto de **produção** (`wwwwyuwighdehmvnolrl`), vá em **SQL Editor**
2. Execute este comando para gerar o dump:

```sql
-- Gerar dump de todas as tabelas
SELECT 
    'pg_dump -h ' || current_setting('host') || 
    ' -U postgres -d postgres -t ' || schemaname || '.' || tablename || 
    ' --data-only' as dump_command
FROM pg_tables 
WHERE schemaname = 'public';
```

### **Passo 2: Usar pg_dump (via CLI)**

Se você tem acesso ao banco via CLI:

```bash
# Dump do banco de produção
pg_dump "postgresql://postgres:[SENHA]@db.wwwwyuwighdehmvnolrl.supabase.co:5432/postgres" \
  --schema=public \
  --data-only=false \
  > dump_producao.sql
```

### **Passo 3: Restaurar no Banco de Desenvolvimento**

1. No projeto de **desenvolvimento** (`vedrmtowoosqxzqxgxpb`), vá em **SQL Editor**
2. Abra o arquivo `dump_producao.sql`
3. Cole todo o conteúdo
4. Execute (Run)

---

## 🚀 Método 3: Via Dashboard (Mais Fácil - Recomendado)

### **Passo 1: Exportar do Projeto de Produção**

1. Acesse o projeto de **produção**: https://supabase.com/dashboard/project/wwwwyuwighdehmvnolrl
2. Vá em **Database** → **Backups** (ou **Settings** → **Database**)
3. Procure por opção de **"Export"** ou **"Download backup"**
4. Baixe o backup

### **Passo 2: Importar no Projeto de Desenvolvimento**

1. Acesse o projeto de **desenvolvimento**: https://supabase.com/dashboard/project/vedrmtowoosqxzqxgxpb
2. Vá em **SQL Editor**
3. Se o backup for um arquivo SQL, cole o conteúdo e execute
4. Ou use a opção de **"Import"** se disponível

---

## 🚀 Método 4: Via Supabase CLI (Comando Direto)

### **Copiar Diretamente (Mais Rápido)**

```bash
# Fazer dump do banco de produção e restaurar no desenvolvimento
supabase db dump --project-ref wwwwwyuwighdehmvnolrl | \
  supabase db reset --project-ref vedrmtowoosqxzqxgxpb
```

---

## 📝 Método Recomendado: Via SQL Editor (Passo a Passo)

### **Passo 1: Obter Dump do Banco de Produção**

1. No projeto de **produção**, vá em **SQL Editor**
2. Execute este script para gerar o dump completo:

```sql
-- Este script gera comandos para copiar estrutura e dados
-- (Execute e copie o resultado)
```

### **Passo 2: Aplicar no Banco de Desenvolvimento**

1. No projeto de **desenvolvimento**, vá em **SQL Editor**
2. Cole o conteúdo do dump
3. Execute

---

## ⚠️ Importante

### **O que será copiado:**
- ✅ Todas as tabelas
- ✅ Todos os dados
- ✅ Índices
- ✅ Constraints
- ✅ RLS Policies
- ✅ Funções
- ✅ Triggers

### **O que NÃO será copiado:**
- ❌ Usuários de autenticação (auth.users)
- ❌ Configurações de autenticação
- ❌ Storage buckets
- ❌ Edge Functions

### **Atenção:**
- ⚠️ Isso vai **sobrescrever** tudo no banco de desenvolvimento
- ⚠️ Faça backup do banco de desenvolvimento primeiro (se tiver dados importantes)
- ⚠️ Dados de teste podem ser perdidos

---

## 🔧 Alternativa: Copiar Apenas Estrutura (Sem Dados)

Se você quer apenas a estrutura (sem dados de produção):

```bash
# Dump apenas da estrutura
supabase db dump --project-ref wwwwwyuwighdehmvnolrl --schema-only > estrutura.sql

# Aplicar no desenvolvimento
supabase db reset --project-ref vedrmtowoosqxzqxgxpb --file estrutura.sql
```

---

## ✅ Checklist

- [ ] Backup do banco de desenvolvimento (se necessário)
- [ ] Dump do banco de produção criado
- [ ] Dump aplicado no banco de desenvolvimento
- [ ] Verificar se tabelas foram criadas
- [ ] Verificar se dados foram copiados
- [ ] Testar conexão do frontend

---

## 🆘 Troubleshooting

### **Erro: "Permission denied"**
- Verifique se você tem acesso aos dois projetos
- Use as credenciais corretas

### **Erro: "Connection refused"**
- Verifique se os projetos estão ativos
- Confirme as URLs dos projetos

### **Dados não aparecem**
- Verifique se o dump incluiu dados (`--data-only=false`)
- Confirme que executou o SQL completo

---

## 🎉 Pronto!

Após copiar, você terá:
- ✅ Banco de desenvolvimento idêntico ao de produção
- ✅ Mesma estrutura
- ✅ Mesmos dados (para testes)
- ✅ Mesmas configurações

**Próximo passo:** Configurar os secrets no GitHub e testar!
