# 🧪 Como Executar os Testes de Google OAuth

Este guia explica como executar os testes para validar a funcionalidade de login e cadastro com Google OAuth.

## 🚀 Execução Rápida

### Opção 1: Script PowerShell (Windows)

```powershell
.\scripts\test-google-oauth.ps1
```

### Opção 2: NPM Script

```bash
npm run test:google-oauth
```

### Opção 3: Node.js Direto

```bash
node scripts/test-google-oauth.js
```

## 📋 Pré-requisitos

1. **Node.js instalado** (versão 16 ou superior)
2. **Variáveis de ambiente configuradas** no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://[seu-projeto-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
3. **Dependências instaladas**:
   ```bash
   npm install
   ```

## 📝 O que os Testes Verificam

Os testes automáticos verificam:

- ✅ **Variáveis de Ambiente**: Se estão configuradas corretamente
- ✅ **Conexão com Supabase**: Se consegue conectar ao banco
- ✅ **Tabela profiles**: Se a estrutura está correta
- ✅ **Políticas RLS**: Se a segurança está ativa
- ✅ **Verificação de Perfil**: Se o código trata corretamente perfis inexistentes

Os testes manuais (em `TESTES_GOOGLE_OAUTH.md`) verificam:

- ✅ Fluxo completo de login
- ✅ Criação automática de perfil
- ✅ Captura de dados do Google
- ✅ Tratamento de erros
- ✅ Atualização de dados

## 🔍 Interpretando os Resultados

### ✅ Todos os Testes Passaram

```
✅ Variáveis de Ambiente
✅ Conexão Supabase
✅ Tabela profiles
✅ Políticas RLS
✅ Verificação de Perfil

Total: 5/5 testes passaram
```

**Próximos passos:**
1. Configure o Google OAuth no Supabase Dashboard
2. Aplique a migration do banco de dados
3. Execute os testes manuais

### ⚠️ Alguns Testes Falharam

```
✅ Variáveis de Ambiente
❌ Conexão Supabase
✅ Tabela profiles
...

Total: 3/5 testes passaram
```

**Ações:**
1. Revise os erros específicos
2. Verifique a configuração do Supabase
3. Consulte `CONFIGURAR_GOOGLE_OAUTH.md` para troubleshooting

### ❌ Erro: Variáveis de Ambiente Não Configuradas

```
❌ VITE_SUPABASE_URL: Não configurada
❌ VITE_SUPABASE_ANON_KEY: Não configurada
```

**Solução:**
1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as variáveis necessárias
3. Execute os testes novamente

## 🧪 Testes Manuais

Após os testes automáticos, execute os testes manuais descritos em `TESTES_GOOGLE_OAUTH.md`:

1. **Teste de Login**: Faça login com uma conta Google nova
2. **Verificação no Banco**: Confirme que o perfil foi criado
3. **Teste de Erros**: Teste cenários de erro
4. **Teste de Atualização**: Verifique se dados são atualizados

## 🐛 Troubleshooting

### Erro: "Cannot find module 'dotenv'"

**Solução:**
```bash
npm install dotenv --save-dev
```

### Erro: "Variáveis de ambiente não configuradas"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as variáveis estão nomeadas corretamente:
   - `VITE_SUPABASE_URL` (não `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (não `SUPABASE_ANON_KEY`)

### Erro: "Falha na conexão com Supabase"

**Solução:**
1. Verifique se a URL do Supabase está correta
2. Verifique se a chave anon está correta
3. Verifique sua conexão com a internet
4. Verifique se o projeto Supabase está ativo

### Erro: "RLS pode não estar ativo"

**Solução:**
1. Verifique se as políticas RLS estão configuradas
2. Execute a migration inicial se ainda não foi aplicada
3. Consulte `supabase/migrations/20250101000000_initial_schema.sql`

## 📚 Documentação Relacionada

- **Configuração**: `CONFIGURAR_GOOGLE_OAUTH.md`
- **Testes Detalhados**: `TESTES_GOOGLE_OAUTH.md`
- **Migrations**: `supabase/migrations/README.md`

## 💡 Dicas

1. **Execute os testes antes de fazer deploy** para garantir que tudo está funcionando
2. **Execute os testes após aplicar migrations** para validar mudanças
3. **Use os testes manuais** para validar o fluxo completo do usuário
4. **Mantenha os testes atualizados** quando fizer mudanças no código

---

**Última atualização**: 2025-01-05

