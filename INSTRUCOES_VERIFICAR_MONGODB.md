# 🔍 Instruções: Verificar MongoDB

## 📋 Resumo Rápido

Para verificar se todos os dados do JornadaPro foram migrados para o MongoDB, você tem 3 opções:

---

## 🚀 Opção 1: Script Node.js (Recomendado)

### **PASSO 1: Instalar dependência**

```bash
npm install mongodb
```

### **PASSO 2: Executar script**

```bash
npm run verify:mongodb
```

Ou diretamente:

```bash
node scripts/verificar-mongodb.js
```

### **O que o script faz:**

- ✅ Conecta ao MongoDB
- ✅ Lista todas as collections
- ✅ Verifica se as 7 collections do JornadaPro existem
- ✅ Conta documentos em cada collection
- ✅ Mostra amostras de dados
- ✅ Mostra resumo completo

---

## 🌐 Opção 2: MongoDB Compass (Interface Gráfica)

### **1. Baixar e Instalar:**

- Download: https://www.mongodb.com/try/download/compass
- Instale e abra o aplicativo

### **2. Conectar:**

1. Cole a URI:
   ```
   mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority
   ```
2. Clique em **Connect**

### **3. Verificar Collections:**

No painel lateral, verifique se existem:
- `apontamentos_fabrica` ou `apontamentosFabrica`
- `apontamentos_viagem` ou `apontamentosViagem`
- `empresas`
- `funcionarios`
- `feriados`
- `relatorios_mensais` ou `relatoriosMensais`
- `logs_erros` ou `logsErros`

---

## 💻 Opção 3: MongoDB Shell (mongosh)

### **1. Instalar mongosh:**

Download: https://www.mongodb.com/try/download/shell

### **2. Conectar:**

```bash
mongosh "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
```

### **3. Verificar:**

```javascript
// Listar collections
show collections

// Contar documentos (tente diferentes nomes)
db.apontamentos_fabrica.countDocuments()
db.apontamentosFabrica.countDocuments()
db.empresas.countDocuments()
db.funcionarios.countDocuments()
```

---

## ✅ O que Verificar

### **Collections Esperadas (7 no total):**

1. ✅ `apontamentos_fabrica` ou `apontamentosFabrica`
2. ✅ `apontamentos_viagem` ou `apontamentosViagem`
3. ✅ `empresas`
4. ✅ `funcionarios`
5. ✅ `feriados`
6. ✅ `relatorios_mensais` ou `relatoriosMensais`
7. ✅ `logs_erros` ou `logsErros`

### **Verificações Importantes:**

- ✅ Todas as 7 collections existem
- ✅ Contagem de documentos > 0 (ou igual ao Supabase)
- ✅ Estrutura dos documentos correta
- ✅ Dados de exemplo presentes

---

## 📊 Comparar com Supabase

Para comparar contagens:

1. **Executar no Supabase SQL Editor:**
   ```sql
   -- Usar arquivo: SQL_VERIFICAR_TABELAS_JORNADAPRO.sql
   -- Query 1: Contagem de registros
   ```

2. **Verificar no MongoDB:**
   - Usar script Node.js ou MongoDB Compass
   - Comparar contagens

3. **Resultado esperado:**
   - Contagem do MongoDB >= contagem do Supabase
   - (Pode ser maior se houver novos dados após migração)

---

## 🎯 Próximos Passos

Após verificar:

1. ✅ Confirmar que todas as collections existem
2. ✅ Verificar contagens
3. ✅ Testar aplicação
4. ✅ Preencher checklist de confirmação
5. ⏭️ Proceder com remoção das tabelas do Supabase (se tudo OK)

---

## 📝 Documentação Completa

Para detalhes completos, consulte: `GUIA_VERIFICAR_MONGODB.md`
