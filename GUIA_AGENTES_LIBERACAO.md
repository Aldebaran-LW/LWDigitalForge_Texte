# 🤖 Guia: Agentes para Liberação de Usuários

## 📋 Visão Geral

Este guia explica como usar os scripts "agentes" para automatizar a liberação de usuários/clientes no sistema. Os agentes permitem criar trials, compras e assinaturas de forma automatizada.

---

## 🚀 Agentes Disponíveis

### 1. **Agente: Criar Trial** (`agente-criar-trial.js`)
Cria um trial (período de teste) para um usuário específico.

### 2. **Agente: Criar Compra/Assinatura** (`agente-criar-compra.js`)
Cria uma compra ou assinatura (LIFETIME, MONTHLY, ANNUAL) para um usuário.

### 3. **Agente: Liberação em Lote** (`agente-liberacao-lote.js`)
Processa múltiplas liberações de uma vez através de um arquivo CSV ou JSON.

---

## 📦 Pré-requisitos

1. **Node.js instalado** (versão 14 ou superior)
2. **Dependências instaladas:**
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. **Credenciais configuradas:**
   - As credenciais padrão já estão configuradas nos scripts
   - **Opcional:** Para operações administrativas, configure `SUPABASE_SERVICE_ROLE_KEY` no arquivo `.env`

---

## 🔧 Como Usar

### **Agente 1: Criar Trial**

Cria um trial para um usuário em um app específico.

#### **Sintaxe:**
```bash
node scripts/agente-criar-trial.js <email_usuario> <app_id_ou_nome> [dias_trial]
```

#### **Parâmetros:**
- `email_usuario`: Email do usuário
- `app_id_ou_nome`: ID (UUID) ou nome do app
- `dias_trial`: (Opcional) Número de dias do trial. Se não especificado, usa o valor configurado no app ou 7 dias por padrão

#### **Exemplos:**
```bash
# Criar trial com período padrão
node scripts/agente-criar-trial.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000

# Criar trial com 14 dias
node scripts/agente-criar-trial.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 14

# Usar nome do app
node scripts/agente-criar-trial.js usuario@email.com "JornadaPro" 30
```

#### **O que faz:**
1. ✅ Busca o usuário pelo email
2. ✅ Busca o app pelo ID ou nome
3. ✅ Verifica se já existe trial ativo (avisa, mas não impede)
4. ✅ Cria o trial na tabela `user_trials`
5. ✅ **Automaticamente atualiza** `is_liberado` e `data_vencimento` (via trigger)

---

### **Agente 2: Criar Compra/Assinatura**

Cria uma compra ou assinatura para um usuário.

#### **Sintaxe:**
```bash
node scripts/agente-criar-compra.js <email_usuario> <app_id_ou_nome> <tipo> [dias_duracao]
```

#### **Parâmetros:**
- `email_usuario`: Email do usuário
- `app_id_ou_nome`: ID (UUID) ou nome do app
- `tipo`: Tipo de compra (`LIFETIME`, `MONTHLY`, `ANNUAL`)
- `dias_duracao`: (Opcional) Duração personalizada em dias (apenas para MONTHLY/ANNUAL)

#### **Tipos de Compra:**
- **`LIFETIME`**: Compra vitalícia (não expira)
- **`MONTHLY`**: Assinatura mensal (1 mês por padrão)
- **`ANNUAL`**: Assinatura anual (1 ano por padrão)

#### **Exemplos:**
```bash
# Criar compra vitalícia
node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 LIFETIME

# Criar assinatura mensal
node scripts/agente-criar-compra.js usuario@email.com "JornadaPro" MONTHLY

# Criar assinatura anual
node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 ANNUAL

# Criar assinatura mensal com duração personalizada (60 dias)
node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 MONTHLY 60
```

