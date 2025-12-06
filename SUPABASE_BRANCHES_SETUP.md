# 🌿 Configuração de Supabase Branches

## 📋 Como Funciona

### **Conceito:**
Supabase Branches cria **ambientes isolados** de banco de dados, similar ao Git branches mas para bancos de dados.

### **Estrutura:**
```
Projeto Supabase Principal (wwwwyuwighdehmvnolrl)
│
├── Main Branch (Produção)
│   └── Banco: Produção
│   └── URL: https://wwwwyuwighdehmvnolrl.supabase.co
│
└── Feature Branch (Desenvolvimento)
    └── Banco: Isolado para testes
    └── URL: https://[branch-id].supabase.co
```

## 🚀 Opções de Implementação

### **Opção 1: GitHub Integration (Recomendado - Mais Fácil)**

O Supabase tem integração nativa com GitHub que cria branches automaticamente:

1. **Habilitar no Supabase:**
   - Acesse: Supabase Dashboard → Settings → Integrations → GitHub
   - Conecte seu repositório GitHub
   - Habilite "Preview Branches"

2. **Como funciona:**
   - Cada Pull Request cria automaticamente uma branch do Supabase
   - A branch é deletada quando o PR é fechado
   - Migrations são aplicadas automaticamente na branch

3. **Vantagens:**
   - ✅ Automático
   - ✅ Sem configuração manual
   - ✅ Branches temporárias (economiza recursos)

### **Opção 2: Branches Persistentes (Manual)**

Criar uma branch persistente para desenvolvimento:

1. **Criar Branch no Dashboard:**
   - Acesse: Supabase Dashboard → Branches
   - Clique em "Create Branch"
   - Nome: `feat-supabase-registered-apps-integration`
   - Base: `main`

2. **Obter Credenciais da Branch:**
   - Após criar, acesse Settings → API da branch
   - Copie a URL e anon key da branch

3. **Configurar no GitHub:**
   - Adicione novos secrets:
     - `VITE_SUPABASE_URL_DEV` (URL da branch)
     - `VITE_SUPABASE_ANON_KEY_DEV` (anon key da branch)

4. **Atualizar Workflow:**
   - O workflow já está preparado para usar branches
   - Apenas precisa das credenciais da branch

### **Opção 3: Usar Mesmo Banco (Atual - Mais Simples)**

Manter como está (todas as branches usam o mesmo banco):

- ✅ Mais simples
- ✅ Sem custos adicionais
- ⚠️ Cuidado ao fazer migrations que possam quebrar produção

## 🔧 Implementação Recomendada

### **Para Desenvolvimento Local:**
- Use Supabase local: `supabase start`
- Teste migrations localmente antes de fazer push

### **Para Branch de Feature:**
- Use GitHub Integration (Opção 1) - cria branch automaticamente
- OU crie branch persistente manualmente (Opção 2)

### **Para Produção (main):**
- Sempre usa o projeto principal
- Migrations aplicadas diretamente

## 📝 Próximos Passos

1. **Decidir qual opção usar:**
   - Opção 1: Habilitar GitHub Integration no Supabase
   - Opção 2: Criar branch persistente manualmente
   - Opção 3: Manter como está (mesmo banco)

2. **Se escolher Opção 1 ou 2:**
   - Configurar credenciais da branch no GitHub
   - Atualizar workflow para usar credenciais corretas

3. **Testar:**
   - Fazer push na branch de feature
   - Verificar se migrations são aplicadas na branch correta

## 🔗 Recursos

- [Supabase Branches Docs](https://supabase.com/docs/guides/deployment/branching)
- [GitHub Integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
- [Working with Branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches)
