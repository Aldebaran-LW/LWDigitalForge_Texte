# PROMPT PARA EMERGENT.SH - Redesign Visual LWDigitalForge

## CONTEXTO

Você tem acesso ao repositório: **https://github.com/Aldebaran-LW/LWDigitalForge_Texte**

Este é um projeto React + Vite de e-commerce para produtos digitais (bots Telegram e planilhas Excel). Todas as funcionalidades estão implementadas, mas o visual precisa ser completamente redesenhado para algo moderno, atual e profissional.

## DIRETRIZES PRINCIPAIS

### ✅ MANTER
- **Paleta de cores atual:**
  - Primary Blue: `#3B82F6`
  - Accent Turquoise: `#14B8A6`
  - Accent Magenta: `#D946EF`
  - Dark BG: `#111827`
  - Light BG: `#EBF4FF`
- **Imagens do servidor:** Todas as imagens já estão no servidor, use-as (função `getAssetUrlFromStorage()`)
- **Todas as funcionalidades:** Não alterar lógica, apenas visual

### 🎨 ANIMAÇÕES
- **Sutis e elegantes** - nada exagerado
- Micro-interações em botões e cards
- Transições suaves entre estados
- Scroll reveal animations leves
- Hover effects discretos mas perceptíveis
- **Evitar:** Animações muito chamativas, efeitos piscantes, movimentos bruscos

### 🖱️ INTERATIVIDADE
- Adicionar mais feedback visual nas interações
- Estados de hover mais elaborados
- Loading states mais informativos
- Tooltips onde fizer sentido
- Interações em cards e elementos clicáveis
- Feedback tátil em formulários

### 🎯 PRIORIDADES
1. **Área Administrativa** (Admin Dashboard, AdminGerenciarProdutos, AdminVendas, AdminUsuarios)
2. **Portal do Usuário** (PortalMeusProdutos, PortalTestes, PortalPagamentos)
3. Páginas públicas (HomePage, Produtos, etc.)

## STACK TÉCNICA

- React 18.2.0 + Vite 4.4.5
- Tailwind CSS 3.3.3
- Framer Motion 10.16.4 (para animações)
- Radix UI (componentes base)
- Supabase (auth + backend)
- Mercado Pago (pagamentos)
- Lucide React (ícones)

## FUNCIONALIDADES QUE DEVEM SER MANTIDAS

### Sistema de Tema Dark/Light
- Toggle no header (ícone Sol/Lua)
- Persistência do tema
- Transições suaves entre temas
- Context: `ThemeContext.jsx`

### Carrinho de Compras
- Sidebar deslizante da direita
- Adicionar/remover produtos
- Ajustar quantidades (+/-)
- Checkout Mercado Pago
- Badge com contador no ícone
- Hook: `useCart.jsx`

### Navegação
- Menu desktop horizontal
- Menu mobile com overlay
- Links com hover states
- Navegação condicional (admin não mostra header/footer)

### Produtos
- Grid responsivo
- Cards clicáveis
- Preços (mensal/anual/vitalício)
- Product detail com seleção de planos
- Teste grátis (se disponível)
- Features list

### Autenticação
- Login/Cadastro Supabase
- OAuth Google
- Recuperação de senha
- Proteção de rotas admin
- Exibir usuário logado no header

### Toast Notifications
- Sistema de toast para feedback
- Variantes: default, destructive

## ÁREAS PRIORITÁRIAS - DETALHAMENTO

### 1. ADMIN DASHBOARD (`AdminDashboard.jsx`)
**Melhorias necessárias:**
- Cards de métricas visuais (vendas, usuários, produtos, receita)
- Gráficos de vendas ao longo do tempo (usar Recharts ou Chart.js)
- Gráfico de produtos mais vendidos
- Tabela de vendas recentes mais visual
- Estatísticas rápidas em cards destacados
- Animações sutis ao carregar dados

### 2. ADMIN GERENCIAR PRODUTOS (`AdminGerenciarProdutos.jsx`)
**Melhorias necessárias:**
- Grid/lista de produtos mais visual
- Cards de produto com preview
- Filtros e busca mais intuitivos
- Ações rápidas (editar, deletar) com confirmação visual
- Estados vazios mais informativos
- Loading states elegantes

### 3. ADMIN VENDAS (`AdminVendas.jsx`)
**Melhorias necessárias:**
- Tabela de vendas mais visual e organizada
- Filtros por data, status, produto
- Gráficos de receita e tendências
- Exportação de dados (se aplicável)
- Detalhes de venda em modal/drawer

### 4. ADMIN USUÁRIOS (`AdminUsuarios.jsx`)
**Melhorias necessárias:**
- Lista de usuários mais visual
- Cards de perfil ou tabela melhorada
- Filtros e busca
- Ações rápidas
- Estatísticas de usuários

### 5. PORTAL MEUS PRODUTOS (`PortalMeusProdutos.jsx`)
**Melhorias necessárias:**
- Dashboard visual com produtos ativos
- Cards de produtos com status
- Acesso rápido aos produtos
- Estatísticas de uso (se aplicável)
- Visualização mais atrativa

