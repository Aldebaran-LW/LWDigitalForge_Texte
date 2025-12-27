# ✅ Guia de Verificação - Supabase

Este guia ajuda você a verificar se todas as funcionalidades do Supabase estão funcionando corretamente após a configuração.

## 🚀 Status da Configuração

- ✅ **Arquivo corrigido**: `src/lib/customSupabaseClient.js`
- ✅ **Variáveis de ambiente**: Configuradas com fallback
- ✅ **Arquivo .env**: Criado e configurado
- ✅ **Testes de conexão**: Todos passaram (4/4)

## 📋 Checklist de Verificação

### 1. Servidor de Desenvolvimento

O servidor deve estar rodando em: **http://localhost:3000**

```bash
# Se não estiver rodando, execute:
npm run dev
```

**Verificar:**
- [ ] Servidor inicia sem erros
- [ ] Página inicial carrega corretamente
- [ ] Sem erros no console do navegador relacionados ao Supabase

---

### 2. Autenticação - Login e Cadastro

#### 2.1 Página de Login
**URL:** http://localhost:3000/login

**Testar:**
- [ ] Página carrega sem erros
- [ ] Formulário de login aparece
- [ ] Tentar fazer login com credenciais existentes
- [ ] Verificar se redireciona corretamente após login

#### 2.2 Página de Cadastro
**URL:** http://localhost:3000/cadastro

**Testar:**
- [ ] Página carrega sem erros
- [ ] Formulário de cadastro aparece
- [ ] Criar uma nova conta de teste
- [ ] Verificar se recebe email de confirmação (se configurado)
- [ ] Verificar se redireciona após cadastro

#### 2.3 Recuperação de Senha
**URL:** http://localhost:3000/esqueci-senha

**Testar:**
- [ ] Página carrega sem erros
- [ ] Formulário funciona
- [ ] Email de recuperação é enviado (se configurado)

---

### 3. Produtos e Carrinho

#### 3.1 Lista de Produtos
**URL:** http://localhost:3000/produtos

**Testar:**
- [ ] Produtos são carregados do Supabase
- [ ] Imagens aparecem corretamente
- [ ] Preços são exibidos corretamente
- [ ] Botão "Adicionar ao Carrinho" funciona

#### 3.2 Detalhes do Produto
**URL:** http://localhost:3000/produtos/[id]

**Testar:**
- [ ] Página carrega com dados do produto
- [ ] Informações corretas são exibidas
- [ ] Botão de compra funciona

#### 3.3 Carrinho de Compras
**URL:** http://localhost:3000/carrinho

**Testar:**
- [ ] Carrinho abre corretamente
- [ ] Itens adicionados aparecem
- [ ] Quantidade pode ser alterada
- [ ] Itens podem ser removidos
- [ ] Total é calculado corretamente

---

### 4. Checkout e Pagamentos

#### 4.1 Processo de Checkout
**Testar:**
- [ ] Botão "Finalizar Compra" aparece quando há itens no carrinho
- [ ] Checkout inicia corretamente
- [ ] Integração com Mercado Pago funciona (se configurado)
- [ ] Edge Function `create-checkout` é chamada

**Verificar no Console:**
- [ ] Sem erros relacionados ao Supabase
- [ ] Sem erros relacionados ao Mercado Pago
- [ ] Requisições para Edge Functions são bem-sucedidas

---

### 5. Portal do Usuário

#### 5.1 Meus Produtos
**URL:** http://localhost:3000/portal/meus-produtos

**Testar (requer login):**
- [ ] Redireciona para login se não autenticado
- [ ] Carrega produtos comprados do usuário
- [ ] Exibe informações corretas das compras

#### 5.2 Testes Gratuitos
**URL:** http://localhost:3000/portal/testes

**Testar:**
- [ ] Lista de trials ativos
- [ ] Informações de expiração corretas

#### 5.3 Pagamentos
**URL:** http://localhost:3000/portal/pagamentos

**Testar:**
- [ ] Histórico de pagamentos carrega
- [ ] Status das compras está correto

---

### 6. Painel Administrativo

