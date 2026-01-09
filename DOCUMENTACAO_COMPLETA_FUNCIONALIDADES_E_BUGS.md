# 📋 Documentação Completa - Funcionalidades e Bugs Identificados

**Data:** 2025-01-10  
**Projeto:** LWDigitalForge - Site Principal  
**Versão:** 1.0

---

## 🎯 Visão Geral do Sistema

O LWDigitalForge é uma plataforma de e-commerce para venda de produtos digitais (bots Telegram, planilhas Excel, ferramentas de automação) com sistema de assinaturas, testes gratuitos, área administrativa e portal do cliente.

---

## 🏗️ Arquitetura do Sistema

### Tecnologias Principais
- **Frontend:** React 18 + Vite
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Autenticação:** Supabase Auth (Google OAuth)
- **Pagamentos:** MercadoPago
- **UI:** Tailwind CSS + Radix UI + Framer Motion
- **Roteamento:** React Router DOM v6

### Estrutura de Dados
- **Tabelas Principais:**
  - `profiles` - Perfis de usuários
  - `registered_apps` - Produtos cadastrados
  - `user_purchases` - Compras e assinaturas
  - `user_trials` - Testes gratuitos
  - `contact_messages` - Mensagens de contato

---

## 📱 Funcionalidades Públicas (Não Autenticadas)

### 1. **Página Inicial** (`/`)
**Componente:** `HomePage.jsx`

**Funcionalidades:**
- ✅ Exibição de hero section com call-to-action
- ✅ Seção de produtos em destaque
- ✅ Seção de benefícios
- ✅ Navegação para outras páginas
- ✅ Suporte a tema claro/escuro
- ✅ Responsivo (mobile, tablet, desktop)

**Possíveis Bugs:**
- ⚠️ Imagens podem não carregar se `image_url` estiver vazio
- ⚠️ Produtos podem não aparecer se `is_active = false`

---

### 2. **Listagem de Produtos** (`/produtos`)
**Componente:** `PaginaProdutos.jsx` + `ProductsList.jsx`

**Funcionalidades:**
- ✅ Lista todos os produtos ativos
- ✅ Cards de produtos com imagem, nome, descrição
- ✅ Link para detalhes do produto
- ✅ Filtros (Todos, Grátis, Pagos)
- ✅ Ordenação (Nome, Menor Preço, Maior Preço)
- ✅ Busca por nome
- ✅ Paginação (se implementada)

**Possíveis Bugs:**
- ⚠️ Filtros podem não funcionar corretamente se produtos não tiverem preços definidos
- ⚠️ Ordenação pode falhar com valores null
- ⚠️ Busca pode ser case-sensitive

---

### 3. **Detalhes do Produto** (`/produtos/:id` ou `/product/:id`)
**Componente:** `ProductDetailPage.jsx`

**Funcionalidades:**
- ✅ Exibição completa do produto
- ✅ Seleção de plano (Mensal, Anual, Vitalício)
- ✅ Botão "Iniciar Teste Grátis" (se disponível)
- ✅ Botão "Adicionar ao Carrinho"
- ✅ Exibição de features/benefícios
- ✅ Verificação de acesso existente
- ✅ Redirecionamento para app após teste

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Se `selectedPrice` não for definido, botão de adicionar ao carrinho fica desabilitado
- ⚠️ Teste pode falhar se `trial_period_days` não estiver definido
- ⚠️ Redirecionamento pode falhar se `vercel_deployment_url` estiver vazio
- ⚠️ Preços podem não formatar corretamente se estiverem em centavos

---

### 4. **Carrinho de Compras** (`/carrinho`)
**Componente:** `PaginaCarrinho.jsx` + `ShoppingCart.jsx`

**Funcionalidades:**
- ✅ Visualização de itens no carrinho
- ✅ Atualização de quantidades
- ✅ Remoção de itens
- ✅ Cálculo de total
- ✅ Persistência no localStorage
- ✅ Botão "Finalizar Compra"
- ✅ Integração com MercadoPago

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Carrinho pode ser perdido se localStorage estiver desabilitado
- ⚠️ **CRÍTICO:** MercadoPago SDK pode não carregar (`window.MercadoPago` undefined)
- ⚠️ Quantidades podem ficar negativas se não validar
- ⚠️ Total pode calcular incorretamente com múltiplas moedas
- ⚠️ Checkout pode falhar se usuário não estiver autenticado

---

### 5. **Autenticação**

#### 5.1. **Login** (`/login`)
**Componente:** `PaginaLogin.jsx`

