# PROMPT: Redesign Visual Completo - LWDigitalForge

## CONTEXTO DO PROJETO

Você está trabalhando em um projeto React + Vite para a **LWDigitalForge**, uma plataforma de e-commerce que vende produtos digitais (bots Telegram e planilhas Excel inteligentes). O site já possui todas as funcionalidades implementadas, mas o visual precisa ser completamente redesenhado para algo moderno, atual e profissional.

**Repositório:** https://github.com/Aldebaran-LW/LWDigitalForge_Texte

## TECNOLOGIAS E STACK

- **Framework:** React 18.2.0 + Vite 4.4.5
- **Roteamento:** React Router DOM 6.16.0
- **Estilização:** Tailwind CSS 3.3.3 + CSS Custom Properties
- **Animações:** Framer Motion 10.16.4
- **UI Components:** Radix UI (Dialog, Dropdown, Toast, Alert Dialog, etc.)
- **Ícones:** Lucide React 0.285.0
- **Autenticação:** Supabase Auth
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Pagamentos:** Mercado Pago
- **Formulários:** React Hook Form 7.54.2
- **Fontes:** Google Fonts (Inter)

## ESTRUTURA DE COMPONENTES EXISTENTES

### Componentes Principais
- `Header.jsx` - Navegação principal com menu mobile, carrinho, tema dark/light
- `Footer.jsx` - Rodapé com links e redes sociais
- `HeroSection.jsx` - Seção hero da homepage
- `ProductsSection.jsx` - Grid de produtos em destaque
- `BenefitsSection.jsx` - Seção de benefícios (3 cards)
- `ProductCard.jsx` - Card individual de produto
- `ProductsList.jsx` - Lista completa de produtos
- `ShoppingCart.jsx` - Sidebar do carrinho (slide-in)
- `CallToAction.jsx` - Componente CTA

### Páginas Principais
- `HomePage.jsx` - Página inicial
- `PaginaProdutos.jsx` - Lista de todos os produtos
- `ProductDetailPage.jsx` - Detalhes do produto com seleção de planos
- `PaginaCarrinho.jsx` - Página do carrinho
- `PaginaLogin.jsx` - Login
- `PaginaCadastro.jsx` - Cadastro
- `PaginaSobre.jsx` - Sobre nós
- `PaginaContatoOrcamento.jsx` - Contato/Orçamento
- `SuccessPage.jsx` - Página de sucesso após compra

### Área Administrativa
- `AdminLayout.jsx` - Layout do painel admin
- `AdminDashboard.jsx` - Dashboard admin
- `AdminGerenciarProdutos.jsx` - Gerenciar produtos
- `AdminFormularioProduto.jsx` - Formulário de produto
- `AdminVendas.jsx` - Gerenciar vendas
- `AdminUsuarios.jsx` - Gerenciar usuários
- `AdminTiposDeProduto.jsx` - Gerenciar tipos de produto

### Portal do Cliente
- `PortalMeusProdutos.jsx` - Produtos do cliente
- `PortalTestes.jsx` - Testes ativos
- `PortalPagamentos.jsx` - Histórico de pagamentos

## INTERAÇÕES E FUNCIONALIDADES QUE DEVEM SER MANTIDAS

### 1. Sistema de Tema Dark/Light
- Toggle de tema no header (ícone Sol/Lua)
- Persistência do tema escolhido
- Transições suaves entre temas
- Context: `ThemeContext.jsx`

### 2. Carrinho de Compras
- Sidebar deslizante da direita (slide-in)
- Adicionar/remover produtos
- Ajustar quantidades (+/-)
- Exibir total
- Botão "Finalizar Compra" que abre checkout Mercado Pago
- Badge com contador de itens no ícone do carrinho
- Hook: `useCart.jsx`

### 3. Animações com Framer Motion
- Header com animação de entrada (y: -100 → 0)
- Hero section com animações escalonadas
- Cards de produtos com hover (y: -10, scale: 1.02)
- Scroll animations (whileInView)
- Menu mobile com overlay e animação de slide
- Shopping cart com slide-in da direita