#### 6.1 Dashboard Admin
**URL:** http://localhost:3000/admin/dashboard

**Testar (requer login como ADMIN):**
- [ ] Redireciona para login se não autenticado
- [ ] Bloqueia acesso se não for ADMIN
- [ ] Estatísticas são carregadas do Supabase
- [ ] Gráficos e métricas aparecem

#### 6.2 Gerenciar Produtos
**URL:** http://localhost:3000/admin/produtos

**Testar:**
- [ ] Lista de produtos carrega
- [ ] Pode criar novo produto
- [ ] Pode editar produtos existentes
- [ ] Pode deletar produtos

#### 6.3 Gerenciar Usuários
**URL:** http://localhost:3000/admin/usuarios

**Testar:**
- [ ] Lista de usuários carrega
- [ ] Informações dos perfis são exibidas
- [ ] Pode visualizar detalhes dos usuários

#### 6.4 Vendas
**URL:** http://localhost:3000/admin/vendas

**Testar:**
- [ ] Lista de vendas carrega
- [ ] Filtros funcionam
- [ ] Estatísticas são exibidas

---

### 7. Verificação no Console do Navegador

Abra o **DevTools** (F12) e verifique:

#### 7.1 Console
- [ ] Sem erros vermelhos relacionados ao Supabase
- [ ] Conexão estabelecida com sucesso
- [ ] Queries executadas sem erros

#### 7.2 Network (Rede)
- [ ] Requisições para `wwwwyuwighdehmvnolrl.supabase.co` são bem-sucedidas
- [ ] Status 200 ou 201 para operações
- [ ] Sem erros 401 (não autorizado) ou 403 (proibido)

#### 7.3 Application/Storage
- [ ] Sessão do Supabase é salva corretamente
- [ ] Tokens de autenticação estão presentes

---

### 8. Testes Automatizados

Execute os testes de conexão:

```bash
npm run test:supabase
```

**Resultado esperado:**
- ✅ Conexão Básica
- ✅ Sistema de Autenticação
- ✅ Tabelas do Banco
- ✅ Edge Functions

---

## 🔍 Troubleshooting

### Problema: Erro de conexão com Supabase

**Sintomas:**
- Erro no console: "Failed to fetch" ou "Network error"
- Página não carrega dados

**Soluções:**
1. Verifique se o arquivo `.env` existe e tem as credenciais corretas
2. Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
3. Execute `npm run test:supabase` para diagnosticar
4. Verifique se o projeto Supabase está ativo

### Problema: Erro de autenticação

**Sintomas:**
- Login não funciona
- Erro 401 ou 403

**Soluções:**
1. Verifique se a chave `VITE_SUPABASE_ANON_KEY` está correta
2. Verifique as políticas RLS no Supabase Dashboard
3. Verifique se o email foi confirmado (se necessário)

### Problema: Tabelas não encontradas

**Sintomas:**
- Erro: "relation does not exist"
- Dados não carregam

**Soluções:**
1. Verifique se as migrations foram aplicadas no Supabase
2. Execute: `supabase db push` (se tiver CLI configurado)
3. Verifique no Supabase Dashboard se as tabelas existem

### Problema: Edge Functions não funcionam

**Sintomas:**
- Checkout não inicia
- Erro ao chamar funções

**Soluções:**
1. Verifique se as Edge Functions foram deployadas
2. Verifique os secrets no Supabase Dashboard
3. Verifique os logs das Edge Functions no Supabase Dashboard

---

## 📝 Notas Finais

### Para Produção (Vercel)

Configure as seguintes variáveis de ambiente no painel da Vercel:

```
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ou** deixe como está - o fallback hardcoded funcionará automaticamente.

### Segurança

- ✅ A chave `VITE_SUPABASE_ANON_KEY` é pública (segura para frontend)
- ✅ Protegida por RLS (Row Level Security) no Supabase
- ✅ Chaves privadas (SERVICE_ROLE_KEY) nunca devem ter prefixo `VITE_`

---

## ✅ Conclusão

Após verificar todos os itens acima, sua aplicação deve estar totalmente funcional com o Supabase!

**Última atualização:** Configuração concluída com sucesso ✅













