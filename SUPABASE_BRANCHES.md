# 🌿 Supabase Branches - Como Funciona

## 📚 O que são Supabase Branches?

Supabase Branches são **ambientes isolados** de banco de dados que permitem testar mudanças sem afetar produção. É similar ao Git branches, mas para bancos de dados.

## 🎯 Como Funciona

### **Estrutura:**
```
Projeto Principal (main)
├── Branch: main (produção)
│   └── Banco de dados de produção
│   └── URL: https://wwwwyuwighdehmvnolrl.supabase.co
│
└── Branch: feat/supabase-registered-apps-integration (desenvolvimento)
    └── Banco de dados isolado para testes
    └── URL: https://[branch-id].supabase.co
```

### **Características:**
- ✅ **Isolamento completo**: Cada branch tem seu próprio banco de dados
- ✅ **Credenciais únicas**: Cada branch tem sua própria URL e keys
- ✅ **Migrations independentes**: Você pode testar migrations sem afetar produção
- ✅ **Dados isolados**: Dados de uma branch não afetam outras
- ✅ **Merge**: Quando pronto, você faz merge da branch para produção

## 🔄 Fluxo de Trabalho

### **1. Branch Principal (main)**
- Usa o projeto Supabase principal
- Banco de dados de produção
- Migrations aplicadas diretamente

### **2. Branch de Feature (feat/supabase-registered-apps-integration)**
- Cria uma branch do Supabase
- Banco de dados isolado para testes
- Migrations aplicadas apenas na branch
- Quando fazer merge, as migrations são aplicadas em produção

## ⚙️ Configuração

### **Opção A: Branches Automáticas via GitHub Integration**
- Supabase cria branches automaticamente para cada Pull Request
- Integração nativa com GitHub
- Branches são criadas/deletadas automaticamente

### **Opção B: Branches Persistentes (Manual)**
- Criar branch manualmente no dashboard
- Branch persiste até ser deletada
- Mais controle sobre o ciclo de vida

## 📋 Vantagens

1. **Segurança**: Testar migrations sem risco para produção
2. **Isolamento**: Dados de teste não poluem produção
3. **Colaboração**: Cada desenvolvedor pode ter sua própria branch
4. **Testes**: Testar features completas antes de merge

## 🔧 Implementação

Vou configurar para usar:
- **main** → Projeto principal (produção)
- **feat/supabase-registered-apps-integration** → Branch do Supabase (desenvolvimento)
