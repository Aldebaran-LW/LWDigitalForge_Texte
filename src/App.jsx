
import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { usePortalAuth } from '@/hooks/usePortalAuth';

// Eager load components that are always needed
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

// Lazy load page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const PaginaProdutos = lazy(() => import('@/pages/PaginaProdutos'));
const PaginaPortfolio = lazy(() => import('@/pages/PaginaPortfolio'));
const PaginaSobre = lazy(() => import('@/pages/PaginaSobre'));
const PaginaLogin = lazy(() => import('@/pages/PaginaLogin'));
const PaginaContatoOrcamento = lazy(() => import('@/pages/PaginaContatoOrcamento'));
const PaginaCadastro = lazy(() => import('@/pages/PaginaCadastro'));
const PaginaEsqueciSenha = lazy(() => import('@/pages/PaginaEsqueciSenha'));
const PaginaRedefinirSenha = lazy(() => import('@/pages/PaginaRedefinirSenha'));
const PaginaCarrinho = lazy(() => import('@/pages/PaginaCarrinho'));
const PaginaTermos = lazy(() => import('@/pages/PaginaTermos'));
const PaginaPrivacidade = lazy(() => import('@/pages/PaginaPrivacidade'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const AssinaturaNecessaria = lazy(() => import('@/pages/AssinaturaNecessaria'));
const PaginaRecursos = lazy(() => import('@/pages/PaginaRecursos'));
const PaginaBlog = lazy(() => import('@/pages/PaginaBlog'));
const PaginaArtigo = lazy(() => import('@/pages/PaginaArtigo'));
const PaginaDocs = lazy(() => import('@/pages/PaginaDocs'));
const PaginaDoc = lazy(() => import('@/pages/PaginaDoc'));

// Lazy load layouts
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const PortalLayout = lazy(() => import('@/components/portal/PortalLayout'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminGerenciarProdutos = lazy(() => import('@/pages/admin/AdminGerenciarProdutos'));
const AdminFormularioProduto = lazy(() => import('@/pages/admin/AdminFormularioProduto'));
const AdminPortfolio = lazy(() => import('@/pages/admin/AdminPortfolio'));
const AdminFormularioPortfolio = lazy(() => import('@/pages/admin/AdminFormularioPortfolio'));
const AdminVendas = lazy(() => import('@/pages/admin/AdminVendas'));
const AdminUsuarios = lazy(() => import('@/pages/admin/AdminUsuarios'));
const AdminTiposDeProduto = lazy(() => import('@/pages/admin/AdminTiposDeProduto'));
const AdminContato = lazy(() => import('@/pages/admin/AdminContato'));
const AdminHeroHome = lazy(() => import('@/pages/admin/AdminHeroHome'));
const AdminControleAcesso = lazy(() => import('@/pages/admin/AdminControleAcesso'));
const AdminAplicacoes = lazy(() => import('@/pages/admin/AdminAplicacoes'));
const AdminBlog = lazy(() => import('@/pages/admin/AdminBlog'));
const AdminFormularioBlog = lazy(() => import('@/pages/admin/AdminFormularioBlog'));

// Lazy load portal pages
const PortalDashboard = lazy(() => import('@/pages/portal/PortalDashboard'));
const PortalProdutos = lazy(() => import('@/pages/portal/PortalProdutos'));
const PortalMeusProdutos = lazy(() => import('@/pages/portal/PortalMeusProdutos'));
const PortalTestes = lazy(() => import('@/pages/portal/PortalTestes'));
const PortalAssinaturas = lazy(() => import('@/pages/portal/PortalAssinaturas'));
const PortalPagamentos = lazy(() => import('@/pages/portal/PortalPagamentos'));
const PortalContato = lazy(() => import('@/pages/portal/PortalContato'));
const PortalNotificacoes = lazy(() => import('@/pages/portal/PortalNotificacoes'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando...</span>
  </div>
);


function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal');
  
  // ✅ Verificar autenticação via portal (hash na URL)
  const { isChecking, cameFromPortal } = usePortalAuth();

  // Mostrar loading enquanto verifica autenticação do portal
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {!isAuthRoute && <Header />}

      <main className={`flex-grow ${!isAuthRoute ? 'pt-16 sm:pt-20' : ''}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos" element={<PaginaProdutos />} />
            <Route path="/produtos/:id" element={<ProductDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/portfolio" element={<PaginaPortfolio />} />
            <Route path="/sobre" element={<PaginaSobre />} />
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/contato-orcamento" element={<PaginaContatoOrcamento />} />
            <Route path="/cadastro" element={<PaginaCadastro />} />
            <Route path="/esqueci-senha" element={<PaginaEsqueciSenha />} />
            <Route path="/redefinir-senha" element={<PaginaRedefinirSenha />} />
            <Route path="/carrinho" element={<PaginaCarrinho />} />
            <Route path="/termos-de-servico" element={<PaginaTermos />} />
            <Route path="/termos-de-uso" element={<PaginaTermos />} />
            <Route path="/politica-de-privacidade" element={<PaginaPrivacidade />} />
            <Route path="/pagina-privacidade" element={<PaginaPrivacidade />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/assinatura-necessaria" element={<AssinaturaNecessaria />} />
            <Route path="/recursos" element={<PaginaRecursos />} />
            <Route path="/blog" element={<PaginaBlog />} />
            <Route path="/blog/:slug" element={<PaginaArtigo />} />
            <Route path="/docs" element={<PaginaDocs />} />
            <Route path="/docs/:slug" element={<PaginaDoc />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="produtos" element={<AdminGerenciarProdutos />} />
              <Route path="produtos/novo" element={<AdminFormularioProduto />} />
              <Route path="produtos/:id/editar" element={<AdminFormularioProduto />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="portfolio/novo" element={<AdminFormularioPortfolio />} />
              <Route path="portfolio/:id/editar" element={<AdminFormularioPortfolio />} />
              <Route path="tipos-produto" element={<AdminTiposDeProduto />} />
              <Route path="vendas" element={<AdminVendas />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="controle-acesso" element={<AdminControleAcesso />} />
              <Route path="aplicacoes" element={<AdminAplicacoes />} />
              <Route path="contato" element={<AdminContato />} />
              <Route path="hero-home" element={<AdminHeroHome />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/novo" element={<AdminFormularioBlog />} />
              <Route path="blog/:id/editar" element={<AdminFormularioBlog />} />
            </Route>

            {/* Customer Portal Routes */}
            <Route
              path="/portal"
              element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="dashboard" element={<PortalDashboard />} />
              <Route path="produtos" element={<PortalProdutos />} />
              <Route path="meus-produtos" element={<PortalMeusProdutos />} />
              <Route path="testes" element={<PortalTestes />} />
              <Route path="assinaturas" element={<PortalAssinaturas />} />
              <Route path="pagamentos" element={<PortalPagamentos />} />
              <Route path="contato" element={<PortalContato />} />
              <Route path="notificacoes" element={<PortalNotificacoes />} />
            </Route>

          </Routes>
        </Suspense>
      </main>

      {!isAuthRoute && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
