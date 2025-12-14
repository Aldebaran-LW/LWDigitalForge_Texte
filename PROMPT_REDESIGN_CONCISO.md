# PROMPT CONCISO: Redesign Visual LWDigitalForge

## MISSÃO
Redesenhar completamente o visual do site da LWDigitalForge mantendo TODAS as funcionalidades e interações existentes. Criar um design moderno, atual (2025), profissional, com visualizações e micro-interações.

## STACK TÉCNICA
- React 18 + Vite + Tailwind CSS
- Framer Motion (animações)
- Radix UI (componentes)
- Supabase (auth + backend)
- Mercado Pago (pagamentos)

## FUNCIONALIDADES QUE DEVEM SER MANTIDAS

### ✅ Sistema de Tema Dark/Light
- Toggle no header (Sol/Lua)
- Persistência do tema
- Transições suaves

### ✅ Carrinho de Compras
- Sidebar deslizante da direita
- Adicionar/remover produtos
- Ajustar quantidades
- Checkout Mercado Pago
- Badge com contador

### ✅ Animações Framer Motion
- Header com entrada animada
- Hero com animações escalonadas
- Cards com hover effects
- Scroll animations
- Menu mobile animado
- Cart slide-in

### ✅ Navegação
- Menu desktop + mobile
- Links com hover states
- Navegação condicional (admin)

### ✅ Produtos
- Grid responsivo
- Cards clicáveis
- Preços (mensal/anual/vitalício)
- Product detail com seleção de planos
- Teste grátis (se disponível)
- Features list

### ✅ Autenticação
- Login/Cadastro Supabase
- OAuth Google
- Recuperação de senha
- Proteção de rotas
- Exibir usuário logado

### ✅ Toast Notifications
- Feedback visual
- Variantes (default, destructive)

## ESTRUTURA DE COMPONENTES

**Principais:**
- Header, Footer, HeroSection, ProductsSection, BenefitsSection
- ProductCard, ProductsList, ShoppingCart
- ProductDetailPage, PaginaProdutos, HomePage

**Admin:**
- AdminLayout, AdminDashboard, AdminGerenciarProdutos
- AdminFormularioProduto, AdminVendas, AdminUsuarios

**Portal:**
- PortalMeusProdutos, PortalTestes, PortalPagamentos

## PALETA ATUAL
- Primary Blue: `#3B82F6`
- Accent Turquoise: `#14B8A6`
- Accent Magenta: `#D946EF`
- Dark BG: `#111827`
- Light BG: `#EBF4FF`

## REQUISITOS DO REDESIGN

### 🎨 Design Moderno 2025
- Minimalista, limpo, profissional
- Glassmorphism, gradientes sutis
- Espaçamento generoso
- Hierarquia visual clara

### 📊 Visualizações
- Gráficos no Admin Dashboard (vendas, usuários, métricas)
- Cards de estatísticas visuais
- Dashboards no Portal do Cliente
- Tabelas mais visuais

### ✨ Micro-interações
- Feedback visual em cliques
- Loading states elaborados
- Transições suaves
- Scroll reveal animations
- Hover effects consistentes

### 🎯 Melhorias Específicas

**Header:**
- Visual mais moderno
- Animações refinadas
- Badge carrinho mais visível

**Hero:**
- Design mais impactante
- Tipografia melhorada
- Elementos decorativos (partículas/formas)

**Cards Produtos:**
- Design mais atraente
- Melhor hierarquia
- Hover effects sofisticados
- Badges de planos (Popular, Economia)

**Product Detail:**
- Layout mais organizado
- Destaque para teste grátis
- Features mais visuais

**Shopping Cart:**
- Sidebar mais elegante
- Animações suaves

**Footer:**
- Layout organizado
- Links sociais destacados

### 📱 Responsividade
- Mobile-first
- Testar todos os breakpoints
- Menu mobile funcional

### ♿ Acessibilidade
- Contraste WCAG AA
- Estados de foco visíveis
- Navegação por teclado

## O QUE NÃO ALTERAR
- ❌ Lógica de negócio
- ❌ Estrutura de dados
- ❌ Integrações (APIs)
- ❌ Rotas e navegação
- ❌ Hooks e contexts (apenas estilização)

## O QUE FOCAR
- ✅ Visual e UX
- ✅ Animações e transições
- ✅ Organização visual
- ✅ Hierarquia de informações
- ✅ Modernização do design

## SUGESTÕES DE MELHORIAS

1. **Bibliotecas para Gráficos:**
   - Recharts ou Chart.js para dashboards

2. **Animações Avançadas:**
   - Partículas de fundo (particles.js)
   - Scroll-triggered animations
   - Page transitions

3. **Componentes Visuais:**
   - Skeleton loaders
   - Progress bars
   - Badges elaborados
   - Tooltips

4. **Seções (se fizer sentido):**
   - Testimonials
   - FAQ com accordion
   - Blog/News

## CHECKLIST
- [ ] Todos componentes redesenhados
- [ ] Todas interações funcionando
- [ ] Tema dark/light OK
- [ ] Responsividade completa
- [ ] Animações performáticas
- [ ] Visualizações adicionadas
- [ ] Acessibilidade mantida
- [ ] Performance otimizada

## REFERÊNCIAS
- Design systems: Material Design 3, Ant Design
- Sites: Stripe, Linear, Vercel, Notion
- Tendências 2025: Glassmorphism, Gradientes suaves, Espaçamento generoso

---

**OBJETIVO:** Visual moderno, profissional e atraente que mantém todas funcionalidades e melhora significativamente a UX através de design, animações e visualizações.