### 4. Navegação
- Menu desktop horizontal
- Menu mobile com overlay escuro e painel deslizante
- Links ativos com hover states
- Navegação condicional (mostrar/esconder header em rotas admin)

### 5. Produtos
- Grid responsivo de produtos
- Cards clicáveis que navegam para detalhes
- Exibição de preços (mensal, anual, vitalício)
- Imagens com fallback
- Loading states com spinner
- Product detail page com:
  - Seleção de planos (radio buttons visuais)
  - Botão "Iniciar Teste Grátis" (se disponível)
  - Botão "Adicionar ao Carrinho"
  - Lista de features
  - Descrição detalhada

### 6. Autenticação
- Login com Supabase
- Cadastro
- Recuperação de senha
- OAuth Google (callback em `/auth/callback`)
- Proteção de rotas admin
- Exibir nome do usuário no header quando logado
- Botão de logout

### 7. Toast Notifications
- Sistema de toast para feedback ao usuário
- Componente: `Toaster.jsx` e `toast.jsx`
- Variantes: default, destructive

### 8. Formulários
- React Hook Form para validação
- Componentes UI: Input, Select, Label, Button
- Feedback visual de erros

### 9. Responsividade
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Menu mobile funcional
- Grid adaptativo

## PALETA DE CORES ATUAL

```css
--primary-blue: #3B82F6
--accent-turquoise: #14B8A6
--accent-magenta: #D946EF
--dark-bg: #111827
--light-bg: #EBF4FF
```

**Cores do Tailwind config:**
- Sistema de cores baseado em HSL com variáveis CSS
- Suporte a dark mode via classe

## ELEMENTOS VISUAIS ATUAIS

### Gradientes
- Text gradient: `linear-gradient(135deg, var(--primary-blue), var(--accent-turquoise))`
- Background gradients em várias seções
- Border gradients no footer

### Efeitos
- Backdrop blur (glassmorphism) no header e cart
- Box shadows com cores temáticas
- Pulse animations em botões
- Hover effects com transform e shadow

### Tipografia
- Fonte: Inter (Google Fonts)
- Tamanhos: text-5xl a text-sm
- Pesos: 300, 400, 500, 600, 700, 800, 900

## REQUISITOS DO REDESIGN

### 1. Design Moderno e Atual
- **Estilo:** Minimalista, limpo, profissional
- **Tendências 2025:** Glassmorphism, gradientes sutis, micro-interações, espaçamento generoso
- **Visualizações:** Adicionar gráficos, dashboards visuais, animações de dados quando apropriado
- **Hierarquia visual:** Clara e bem definida
- **Espaçamento:** Respiração adequada entre elementos

### 2. Melhorias Visuais Específicas

#### Header
- Manter funcionalidade completa
- Melhorar visual do logo + texto
- Refinar animações de entrada
- Melhorar estados de hover nos links
- Badge do carrinho mais visível

#### Hero Section
- Design mais impactante e moderno
- Melhor uso de espaço e tipografia
- Animações mais fluidas
- Possivelmente adicionar elementos visuais decorativos (partículas, formas geométricas)

#### Cards de Produtos
- Design mais moderno e atraente
- Melhor hierarquia de informações
- Hover effects mais sofisticados
- Melhor apresentação de preços
- Badges para planos (Popular, Economia, etc.)

#### Product Detail Page
- Layout mais organizado e visualmente atraente
- Melhor apresentação dos planos de preço
- Destaque para o botão de teste grátis
- Seção de features mais visual
- Galeria de imagens se aplicável

#### Shopping Cart
- Sidebar mais elegante
- Melhor organização dos itens
- Animações de entrada/saída mais suaves
- Melhor feedback visual

#### Footer
- Layout mais organizado
- Melhor hierarquia de informações
- Links sociais mais destacados

### 3. Visualizações e Dashboards

