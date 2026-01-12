# 🔍 Guia: Verificar Dados no MongoDB

## 📋 Objetivo

Verificar se todos os dados do JornadaPro foram migrados corretamente do Supabase para o MongoDB.

---

## 🚀 Método 1: Script Node.js (Recomendado)

### **Pré-requisitos:**

1. **Instalar dependências:**
   ```bash
   npm install mongodb dotenv
   ```

2. **Configurar variável de ambiente (opcional):**
   ```env
   MONGODB_URI="mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
   ```

   Ou usar diretamente no script (já configurado).

### **Executar Script:**

```bash
node scripts/verificar-mongodb.js
```

### **O que o script verifica:**

1. ✅ Conexão com MongoDB
2. ✅ Collections disponíveis
3. ✅ Collections esperadas do JornadaPro:
   - `apontamentos_fabrica` / `apontamentosFabrica`
   - `apontamentos_viagem` / `apontamentosViagem`
   - `empresas`
   - `funcionarios`
   - `feriados`
   - `relatorios_mensais` / `relatoriosMensais`
   - `logs_erros` / `logsErros`
4. ✅ Contagem de documentos em cada collection
5. ✅ Amostras de dados
6. ✅ Índices (se houver)

---

## 🌐 Método 2: MongoDB Compass (Interface Gráfica)

### **1. Instalar MongoDB Compass**

- Download: https://www.mongodb.com/try/download/compass
- Instale e abra o aplicativo

### **2. Conectar ao MongoDB**

1. Cole a URI de conexão:
   ```
   mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority
   ```
2. Clique em **Connect**

### **3. Verificar Collections**

1. No painel lateral, você verá todas as databases
2. Expanda o banco de dados (geralmente o nome do cluster ou padrão)
3. Verifique se as seguintes collections existem:
   - `apontamentos_fabrica` ou `apontamentosFabrica`
   - `apontamentos_viagem` ou `apontamentosViagem`
   - `empresas`
   - `funcionarios`
   - `feriados`
   - `relatorios_mensais` ou `relatoriosMensais`
   - `logs_erros` ou `logsErros`

### **4. Verificar Dados**

1. Clique em cada collection
2. Verifique:
   - ✅ Contagem de documentos
   - ✅ Estrutura dos documentos
   - ✅ Dados de exemplo
   - ✅ Índices (aba "Indexes")

---

## 🔧 Método 3: MongoDB Shell (mongosh)

### **1. Instalar MongoDB Shell**

```bash
# Windows (via Chocolatey)
choco install mongosh

# Ou download: https://www.mongodb.com/try/download/shell
```

### **2. Conectar ao MongoDB**

```bash
mongosh "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
```

### **3. Comandos de Verificação**

```javascript
// Listar databases
show dbs

// Usar database (substitua 'nome_do_db' pelo nome real)
use nome_do_db

// Listar collections
show collections

// Contar documentos em cada collection
db.apontamentos_fabrica.countDocuments()
db.apontamentos_viagem.countDocuments()
db.empresas.countDocuments()
db.funcionarios.countDocuments()
db.feriados.countDocuments()
db.relatorios_mensais.countDocuments()
db.logs_erros.countDocuments()

// Ver amostras de dados
db.empresas.find().limit(3)
db.funcionarios.find().limit(3)
db.apontamentos_fabrica.find().limit(3)
```

---

## 📊 Tabela de Comparação (Supabase vs MongoDB)

### **Supabase (PostgreSQL) → MongoDB:**

| Supabase (Tabela) | MongoDB (Collection) | Observações |
|-------------------|---------------------|-------------|
| `Apontamentos_Fabrica` | `apontamentos_fabrica` ou `apontamentosFabrica` | Nome pode variar |
| `Apontamentos_Viagem` | `apontamentos_viagem` ou `apontamentosViagem` | Nome pode variar |
| `Empresas` | `empresas` | Nome pode variar |
| `Funcionarios` | `funcionarios` | Nome pode variar |
| `Feriados` | `feriados` | Nome pode variar |
| `Relatorios_Mensais` | `relatorios_mensais` ou `relatoriosMensais` | Nome pode variar |
| `Logs_Erros` | `logs_erros` ou `logsErros` | Nome pode variar |