**Funcionalidades:**
- ✅ Login com email/senha
- ✅ Login com Google OAuth
- ✅ Link para "Esqueci minha senha"
- ✅ Link para cadastro
- ✅ Validação de formulário

**Possíveis Bugs:**
- ⚠️ Google OAuth pode falhar se redirect URL não estiver configurado
- ⚠️ Erros podem não ser exibidos claramente

#### 5.2. **Cadastro** (`/cadastro`)
**Componente:** `PaginaCadastro.jsx`

**Funcionalidades:**
- ✅ Cadastro com email/senha
- ✅ Cadastro com Google OAuth
- ✅ Validação de campos
- ✅ Criação automática de perfil

**Possíveis Bugs:**
- ⚠️ Perfil pode não ser criado se trigger falhar
- ⚠️ Email pode não ser sincronizado corretamente

#### 5.3. **Recuperação de Senha** (`/esqueci-senha`, `/redefinir-senha`)
**Componentes:** `PaginaEsqueciSenha.jsx`, `PaginaRedefinirSenha.jsx`

**Funcionalidades:**
- ✅ Solicitação de redefinição
- ✅ Redefinição via link de email
- ✅ Validação de token

**Possíveis Bugs:**
- ⚠️ Email pode não ser enviado se SMTP não estiver configurado
- ⚠️ Token pode expirar antes do usuário usar

#### 5.4. **Callback OAuth** (`/auth/callback`)
**Componente:** `AuthCallback.jsx`

**Funcionalidades:**
- ✅ Processamento de callback do Google
- ✅ Criação/atualização de perfil
- ✅ Redirecionamento baseado em role

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Pode entrar em loop se perfil não for criado
- ⚠️ Redirecionamento pode falhar se role não estiver definido

---

### 6. **Páginas Informativas**

#### 6.1. **Sobre** (`/sobre`)
**Componente:** `PaginaSobre.jsx`

#### 6.2. **Contato/Orçamento** (`/contato-orcamento`)
**Componente:** `PaginaContatoOrcamento.jsx`

**Funcionalidades:**
- ✅ Formulário de contato
- ✅ Envio de mensagem

**Possíveis Bugs:**
- ⚠️ Mensagem pode não ser salva se tabela `contact_messages` não existir

#### 6.3. **Termos de Serviço** (`/termos-de-servico`, `/termos-de-uso`)
**Componente:** `PaginaTermos.jsx`

#### 6.4. **Política de Privacidade** (`/politica-de-privacidade`, `/pagina-privacidade`)
**Componente:** `PaginaPrivacidade.jsx`

---

### 7. **Página de Sucesso** (`/success`)
**Componente:** `SuccessPage.jsx`

**Funcionalidades:**
- ✅ Confirmação de compra
- ✅ Exibição de informações da compra

**Possíveis Bugs:**
- ⚠️ Pode não exibir dados se não vierem via query params

---

## 🔐 Portal do Cliente (Área Autenticada)

### 8. **Dashboard do Portal** (`/portal/dashboard`)
**Componente:** `PortalDashboard.jsx`

**Funcionalidades:**
- ✅ Estatísticas do usuário
- ✅ Produtos recentes
- ✅ Testes ativos
- ✅ Ações rápidas
- ✅ Navegação para outras seções

**Possíveis Bugs:**
- ⚠️ Dados podem não carregar se queries falharem
- ⚠️ Contadores podem estar incorretos

---

### 9. **Todos os Produtos** (`/portal/produtos`)
**Componente:** `PortalProdutos.jsx`

**Funcionalidades:**
- ✅ Lista todos os produtos disponíveis
- ✅ Filtros (Todos, Grátis, Pagos)
- ✅ Ordenação
- ✅ Busca
- ✅ Link para detalhes
- ✅ Link externo para app (se disponível)

**Possíveis Bugs:**
- ⚠️ Mesmos bugs da listagem pública
- ⚠️ Link externo pode não abrir se URL estiver vazia

---

### 10. **Meus Produtos** (`/portal/meus-produtos`)
**Componente:** `PortalMeusProdutos.jsx`

**Funcionalidades:**
- ✅ Lista produtos adquiridos
- ✅ Lista produtos em teste
- ✅ Filtros (Todos, Adquiridos, Testando)
- ✅ Acesso direto ao app
- ✅ Link para repositório GitHub
- ✅ Link para detalhes

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Filtro "todos" pode contar duplicados (produtos adquiridos + em teste)
- ⚠️ Acesso pode não funcionar se `vercel_deployment_url` estiver vazio
- ⚠️ Testes expirados podem ainda aparecer como ativos

---

### 11. **Testes Ativos** (`/portal/testes`)
**Componente:** `PortalTestes.jsx`