#### **O que faz:**
1. ✅ Valida o tipo de compra
2. ✅ Busca o usuário pelo email
3. ✅ Busca o app pelo ID ou nome
4. ✅ Calcula data de expiração (ou usa 2099-01-01 para LIFETIME)
5. ✅ Cria a compra na tabela `user_purchases` com status `APPROVED`
6. ✅ **Automaticamente atualiza** `is_liberado` e `data_vencimento` (via trigger)

---

### **Agente 3: Liberação em Lote**

Processa múltiplas liberações através de um arquivo CSV ou JSON.

#### **Sintaxe:**
```bash
node scripts/agente-liberacao-lote.js <arquivo.csv|json> [tipo_liberacao]
```

#### **Parâmetros:**
- `arquivo.csv|json`: Caminho para o arquivo com os dados
- `tipo_liberacao`: (Opcional) Tipo padrão se não especificado no arquivo (`trial` ou `compra`)

#### **Formato CSV:**

Crie um arquivo `usuarios.csv`:
```csv
email,app_id,tipo_liberacao,dias_trial
usuario1@email.com,123e4567-e89b-12d3-a456-426614174000,trial,14
usuario2@email.com,123e4567-e89b-12d3-a456-426614174000,trial,30
usuario3@email.com,123e4567-e89b-12d3-a456-426614174000,compra,LIFETIME
```

**Campos:**
- `email`: Email do usuário (obrigatório)
- `app_id`: ID ou nome do app (obrigatório)
- `tipo_liberacao`: `trial` ou `compra` (opcional se especificar no comando)
- `dias_trial`: Número de dias (apenas para trials)
- `tipo_compra`: `LIFETIME`, `MONTHLY`, `ANNUAL` (apenas para compras)

#### **Formato JSON:**

Crie um arquivo `liberacoes.json`:
```json
[
  {
    "email": "usuario1@email.com",
    "app_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo_liberacao": "trial",
    "dias_trial": 14
  },
  {
    "email": "usuario2@email.com",
    "app_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo_liberacao": "compra",
    "tipo_compra": "LIFETIME"
  },
  {
    "email": "usuario3@email.com",
    "app_id": "JornadaPro",
    "tipo_liberacao": "compra",
    "tipo_compra": "MONTHLY"
  }
]
```

#### **Exemplos:**
```bash
# Processar arquivo CSV com trials
node scripts/agente-liberacao-lote.js usuarios.csv trial

# Processar arquivo JSON com compras
node scripts/agente-liberacao-lote.js liberacoes.json compra

# Processar arquivo que já tem tipo_liberacao definido
node scripts/agente-liberacao-lote.js usuarios_mistos.csv
```

#### **O que faz:**
1. ✅ Carrega o arquivo CSV ou JSON
2. ✅ Para cada linha/item:
   - Busca o usuário
   - Busca o app
   - Cria trial ou compra conforme especificado
3. ✅ Exibe resumo com sucessos e falhas

---

## ⚙️ Configuração Avançada

### **Usando Service Role Key (Recomendado para Produção)**

Para operações administrativas, é recomendado usar a Service Role Key, que ignora políticas RLS:

1. **Obter a Service Role Key:**
   - Acesse o Supabase Dashboard
   - Vá em Settings → API
   - Copie a `service_role` key (⚠️ **NUNCA** exponha esta chave publicamente)

2. **Configurar no .env:**
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

3. **Os scripts usarão automaticamente a Service Role Key se estiver configurada.**

---

## 📊 Como Funciona a Liberação Automática

Os agentes criam registros nas tabelas `user_trials` ou `user_purchases`. O sistema possui **triggers automáticos** que atualizam as colunas `is_liberado` e `data_vencimento` na tabela `profiles` sempre que:

- ✅ Um trial é criado/atualizado/removido
- ✅ Uma compra é criada/atualizada/removida

**Não é necessário** executar nenhum comando adicional - a liberação é **instantânea e automática**.

---

## 🔍 Verificando Resultados

