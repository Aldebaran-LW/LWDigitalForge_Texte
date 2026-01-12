# 🔄 Processo de Remoção de Tabelas JornadaPro

## 📋 Visão Geral

Este documento descreve o processo completo de remoção das tabelas do JornadaPro do Supabase, após a migração para MongoDB.

---

## 🎯 Objetivo

Remover as tabelas do sistema JornadaPro do Supabase, já que todos os dados e funcionalidades foram migrados para MongoDB.

---

## ⚠️ IMPORTANTE

**Este processo é IRREVERSÍVEL após a execução do script!**

Certifique-se de:
- ✅ Ter backup completo
- ✅ Ter testado tudo no MongoDB
- ✅ Ter confirmado que está tudo funcionando
- ✅ Ter preenchido o checklist de confirmação

---

## 📝 Passo a Passo

### **PASSO 1: Preencher Checklist de Confirmação**

1. Abra o arquivo `CHECKLIST_CONFIRMACAO_REMOCAO_TABELAS.md`
2. Preencha todos os itens do checklist
3. Certifique-se de que todos estão marcados como ✅
4. Salve o arquivo preenchido

---

### **PASSO 2: Verificar Dependências**

Execute no Supabase SQL Editor:

```sql
-- Arquivo: SQL_VERIFICAR_TABELAS_JORNADAPRO.sql
-- Query 2: Verificar Foreign Keys e Dependências
```

**Resultado esperado:** Nenhuma dependência externa encontrada (apenas dependências internas entre as próprias tabelas do JornadaPro).

---

### **PASSO 3: Criar Backup Final**

1. Acesse **Supabase Dashboard**
2. Vá para **Settings → Database → Backups**
3. Crie um backup completo do banco de dados
4. Anote a localização e data do backup

**Ou via SQL (exportar dados):**
```sql
-- Exportar dados importantes (se necessário)
```

---

### **PASSO 4: Executar Script de Verificação**

Execute todas as queries do arquivo `SQL_VERIFICAR_TABELAS_JORNADAPRO.sql`:

1. Query 1: Contagem de registros
2. Query 2: Verificar Foreign Keys
3. Query 3: Dados recentes
4. Query 4: Estrutura das tabelas
5. Query 5: Última atualização

**Documente os resultados** para referência futura.

---

### **PASSO 5: Confirmação Final**

Antes de executar o script de remoção:

1. ✅ Revisar checklist completo
2. ✅ Confirmar com equipe técnica
3. ✅ Verificar horário adequado (se aplicável)
4. ✅ Ter plano de rollback pronto

---

### **PASSO 6: Executar Script de Remoção**

**⚠️ PONTO DE NÃO RETORNO**

1. Abra o arquivo `SQL_REMOVER_TABELAS_JORNADAPRO.sql`
2. Copie o conteúdo (apenas o SQL, sem markdown)
3. Cole no **Supabase SQL Editor**
4. **Revisar cuidadosamente** o script
5. Clique em **Run**

**Ordem de exclusão (importante):**
1. `Logs_Erros` (depende de Empresas e Funcionarios)
2. `Relatorios_Mensais` (depende de Empresas e Funcionarios)
3. `Apontamentos_Fabrica` (depende de Empresas e Funcionarios)
4. `Apontamentos_Viagem` (depende de Empresas e Funcionarios)
5. `Feriados` (depende de Empresas)
6. `Funcionarios` (depende de Empresas)
7. `Empresas` (tabela base)

---

### **PASSO 7: Verificação Pós-Remoção**

Execute a query de verificação no final do script:

```sql
-- Verificar se as tabelas foram excluídas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'Apontamentos_Fabrica',
    'Apontamentos_Viagem',
    'Empresas',
    'Funcionarios',
    'Feriados',
    'Relatorios_Mensais',
    'Logs_Erros'
  );
```

**Resultado esperado:** Nenhuma linha retornada (0 tabelas encontradas).

---

### **PASSO 8: Monitoramento**

Após a remoção, monitore:

1. ✅ **Aplicação JornadaPro**
   - Verificar se está funcionando normalmente
   - Verificar logs por erros
   - Testar funcionalidades principais

2. ✅ **Logs do Supabase**
   - Verificar se não há erros relacionados
   - Verificar se não há queries tentando acessar as tabelas removidas

3. ✅ **Performance**
   - Verificar se a performance está adequada
   - Comparar com antes da remoção

---

### **PASSO 9: Documentação**

1. ✅ Documentar data/hora da remoção
2. ✅ Documentar resultados da verificação
3. ✅ Documentar qualquer problema encontrado
4. ✅ Atualizar documentação do projeto

---

## 🔄 Plano de Rollback

Se algo der errado após a remoção:

### **Opção 1: Restaurar Backup**

1. Acesse **Supabase Dashboard → Backups**
2. Selecione o backup criado antes da remoção
3. Restaure o backup completo

### **Opção 2: Re-migrar do MongoDB**

Se o backup não estiver disponível:

1. Exportar dados do MongoDB
2. Re-migrar para Supabase
3. Recriar tabelas e dados

---

## ⏱️ Tempo Estimado

- **Preparação:** 1-2 horas
- **Execução do Script:** 1-2 minutos
- **Verificação:** 15-30 minutos
- **Monitoramento Inicial:** 1-2 horas
- **Monitoramento Contínuo:** 24-48 horas

**Total:** ~1-2 dias para confirmação completa

---

## ✅ Checklist Rápido

- [ ] Checklist de confirmação preenchido
- [ ] Dependências verificadas
- [ ] Backup criado
- [ ] Script de verificação executado
- [ ] Confirmação final obtida
- [ ] Script de remoção executado
- [ ] Verificação pós-remoção realizada
- [ ] Monitoramento iniciado
- [ ] Documentação atualizada

---

## 📞 Contatos de Emergência

Se algo der errado:

- **Tech Lead:** _______________
- **DBA / Infra:** _______________
- **Desenvolvedor Responsável:** _______________

---

## 📝 Notas Finais

```
_________________________________________________
_________________________________________________
_________________________________________________
```