### 6. PORTAL TESTES (`PortalTestes.jsx`)
**Melhorias necessárias:**
- Lista de testes ativos mais visual
- Cards com contador de dias restantes
- Progress bar ou indicador visual
- Ações rápidas (acessar, ver detalhes)
- Estados vazios informativos

### 7. PORTAL PAGAMENTOS (`PortalPagamentos.jsx`)
**Melhorias necessárias:**
- Histórico de pagamentos mais visual
- Cards de transações
- Filtros por status, data
- Detalhes de pagamento
- Status visuais (aprovado, pendente, etc.)

## REFERÊNCIAS DE DESIGN ATUAIS (2025)

### Sites de Inspiração Modernos:
- **Linear** (linear.app) - Design minimalista, animações sutis, excelente UX
- **Vercel** (vercel.com) - Moderno, clean, interações elegantes
- **Stripe** (stripe.com) - Dashboard profissional, visualizações claras
- **Notion** (notion.so) - Interface limpa, interativa, bem organizada
- **Framer** (framer.com) - Animações suaves, design moderno
- **Shadcn/ui** (ui.shadcn.com) - Componentes modernos e acessíveis

### Tendências 2025:
- **Glassmorphism sutil** - Backdrop blur discreto
- **Gradientes suaves** - Não muito chamativos
- **Espaçamento generoso** - Respiração entre elementos
- **Tipografia clara** - Hierarquia bem definida
- **Micro-interações** - Feedback em todas as ações
- **Dark mode nativo** - Bem implementado
- **Cards elevados** - Sombras sutis, hover effects
- **Gráficos e visualizações** - Dashboards informativos

## COMPONENTES A MELHORAR

### Header
- Visual mais moderno mas discreto
- Animações sutis de entrada
- Badge do carrinho mais visível
- Menu mobile mais elegante

### Cards de Produtos
- Design mais atraente
- Hover effects sutis (elevação, sombra)
- Melhor hierarquia de informações
- Badges de planos (Popular, Economia)

### Product Detail
- Layout mais organizado
- Destaque visual para teste grátis
- Seleção de planos mais clara
- Features mais visuais

### Shopping Cart
- Sidebar mais elegante
- Animações suaves de entrada/saída
- Melhor organização visual

### Formulários
- Inputs mais modernos
- Estados de foco visíveis
- Validação visual clara
- Feedback imediato

## BIBLIOTECAS SUGERIDAS

### Para Gráficos:
- **Recharts** - Leve, React-native, fácil de usar
- **Chart.js com react-chartjs-2** - Alternativa popular

### Para Animações:
- **Framer Motion** (já instalado) - Usar para animações sutis
- Evitar bibliotecas pesadas de partículas

### Para Componentes:
- **Radix UI** (já instalado) - Manter como base
- Melhorar estilização dos componentes existentes

## CHECKLIST DE ENTREGA

### Áreas Prioritárias:
- [ ] Admin Dashboard redesenhado com gráficos e métricas
- [ ] Admin Gerenciar Produtos mais visual
- [ ] Admin Vendas com visualizações
- [ ] Admin Usuários melhorado
- [ ] Portal Meus Produtos redesenhado
- [ ] Portal Testes mais visual
- [ ] Portal Pagamentos melhorado

### Geral:
- [ ] Todas as animações sutis e elegantes
- [ ] Interatividade aumentada em todos os componentes
- [ ] Paleta de cores mantida
- [ ] Imagens do servidor mantidas
- [ ] Todas as funcionalidades funcionando
- [ ] Tema dark/light funcionando
- [ ] Responsividade completa
- [ ] Performance otimizada
- [ ] Acessibilidade mantida/melhorada

## O QUE NÃO ALTERAR

- ❌ Lógica de negócio
- ❌ Estrutura de dados
- ❌ Integrações (Supabase, Mercado Pago)
- ❌ Rotas e navegação
- ❌ Hooks e contexts (apenas estilização)
- ❌ Paleta de cores
- ❌ Imagens (usar as existentes)

## O QUE FOCAR

- ✅ Visual moderno e profissional
- ✅ Animações sutis e elegantes
- ✅ Interatividade aumentada
- ✅ Dashboards e visualizações (admin e portal)
- ✅ Organização visual
- ✅ Hierarquia de informações
- ✅ UX melhorada

## NOTAS FINAIS

- **Animações:** Sempre sutis, nada exagerado
- **Interatividade:** Adicionar feedback visual em todas as ações
- **Prioridade:** Admin e Portal do Usuário primeiro
- **Inspiração:** Sites modernos como Linear, Vercel, Stripe
- **Cores:** Manter paleta atual
- **Imagens:** Usar as que já estão no servidor

---

**OBJETIVO:** Criar um visual moderno, profissional e interativo que mantém todas as funcionalidades, com foco especial nas áreas administrativas e do portal do usuário, usando animações sutis e aumentando a interatividade.