### **Verificar usuário liberado:**
```sql
SELECT id, email, is_liberado, data_vencimento
FROM profiles
WHERE email = 'usuario@email.com';
```

### **Verificar trials criados:**
```sql
SELECT ut.*, p.email, ra.name as app_name
FROM user_trials ut
JOIN profiles p ON p.id = ut.user_id
JOIN registered_apps ra ON ra.id = ut.app_id
WHERE p.email = 'usuario@email.com';
```

### **Verificar compras criadas:**
```sql
SELECT up.*, p.email, ra.name as app_name
FROM user_purchases up
JOIN profiles p ON p.id = up.user_id
JOIN registered_apps ra ON ra.id = up.app_id
WHERE p.email = 'usuario@email.com';
```

---

## ⚠️ Observações Importantes

1. **Permissões:**
   - Os scripts funcionam com a chave `anon`, mas é necessário que o usuário que executa tenha permissões de admin
   - Para produção, use `SUPABASE_SERVICE_ROLE_KEY`

2. **Trials Duplicados:**
   - O script verifica trials existentes, mas não impede criação
   - Múltiplos trials podem existir, mas apenas os ativos e não expirados contam

3. **Compras Duplicadas:**
   - O sistema permite múltiplas compras do mesmo tipo
   - A liberação considera a compra com maior prioridade (LIFETIME > ANNUAL > MONTHLY > Trial)

4. **Performance:**
   - O script de lote processa uma linha por vez (com pequeno delay)
   - Para muitos registros, pode levar alguns minutos

---

## 🐛 Troubleshooting

### **Erro: "Usuário não encontrado"**
- Verifique se o email está correto
- Verifique se o usuário existe na tabela `profiles`

### **Erro: "App não encontrado"**
- Verifique se o ID ou nome do app está correto
- Use o ID completo (UUID) ou nome exato do app

### **Erro: "permission denied"**
- Se usando chave `anon`, verifique permissões RLS
- Configure `SUPABASE_SERVICE_ROLE_KEY` no .env

### **Erro: "duplicate key"**
- Pode ocorrer se tentar criar trial/compra duplicada
- O sistema permite múltiplos, mas verifique se é intencional

---

## 📝 Exemplos Práticos

### **Exemplo 1: Liberar trial para cliente após contato**
```bash
node scripts/agente-criar-trial.js cliente@empresa.com "JornadaPro" 14
```

### **Exemplo 2: Conceder acesso vitalício a parceiro**
```bash
node scripts/agente-criar-compra.js parceiro@empresa.com 123e4567-e89b-12d3-a456-426614174000 LIFETIME
```

### **Exemplo 3: Migrar múltiplos usuários**
Crie `migracao.csv`:
```csv
email,app_id,tipo_liberacao,tipo_compra
user1@email.com,123e4567-e89b-12d3-a456-426614174000,compra,LIFETIME
user2@email.com,123e4567-e89b-12d3-a456-426614174000,compra,LIFETIME
```

Execute:
```bash
node scripts/agente-liberacao-lote.js migracao.csv
```

---

## ✅ Checklist de Uso

- [ ] Dependências instaladas (`npm install`)
- [ ] (Opcional) Service Role Key configurada no .env
- [ ] Email do usuário verificado
- [ ] App ID ou nome verificado
- [ ] Tipo de liberação escolhido (trial/compra)
- [ ] Parâmetros corretos no comando
- [ ] Resultado verificado após execução

---

## 🚀 Próximos Passos

Após usar os agentes:

1. ✅ Verificar se `is_liberado = true` na tabela `profiles`
2. ✅ Verificar se `data_vencimento` está correto
3. ✅ Testar acesso do usuário no sistema
4. ✅ (Opcional) Notificar o usuário sobre a liberação

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do script
2. Verifique as credenciais do Supabase
3. Verifique permissões RLS
4. Consulte este guia novamente

---

**✨ Os agentes tornam a liberação de usuários muito mais rápida e eficiente!**
