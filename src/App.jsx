
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import PaginaProdutos from '@/pages/PaginaProdutos';
import PaginaSobre from '@/pages/PaginaSobre';
import PaginaLogin from '@/pages/PaginaLogin';
import PaginaContatoOrcamento from '@/pages/PaginaContatoOrcamento';
import PaginaCadastro from '@/pages/PaginaCadastro';
import PaginaEsqueciSenha from '@/pages/PaginaEsqueciSenha';
import PaginaRedefinirSenha from '@/pages/PaginaRedefinirSenha';
import PaginaCarrinho from '@/pages/PaginaCarrinho';
import PaginaTermos from '@/pages/PaginaTermos';
import PaginaPrivacidade from '@/pages/PaginaPrivacidade';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SuccessPage from '@/pages/SuccessPage';
import FailurePage from '@/pages/FailurePage';
import PendingPage from '@/pages/PendingPage';
import AuthCallback from '@/pages/AuthCallback';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';

// Admin Imports
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminGerenciarProdutos from '@/pages/admin/AdminGerenciarProdutos';
import AdminFormularioProduto from '@/pages/admin/AdminFormularioProduto';
import AdminVendas from '@/pages/admin/AdminVendas';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import AdminTiposDeProduto from '@/pages/admin/AdminTiposDeProduto';

// Portal Imports
// import PortalLayout from '@/layouts/PortalLayout'; // Futuramente
import PortalMeusProdutos from '@/pages/portal/PortalMeusProdutos';
import PortalTestes from '@/pages/portal/PortalTestes';
import PortalPagamentos from '@/pages/portal/PortalPagamentos';

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {!isAuthRoute && <Header />}
      
      <main className={`flex-grow ${!isAuthRoute ? 'pt-20' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<PaginaProdutos />} />
          <Route path="/produtos/:id" element={<ProductDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/sobre" element={<PaginaSobre />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/contato-orcamento" element={<PaginaContatoOrcamento />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/esqueci-senha" element={<PaginaEsqueciSenha />} />
          <Route path="/redefinir-senha" element={<PaginaRedefinirSenha />} />
          <Route path="/carrinho" element={<PaginaCarrinho />} />
          <Route path="/termos-de-uso" element={<PaginaTermos />} />
          <Route path="/pagina-privacidade" element={<PaginaPrivacidade />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

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
            <Route path="tipos-produto" element={<AdminTiposDeProduto />} />
            <Route path="vendas" element={<AdminVendas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          {/* Customer Portal Routes (ainda sem layout unificado) */}
          <Route path="/portal/meus-produtos" element={<PortalMeusProdutos />} />
          <Route path="/portal/testes" element={<PortalTestes />} />
          <Route path="/portal/pagamentos" element={<PortalPagamentos />} />

        </Routes>
      </main>
      
      {!isAuthRoute && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