---

## ✅ Checklist de Verificação

### **1. Conexão**
- [ ] ✅ Conseguiu conectar ao MongoDB
- [ ] ✅ Banco de dados acessível

### **2. Collections**
- [ ] ✅ Todas as 7 collections encontradas
- [ ] ✅ Nomes das collections corretos

### **3. Dados**
- [ ] ✅ Contagem de documentos verificado
- [ ] ✅ Estrutura dos documentos correta
- [ ] ✅ Dados de exemplo verificados

### **4. Comparação com Supabase**
- [ ] ✅ Contagem similar ao Supabase (ou maior, se houver novos dados)
- [ ] ✅ Dados principais presentes
- [ ] ✅ Relacionamentos mantidos (empresa_id, funcionario_id, etc.)

---

## 🔍 O que Verificar Especificamente

### **1. Empresas**
- ✅ Todas as empresas migradas
- ✅ Campo `nome_empresa` ou `nomeEmpresa` presente
- ✅ Campo `owner_id` ou `ownerId` presente

### **2. Funcionarios**
- ✅ Todos os funcionários migrados
- ✅ Campo `nome` presente
- ✅ Campo `equipe` presente (Fábrica/Viagem)
- ✅ Campo `empresa_id` ou `empresaId` presente

### **3. Apontamentos**
- ✅ Apontamentos de Fábrica migrados
- ✅ Apontamentos de Viagem migrados
- ✅ Campos principais presentes (data, entrada, saida, etc.)
- ✅ Relacionamentos corretos (empresa_id, funcionario_id)

### **4. Outros**
- ✅ Feriados migrados
- ✅ Relatórios Mensais migrados
- ✅ Logs de Erros migrados

---

## 🐛 Troubleshooting

### **Erro: "authentication failed"**

**Causa:** URI incorreta ou credenciais inválidas

**Solução:**
1. Verificar se a URI está correta
2. Verificar se o usuário e senha estão corretos
3. Verificar se o IP está autorizado no MongoDB Atlas

### **Collections não encontradas**

**Causa:** Nomes diferentes (snake_case vs camelCase)

**Solução:**
1. Listar todas as collections para ver os nomes reais
2. Verificar se os nomes estão corretos
3. Ajustar o script se necessário

### **Contagem diferente do Supabase**

**Causa:** Pode haver novos dados ou dados não migrados

**Solução:**
1. Verificar se há novos dados no MongoDB (normais após migração)
2. Se houver dados faltando, verificar processo de migração
3. Comparar IDs específicos se necessário

---

## 📝 Exemplo de Saída do Script

```
🔌 Conectando ao MongoDB...
✅ Conectado ao MongoDB com sucesso!

📊 Banco de dados: jornadapro

📋 Listando collections disponíveis...
Collections encontradas: apontamentos_fabrica, apontamentos_viagem, empresas, funcionarios, feriados, relatorios_mensais, logs_erros

🔍 Verificando collections do JornadaPro...

============================================================
✅ apontamentosFabrica    | apontamentos_fabrica       | 1250 documentos
✅ apontamentosViagem     | apontamentos_viagem        | 890 documentos
✅ empresas                | empresas                   | 15 documentos
✅ funcionarios            | funcionarios               | 120 documentos
✅ feriados                | feriados                   | 45 documentos
✅ relatoriosMensais       | relatorios_mensais         | 300 documentos
✅ logsErros               | logs_erros                 | 67 documentos
============================================================

📊 Resumo:

Collections encontradas: 7/7
Total de documentos: 2687

✅ Todas as collections esperadas foram encontradas!
```

---

## ✅ Próximos Passos

Após verificar que todos os dados estão no MongoDB:

1. ✅ Confirmar que todas as collections existem
2. ✅ Verificar contagem de documentos
3. ✅ Testar funcionalidades da aplicação
4. ✅ Preencher checklist de confirmação
5. ⏭️ Proceder com remoção das tabelas do Supabase

---

## 📞 Suporte

Se encontrar problemas na verificação:

1. Verificar logs do script
2. Verificar conexão com MongoDB
3. Verificar credenciais
4. Consultar documentação do MongoDB
