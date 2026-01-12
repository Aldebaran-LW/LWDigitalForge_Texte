# ✅ Checklist de Confirmação - Remoção de Tabelas JornadaPro

## 📋 Data de Preenchimento

**Data:** _______________
**Responsável:** _______________

---

## ✅ Checklist de Verificação

### **1. Dados Migrados para MongoDB**

- [ ] ✅ Todos os dados foram migrados do Supabase para MongoDB
- [ ] ✅ Contagem de registros verificada (Supabase vs MongoDB)
- [ ] ✅ Dados testados no MongoDB (consultas importantes)
- [ ] ✅ Integridade dos dados verificada

**Observações:**
```
_________________________________________________
_________________________________________________
```

---

### **2. Aplicação Funcionando com MongoDB**

- [ ] ✅ Aplicação JornadaPro acessando MongoDB corretamente
- [ ] ✅ Todas as funcionalidades testadas e funcionando:
  - [ ] Apontamentos de Fábrica
  - [ ] Apontamentos de Viagem
  - [ ] Cadastro de Empresas
  - [ ] Cadastro de Funcionários
  - [ ] Feriados
  - [ ] Relatórios Mensais
  - [ ] Logs de Erros
- [ ] ✅ Sem erros relacionados ao acesso ao banco
- [ ] ✅ Performance adequada

**Observações:**
```
_________________________________________________
_________________________________________________
```

---

### **3. Backup das Tabelas Criado**

- [ ] ✅ Backup completo do banco criado (via Supabase Dashboard)
- [ ] ✅ Backup verificado e acessível
- [ ] ✅ Localização do backup documentada

**Localização do Backup:**
```
_________________________________________________
_________________________________________________
```

---

### **4. Testes Completos Realizados**

- [ ] ✅ Testes de funcionalidades realizados
- [ ] ✅ Testes de integração realizados
- [ ] ✅ Testes de performance realizados
- [ ] ✅ Testes em produção/staging realizados (se aplicável)
- [ ] ✅ Sem bugs críticos identificados

**Resultados dos Testes:**
```
_________________________________________________
_________________________________________________
```

---

### **5. Sem Dependências Quebradas**

- [ ] ✅ Verificado que não há outras tabelas dependendo das tabelas do JornadaPro
- [ ] ✅ Verificado que não há funções/procedures dependendo dessas tabelas
- [ ] ✅ Verificado que não há views dependendo dessas tabelas
- [ ] ✅ Verificado que não há triggers dependendo dessas tabelas

**Queries Executadas:**
- [ ] `SQL_VERIFICAR_TABELAS_JORNADAPRO.sql` - Query 2 (Foreign Keys)
- [ ] Outras verificações necessárias

**Observações:**
```
_________________________________________________
_________________________________________________
```

---

### **6. Confirmação Final**

- [ ] ✅ Todos os itens anteriores foram verificados
- [ ] ✅ Equipe técnica confirmou que está seguro remover
- [ ] ✅ Data/hora de remoção agendada (se aplicável)
- [ ] ✅ Plano de rollback definido (caso necessário)

**Confirmação:**
```
Estou ciente de que após a execução do script SQL_REMOVER_TABELAS_JORNADAPRO.sql,
as tabelas serão permanentemente removidas do Supabase.

Assinatura: _______________
Data: _______________
```

---

## 📊 Resumo da Verificação

### **Resultado Final:**

- [ ] ✅ **APROVADO** - Pronto para executar script de remoção
- [ ] ❌ **PENDENTE** - Ainda há itens a verificar
- [ ] ⏸️ **AGUARDANDO** - Aguardando confirmação adicional

---

## 🚨 Avisos Importantes

### **⚠️ ANTES DE EXECUTAR O SCRIPT:**

1. ✅ **Backup obrigatório** - Certifique-se de ter backup completo
2. ✅ **Ambiente de teste** - Se possível, teste primeiro em ambiente de staging
3. ✅ **Janela de manutenção** - Execute em horário de baixo uso (se aplicável)
4. ✅ **Monitoramento** - Monitore a aplicação após a remoção

### **📝 Após Executar o Script:**

1. ✅ Verificar que as tabelas foram removidas
2. ✅ Monitorar aplicação por algumas horas/dias
3. ✅ Verificar logs da aplicação
4. ✅ Confirmar que tudo continua funcionando

---

## 📋 Tabelas que Serão Removidas

1. `Logs_Erros`
2. `Relatorios_Mensais`
3. `Apontamentos_Fabrica`
4. `Apontamentos_Viagem`
5. `Feriados`
6. `Funcionarios`
7. `Empresas`

**Total:** 7 tabelas

---

## 🔄 Plano de Rollback (Se Necessário)

Se algo der errado após a remoção:

1. ✅ Restaurar backup do banco de dados
2. ✅ Reverter código da aplicação (se necessário)
3. ✅ Documentar problema encontrado
4. ✅ Reavaliar migração

**Tempo estimado para rollback:** _______________

---

## ✅ Assinaturas e Aprovações

| Função | Nome | Assinatura | Data |
|--------|------|------------|------|
| Desenvolvedor Responsável | | | |
| Tech Lead / Supervisor | | | |
| Gerente de Projeto | | | |

---

## 📝 Observações Finais

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```