**Funcionalidades:**
- ✅ Lista testes ativos
- ✅ Exibição de dias restantes
- ✅ Botão "Acessar Produto"
- ✅ Botão "Comprar Agora" (quando expirado)
- ✅ Botão "Ver Planos"

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Testes expirados podem ainda aparecer como ativos (verificação de data)
- ⚠️ Dias restantes podem calcular incorretamente (timezone)
- ⚠️ Acesso pode não funcionar se URL estiver vazia

---

### 12. **Assinaturas** (`/portal/assinaturas`)
**Componente:** `PortalAssinaturas.jsx`

**Funcionalidades:**
- ✅ Lista assinaturas ativas
- ✅ Status da assinatura
- ✅ Botão "Renovar"
- ✅ Botão "Solicitar Reembolso"
- ✅ Botão "Cancelar" (com confirmação)
- ✅ Atualização de status no banco

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Cancelamento pode não atualizar status corretamente
- ⚠️ Renovação pode não funcionar se produto não estiver disponível
- ⚠️ Status pode não sincronizar com MercadoPago

---

### 13. **Pagamentos** (`/portal/pagamentos`)
**Componente:** `PortalPagamentos.jsx`

**Funcionalidades:**
- ✅ Histórico de pagamentos
- ✅ Status de cada pagamento
- ✅ Link para gerenciar assinaturas
- ✅ Link para ver produto

**Possíveis Bugs:**
- ⚠️ Pagamentos podem não aparecer se query falhar
- ⚠️ Status pode estar desatualizado

---

### 14. **Contato** (`/portal/contato`)
**Componente:** `PortalContato.jsx`

**Funcionalidades:**
- ✅ Formulário de contato
- ✅ Pré-preenchimento de assunto/mensagem (de outras páginas)
- ✅ Envio de mensagem para `contact_messages`

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Requer migration `20250108000001_add_contact_messages.sql`
- ⚠️ Mensagem pode não ser salva se RLS bloquear

---

### 15. **Notificações** (`/portal/notificacoes`)
**Componente:** `PortalNotificacoes.jsx`

**Funcionalidades:**
- ✅ Lista de notificações
- ✅ Marcar como lida
- ✅ Filtros

**Possíveis Bugs:**
- ⚠️ Notificações podem não aparecer se tabela não existir
- ⚠️ Marcação como lida pode não persistir

---

## 👨‍💼 Área Administrativa

### 16. **Dashboard Admin** (`/admin/dashboard`)
**Componente:** `AdminDashboard.jsx`

**Funcionalidades:**
- ✅ Estatísticas básicas (Vendas, Usuários, Produtos)
- ✅ Cards informativos

**Funcionalidades Faltantes (Bugs de UX):**
- ❌ Gráficos de vendas
- ❌ Vendas recentes
- ❌ Estatísticas detalhadas
- ❌ Atividades recentes

---

### 17. **Gerenciamento de Produtos** (`/admin/produtos`)
**Componentes:** `AdminGerenciarProdutos.jsx`, `AdminFormularioProduto.jsx`

**Funcionalidades:**
- ✅ Listar produtos
- ✅ Criar produto
- ✅ Editar produto
- ✅ Excluir produto
- ✅ Formulário completo com validação

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Features podem não salvar corretamente (conversão string/array)
- ⚠️ Preços podem não converter corretamente (centavos/reais)
- ⚠️ Imagem pode não fazer upload se storage não estiver configurado
- ⚠️ Exclusão pode falhar se houver compras associadas

**Funcionalidades Faltantes:**
- ❌ Busca e filtros avançados
- ❌ Ativar/Desativar em massa
- ❌ Duplicar produto
- ❌ Estatísticas por produto

---

### 18. **Tipos de Produto** (`/admin/tipos-produto`)
**Componente:** `AdminTiposDeProduto.jsx`

**Funcionalidades:**
- ✅ Gerenciar tipos de produto
- ✅ Criar, editar, excluir

**Possíveis Bugs:**
- ⚠️ Exclusão pode falhar se houver produtos associados
- ⚠️ Validação pode não impedir exclusão

---

### 19. **Usuários** (`/admin/usuarios`)
**Componente:** `AdminUsuarios.jsx`

**Funcionalidades:**
- ✅ Listar usuários
- ✅ Busca por nome/email
- ✅ Filtros (Role, Trial)
- ✅ Gerenciar licenças (trial, lifetime, revogar)
- ✅ Modal de gerenciamento

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Email pode não aparecer se RLS não permitir (requer migration `20250110000000_fix_admin_email_access.sql`)
- ⚠️ Busca pode ser lenta com muitos usuários
- ⚠️ Revogação pode não remover todos os acessos

