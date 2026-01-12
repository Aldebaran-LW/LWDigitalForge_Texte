# 🔄 Guia: Automação de Liberação - Opções e Recomendações

## 📋 Visão Geral

Este guia compara as opções para automatizar a liberação de usuários no sistema, incluindo:
1. Scripts Node.js com Cron Jobs
2. n8n (workflow automation)
3. Supabase Edge Functions + Cron Jobs

---

## 🎯 Situação Atual

Baseado nos dados SQL fornecidos, temos:

### **Tabelas Utilizadas:**
- ✅ `user_purchases` - Compras/assinaturas (LIFETIME, MONTHLY, ANNUAL)
- ✅ `user_trials` - Trials/períodos de teste
- ✅ `profiles` - Perfis com `is_liberado` e `data_vencimento`
- ⚠️ `user_product_access` - Tabela legada (pode ser migrada)

### **Sistema Atual:**
- ✅ Triggers automáticos atualizam `is_liberado` quando há mudanças
- ✅ Função `update_user_liberado_status()` para atualizar manualmente
- ✅ Scripts agentes para criação manual de trials/compras

---

## 🤔 O Que Precisa Ser Automatizado?

### **Cenários de Automação:**

1. **Sincronização Periódica**
   - Atualizar status de liberação periodicamente (verificar expirações)
   - Garantir consistência dos dados

2. **Migração de Dados**
   - Migrar dados de `user_product_access` para `user_trials`/`user_purchases`
   - Sincronizar dados de sistemas externos

3. **Liberação Automática**
   - Liberar usuários baseado em eventos externos
   - Processar filas de liberação

---

## ⚖️ Comparação de Soluções

### **1. Scripts Node.js + Cron Jobs (Recomendado para Início)**

#### ✅ **Vantagens:**
- ✅ Já temos os scripts criados
- ✅ Sem custo adicional
- ✅ Controle total sobre a lógica
- ✅ Fácil de debugar e manter
- ✅ Funciona em qualquer servidor (Render, Hostinger, VPS)

#### ❌ **Desvantagens:**
- ❌ Precisa de servidor sempre rodando (ou cron job)
- ❌ Gerenciamento manual do cron
- ❌ Logs precisam ser configurados manualmente

#### **Implementação:**

**Opção A: Render Cron Jobs**
```yaml
# render.yaml
services:
  - type: cron
    name: liberacao-automatica
    env: node
    schedule: "0 * * * *" # A cada hora
    buildCommand: npm install
    startCommand: node scripts/agente-liberacao-automatica.js
    envVars:
      - key: VITE_SUPABASE_URL
        value: https://wwwwyuwighdehmvnolrl.supabase.co
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

**Opção B: Hostinger Cron Job**
```bash
# No painel Hostinger, criar cron job:
0 * * * * cd /caminho/do/projeto && node scripts/agente-liberacao-automatica.js
```

**Opção C: GitHub Actions (Grátis)**
```yaml
# .github/workflows/liberacao-automatica.yml
name: Liberação Automática

on:
  schedule:
    - cron: '0 * * * *' # A cada hora
  workflow_dispatch: # Execução manual

jobs:
  liberar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node scripts/agente-liberacao-automatica.js
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

### **2. n8n (Workflow Automation)**

#### ✅ **Vantagens:**
- ✅ Interface visual para criar workflows
- ✅ Muitos conectores pré-configurados
- ✅ Webhooks e triggers automáticos
- ✅ Fácil de usar para não-programadores
- ✅ Self-hosted (grátis) ou cloud (pago)

#### ❌ **Desvantagens:**
- ❌ Precisa de servidor para self-hosted
- ❌ Cloud n8n tem custo mensal
- ❌ Curva de aprendizado para workflows complexos
- ❌ Mais complexo para lógica de negócio customizada

#### **Quando Usar n8n:**
- ✅ Se você precisa de workflows visuais
- ✅ Se precisa integrar com muitas APIs externas
- ✅ Se tem usuários não-técnicos criando automações
- ✅ Se já usa n8n para outras automações

#### **Exemplo de Workflow n8n:**
1. **Trigger:** Cron (a cada hora)
2. **Supabase:** Query para buscar usuários que precisam atualização
3. **Loop:** Para cada usuário
4. **Supabase:** Chamar função `update_user_liberado_status`
5. **Notificação:** Enviar email/Webhook se houver erros

---

### **3. Supabase Edge Functions + Cron Jobs**

#### ✅ **Vantagens:**
- ✅ Integração nativa com Supabase
- ✅ Executa próximo ao banco (baixa latência)
- ✅ Sem servidor separado necessário
- ✅ Escalável automaticamente

#### ❌ **Desvantagens:**
- ❌ Precisa usar Supabase CLI para deploy
- ❌ Limitações de tempo de execução
- ❌ Cron jobs no Supabase são pagos (se disponíveis)

---

## 🎯 Recomendação

### **Para Começar: Scripts Node.js + GitHub Actions**

**Por quê?**
1. ✅ **Grátis** - GitHub Actions oferece 2000 minutos/mês grátis
2. ✅ **Já temos os scripts** - Só precisa configurar o workflow
3. ✅ **Fácil de manter** - Código versionado no Git
4. ✅ **Logs automáticos** - GitHub Actions mostra logs
5. ✅ **Sem servidor necessário** - Executa na nuvem do GitHub

### **Para Escalar: n8n Self-Hosted (se necessário)**

**Quando considerar:**
- Quando precisar de workflows mais complexos
- Quando precisar integrar com múltiplas APIs
- Quando usuários não-técnicos precisarem criar automações

---

## 🚀 Implementação Recomendada

### **Passo 1: Usar Script de Liberação Automática**

Já criamos o script `agente-liberacao-automatica.js` que:
- ✅ Atualiza status de liberação de todos os usuários
- ✅ Pode sincronizar dados de `user_product_access` (opcional)
- ✅ Gera relatório de status

### **Passo 2: Configurar GitHub Actions (Grátis)**

Criar workflow que executa a cada hora.

### **Passo 3: Monitorar e Ajustar**

Ajustar frequência conforme necessário.

---

## 📝 Próximos Passos

1. **Testar o script localmente:**
   ```bash
   node scripts/agente-liberacao-automatica.js
   ```

2. **Configurar GitHub Actions** (se escolher esta opção)

3. **Configurar n8n** (se escolher esta opção)

4. **Migrar dados de user_product_access** (se necessário):
   ```bash
   node scripts/agente-liberacao-automatica.js --sync-user-product-access
   ```

---

## 🔧 Configuração GitHub Actions (Recomendado)

Veja o arquivo `.github/workflows/liberacao-automatica.yml` (será criado).

---

## 📞 Decisão

**Qual opção você prefere?**

1. **GitHub Actions** (Grátis, fácil, recomendado) ⭐
2. **Render Cron Jobs** (Se já usar Render)
3. **Hostinger Cron** (Se já usar Hostinger)
4. **n8n** (Se precisa de workflows visuais)

**Vantagem dos Scripts Node.js:**
- ✅ Funciona com QUALQUER opção acima
- ✅ Portável e flexível
- ✅ Você escolhe onde executar

---

## ✅ Conclusão

**Recomendação:** Começar com **Scripts Node.js + GitHub Actions**

- Grátis
- Fácil de configurar
- Já temos os scripts
- Pode migrar para n8n depois se necessário

Quer que eu crie o workflow do GitHub Actions agora?
