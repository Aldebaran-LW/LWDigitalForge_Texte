# 🔄 Guia de Recuperação de Arquivos

## ✅ Seus Arquivos Estão Seguros!

Todos os seus arquivos estão no Git, que mantém histórico completo. Mesmo que algo seja deletado acidentalmente, você pode recuperar.

## 🔍 Como Recuperar Arquivos Deletados

### **1. Ver Histórico de Commits**
```bash
# Ver todos os commits
git log

# Ver commits de um arquivo específico
git log -- <caminho-do-arquivo>

# Ver commits de uma pasta
git log -- supabase/migrations/
```

### **2. Ver Tudo que Foi Deletado (incluindo commits perdidos)**
```bash
# Ver histórico completo (incluindo commits "perdidos")
git reflog

# Ver mudanças em um commit específico
git show <commit-hash>
```

### **3. Recuperar Arquivo Deletado**

#### **Opção A: Recuperar de um Commit Específico**
```bash
# Ver commits que modificaram o arquivo
git log --all --full-history -- <caminho-do-arquivo>

# Recuperar arquivo de um commit específico
git checkout <commit-hash> -- <caminho-do-arquivo>

# Exemplo: recuperar uma migration
git checkout abc123 -- supabase/migrations/20250101000000_initial_schema.sql
```

#### **Opção B: Recuperar Arquivo do Último Commit**
```bash
# Recuperar arquivo do HEAD (último commit)
git checkout HEAD -- <caminho-do-arquivo>
```

#### **Opção C: Recuperar Arquivo de uma Branch**
```bash
# Recuperar arquivo de outra branch
git checkout <nome-branch> -- <caminho-do-arquivo>
```

### **4. Recuperar Branch Deletada**
```bash
# Ver todas as branches (incluindo deletadas)
git reflog

# Encontrar o commit da branch deletada
git reflog | grep <nome-branch>

# Recriar a branch
git checkout -b <nome-branch> <commit-hash>
```

### **5. Recuperar Pasta Inteira**
```bash
# Recuperar toda a pasta de migrations
git checkout <commit-hash> -- supabase/migrations/

# Ou do último commit
git checkout HEAD -- supabase/migrations/
```

## 🛡️ Proteções Automáticas

### **Backup Automático de Migrations**
- Workflow `.github/workflows/backup-migrations.yml` cria backup automático
- Backup é criado sempre que migrations são modificadas
- Backups ficam disponíveis por 90 dias no GitHub Actions

### **Como Acessar Backups:**
1. Acesse: GitHub → Actions → "Backup Migrations"
2. Clique em uma execução
3. Baixe o artifact "migrations-backup-..."

## 📋 Checklist de Segurança

### **Antes de Fazer Mudanças:**
- [ ] Fazer commit das mudanças atuais
- [ ] Fazer push para o repositório
- [ ] Verificar se está na branch correta

### **Depois de Fazer Mudanças:**
- [ ] Verificar se arquivos foram commitados
- [ ] Fazer push para o repositório
- [ ] Verificar se push foi bem-sucedido

### **Se Algo Der Errado:**
- [ ] Não entrar em pânico! Arquivos estão no Git
- [ ] Usar `git reflog` para ver histórico
- [ ] Usar `git checkout` para recuperar arquivos
- [ ] Verificar backups no GitHub Actions

## 🚨 Comandos de Emergência

### **Ver o que foi deletado recentemente:**
```bash
git log --diff-filter=D --summary
```

### **Recuperar tudo do último commit:**
```bash
git checkout HEAD -- .
```

### **Desfazer mudanças não commitadas:**
```bash
# Desfazer mudanças em arquivos rastreados
git checkout -- <arquivo>

# Desfazer todas as mudanças não commitadas
git reset --hard HEAD
```

### **Ver diferenças entre commits:**
```bash
# Ver diferenças entre dois commits
git diff <commit1> <commit2>

# Ver o que mudou em um commit
git show <commit-hash>
```

## 💡 Dicas Importantes

1. **Sempre faça commit antes de mudanças grandes**
2. **Faça push regularmente** (pelo menos uma vez por dia)
3. **Use branches para features** (não trabalhe direto na main)
4. **Verifique o status antes de deletar:** `git status`
5. **Use `git log` antes de fazer mudanças grandes**

## ✅ Resumo

- ✅ **Arquivos nunca são perdidos permanentemente** (estão no Git)
- ✅ **Histórico completo** de todas as mudanças
- ✅ **Backups automáticos** de migrations
- ✅ **Múltiplas formas de recuperação**
- ✅ **Produção protegida** (workflows separados)

**Seus arquivos estão seguros!** 🛡️