**Funcionalidades Faltantes:**
- ❌ Editar perfil do usuário
- ❌ Alterar role (USER/ADMIN)
- ❌ Banir/Desbanir
- ❌ Histórico de ações
- ❌ Estatísticas por usuário

---

### 20. **Vendas** (`/admin/vendas`)
**Componente:** `AdminVendas.jsx`

**Funcionalidades:**
- ✅ Listar vendas
- ✅ Exibir detalhes básicos

**Funcionalidades Faltantes (Bugs de UX):**
- ❌ Filtros (data, produto, status, cliente)
- ❌ Busca
- ❌ Detalhes expandidos
- ❌ Exportar (CSV, PDF)
- ❌ Estatísticas
- ❌ Gráficos

---

### 21. **Mensagens de Contato** (`/admin/contato`)
**Componente:** `AdminContato.jsx`

**Funcionalidades:**
- ✅ Listar mensagens
- ✅ Filtrar por status
- ✅ Buscar

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Requer migration `20250108000001_add_contact_messages.sql`
- ⚠️ Mensagens podem não aparecer se RLS bloquear

**Funcionalidades Faltantes:**
- ❌ Marcar como respondida
- ❌ Responder mensagem (enviar email)
- ❌ Excluir mensagem
- ❌ Badge com contador no menu

---

## 🛠️ Funcionalidades Técnicas

### 22. **Sistema de Carrinho**
**Hook:** `useCart.jsx`

**Funcionalidades:**
- ✅ Adicionar ao carrinho
- ✅ Remover do carrinho
- ✅ Atualizar quantidade
- ✅ Limpar carrinho
- ✅ Calcular total
- ✅ Persistência no localStorage

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Carrinho pode ser perdido se localStorage estiver desabilitado
- ⚠️ Verificação de estoque pode não funcionar se `manage_inventory = false`
- ⚠️ Total pode calcular incorretamente com múltiplas moedas
- ⚠️ Quantidades podem ficar negativas

---

### 23. **Sistema de Assinaturas**
**Hook:** `useSubscription.jsx`

**Funcionalidades:**
- ✅ Verificar status de assinatura
- ✅ Verificar acesso (trial + assinatura)
- ✅ Integração com Edge Function `check-subscription`

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Edge Function pode não estar deployada
- ⚠️ URL da função pode estar incorreta
- ⚠️ Verificação pode falhar se email não corresponder
- ⚠️ Timeout pode ocorrer se função demorar

---

### 24. **Sistema de Testes**
**Utils:** `trialHelpers.js`

**Funcionalidades:**
- ✅ Iniciar teste
- ✅ Verificar acesso
- ✅ Calcular dias restantes

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Testes podem não expirar corretamente (verificação de data)
- ⚠️ Múltiplos testes do mesmo produto podem ser criados
- ⚠️ Dias restantes podem calcular incorretamente (timezone)

---

### 25. **Autenticação**
**Context:** `SupabaseAuthContext.jsx`

**Funcionalidades:**
- ✅ Login/Logout
- ✅ Cadastro
- ✅ Recuperação de senha
- ✅ Google OAuth
- ✅ Sincronização de perfil

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** Perfil pode não ser criado automaticamente
- ⚠️ Sessão pode expirar sem aviso
- ⚠️ Google OAuth pode falhar se redirect URL não estiver configurado
- ⚠️ Sincronização pode falhar se trigger não existir

---

### 26. **Tema (Dark/Light Mode)**
**Context:** `ThemeContext.jsx`

**Funcionalidades:**
- ✅ Alternar tema
- ✅ Persistência no localStorage
- ✅ Aplicação em todos os componentes

**Possíveis Bugs:**
- ⚠️ Tema pode não persistir se localStorage estiver desabilitado
- ⚠️ Flash de conteúdo pode ocorrer antes do tema carregar

---

## 💳 Integração com Pagamentos

### 27. **MercadoPago**

**Funcionalidades:**
- ✅ Criação de checkout
- ✅ Webhook para processar pagamentos
- ✅ Atualização de status de compra
- ✅ Edge Function `create-checkout`
- ✅ Edge Function `mercadopago-webhook`

**Possíveis Bugs:**
- ⚠️ **CRÍTICO:** SDK do MercadoPago pode não carregar (`window.MercadoPago` undefined)
- ⚠️ **CRÍTICO:** Access Token pode estar incorreto ou expirado
- ⚠️ Webhook pode não processar corretamente
- ⚠️ Status pode não sincronizar
- ⚠️ Edge Functions podem não estar deployadas
- ⚠️ URLs de sucesso/cancelamento podem estar incorretas