#### Admin Dashboard
- Adicionar gráficos e métricas visuais
- Cards de estatísticas com ícones
- Gráficos de vendas, usuários, produtos
- Tabelas mais visuais e organizadas

#### Portal do Cliente
- Dashboard visual com estatísticas do usuário
- Gráficos de uso (se aplicável)
- Visualização de produtos ativos
- Timeline de atividades

### 4. Micro-interações
- Feedback visual em todos os cliques
- Loading states mais elaborados
- Transições suaves entre estados
- Animações de scroll reveal
- Hover effects consistentes

### 5. Acessibilidade
- Contraste adequado (WCAG AA mínimo)
- Estados de foco visíveis
- Navegação por teclado funcional
- Textos alternativos em imagens

### 6. Performance Visual
- Lazy loading de imagens
- Otimização de animações (will-change, transform)
- Skeleton loaders ao invés de spinners simples

## DIRETRIZES DE IMPLEMENTAÇÃO

### 1. Manter Estrutura de Arquivos
- Não alterar nomes de componentes
- Manter props e interfaces existentes
- Preservar hooks e contexts

### 2. Preservar Funcionalidades
- Todas as interações devem continuar funcionando
- Não remover funcionalidades existentes
- Manter integrações (Supabase, Mercado Pago)

### 3. Melhorar CSS/Tailwind
- Usar classes Tailwind ao invés de CSS inline quando possível
- Manter variáveis CSS para temas
- Organizar estilos de forma consistente

### 4. Componentes UI
- Manter componentes Radix UI existentes
- Melhorar estilização dos componentes
- Adicionar variantes visuais se necessário

### 5. Responsividade
- Garantir que todas as melhorias funcionem em mobile
- Testar em diferentes tamanhos de tela
- Manter menu mobile funcional

## ELEMENTOS A ADICIONAR (SUGESTÕES)

1. **Gráficos e Visualizações:**
   - Usar biblioteca como Recharts ou Chart.js para dashboards
   - Gráficos de vendas, crescimento, métricas

2. **Animações Avançadas:**
   - Partículas de fundo (usando libraries como particles.js ou framer-motion)
   - Scroll-triggered animations
   - Page transitions

3. **Componentes Visuais:**
   - Skeleton loaders
   - Progress bars
   - Badges e tags mais elaborados
   - Tooltips informativos

4. **Seções Adicionais (se fizer sentido):**
   - Testimonials section
   - FAQ section com accordion
   - Blog/News section
   - Integrations showcase

## CHECKLIST DE ENTREGA

- [ ] Todos os componentes redesenhados visualmente
- [ ] Todas as interações funcionando
- [ ] Tema dark/light funcionando
- [ ] Responsividade em todos os breakpoints
- [ ] Animações suaves e performáticas
- [ ] Visualizações adicionadas onde apropriado
- [ ] Acessibilidade mantida/melhorada
- [ ] Performance otimizada
- [ ] Código limpo e organizado
- [ ] Compatibilidade com navegadores modernos

## NOTAS IMPORTANTES

1. **NÃO alterar:**
   - Lógica de negócio
   - Estrutura de dados
   - Integrações com APIs
   - Rotas e navegação
   - Hooks e contexts (apenas estilização)

2. **FOCAR em:**
   - Visual e UX
   - Animações e transições
   - Organização visual
   - Hierarquia de informações
   - Modernização do design

3. **TESTAR:**
   - Todas as páginas
   - Fluxo de compra completo
   - Autenticação
   - Área administrativa
   - Portal do cliente
   - Mobile e desktop

## REFERÊNCIAS DE DESIGN (SUGESTÕES)

- Design systems modernos: Material Design 3, Ant Design, Chakra UI
- Sites de referência: Stripe, Linear, Vercel, Notion
- Tendências 2025: Glassmorphism, Neumorphism sutil, Gradientes suaves, Espaçamento generoso

---

**OBJETIVO FINAL:** Criar um visual moderno, profissional e atraente que mantenha todas as funcionalidades existentes e melhore significativamente a experiência do usuário através de design, animações e visualizações.