---

## 🐛 Bugs Críticos Identificados

### 🔴 Prioridade Alta (Bloqueadores)

1. **Carrinho Perdido no localStorage**
   - **Localização:** `useCart.jsx`
   - **Problema:** Se localStorage estiver desabilitado, carrinho não persiste
   - **Solução:** Adicionar fallback ou aviso ao usuário

2. **MercadoPago SDK Não Carrega**
   - **Localização:** `PaginaCarrinho.jsx`
   - **Problema:** `window.MercadoPago` pode estar undefined
   - **Solução:** Verificar carregamento do script antes de usar

3. **Email Admin Não Visível**
   - **Localização:** `AdminUsuarios.jsx`
   - **Problema:** RLS pode bloquear visualização de emails
   - **Solução:** Aplicar migration `20250110000000_fix_admin_email_access.sql`

4. **Testes Não Expirando**
   - **Localização:** `PortalTestes.jsx`, `trialHelpers.js`
   - **Problema:** Verificação de data pode estar incorreta
   - **Solução:** Revisar lógica de comparação de datas

5. **Callback OAuth em Loop**
   - **Localização:** `AuthCallback.jsx`
   - **Problema:** Pode entrar em loop se perfil não for criado
   - **Solução:** Adicionar timeout e tratamento de erro

6. **Features Não Salvam Corretamente**
   - **Localização:** `AdminFormularioProduto.jsx`
   - **Problema:** Conversão string/array pode falhar
   - **Solução:** Validar conversão antes de salvar

7. **Migrations Não Aplicadas**
   - **Problema:** Funcionalidades podem não funcionar sem migrations
   - **Soluções:**
     - `20250108000001_add_contact_messages.sql` - Para contato
     - `20250110000000_fix_admin_email_access.sql` - Para email admin

---

### 🟡 Prioridade Média (Funcionalidades Quebradas)

8. **Filtro "Todos" Conta Duplicados**
   - **Localização:** `PortalMeusProdutos.jsx`
   - **Problema:** Produtos adquiridos + em teste podem ser contados duas vezes

9. **Preços Não Formatam Corretamente**
   - **Localização:** `ProductDetailPage.jsx`
   - **Problema:** Conversão centavos/reais pode falhar

10. **Redirecionamento Falha com URL Vazia**
    - **Localização:** Várias páginas
    - **Problema:** `vercel_deployment_url` pode estar vazio

11. **Edge Functions Não Deployadas**
    - **Problema:** `check-subscription`, `create-checkout`, `mercadopago-webhook`
    - **Solução:** Verificar deploy e variáveis de ambiente

---

### 🟢 Prioridade Baixa (Melhorias de UX)

12. **Falta de Gráficos no Dashboard Admin**
13. **Falta de Filtros Avançados em Vendas**
14. **Falta de Busca em Várias Páginas**
15. **Falta de Validação em Alguns Formulários**
16. **Falta de Feedback Visual em Algumas Ações**

---

## 📊 Resumo de Funcionalidades

### ✅ Funcionalidades Implementadas: 27
### ⚠️ Bugs Identificados: 16
### ❌ Funcionalidades Faltantes: 15+

---

## 🔧 Recomendações de Correção

### Prioridade 1 (Urgente)
1. Aplicar migrations pendentes
2. Corrigir verificação de testes expirados
3. Adicionar fallback para localStorage
4. Verificar carregamento do MercadoPago SDK
5. Corrigir conversão de features no formulário

### Prioridade 2 (Importante)
6. Adicionar validações em formulários
7. Melhorar tratamento de erros
8. Adicionar loading states
9. Corrigir cálculos de preços
10. Verificar deploy de Edge Functions

### Prioridade 3 (Melhorias)
11. Adicionar gráficos e estatísticas
12. Implementar filtros avançados
13. Adicionar busca em todas as páginas
14. Melhorar feedback visual
15. Adicionar testes automatizados

---

## 📝 Notas Finais

Este documento foi criado com base na análise do código-fonte e documentação existente. Alguns bugs podem não ter sido identificados durante testes reais. Recomenda-se:

1. **Testar todas as funcionalidades manualmente**
2. **Verificar logs do console do navegador**
3. **Verificar logs do Supabase**
4. **Testar em diferentes navegadores**
5. **Testar em dispositivos móveis**
6. **Verificar integrações externas (MercadoPago, Google OAuth)**

---

**Última atualização:** 2025-01-10  
**Próxima revisão recomendada:** Após correção dos bugs críticos



