
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
import PaginaDetalhesProduto from '@/pages/PaginaDetalhesProduto';
import SuccessPage from '@/pages/SuccessPage';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

// Admin Imports
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminGerenciarProdutos from '@/pages/admin/AdminGerenciarProdutos';
import AdminFormularioProduto from '@/pages/admin/AdminFormularioProduto';
import AdminVendas from '@/pages/admin/AdminVendas';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import AdminTiposDeProduto from '@/pages/admin/AdminTiposDeProduto';

// Portal Imports
import PortalLayout from '@/components/portal/PortalLayout';
import PortalMeusProdutos from '@/pages/portal/PortalMeusProdutos';
import PortalTestes from '@/pages/portal/PortalTestes';
import PortalPagamentos from '@/pages/portal/PortalPagamentos';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPortalRoute = location.pathname.startsWith('/portal');
  const isPublicLayout = !isAdminRoute && !isPortalRoute;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] text-[#0D1117] dark:text-[#F9FAFB]">
      {isPublicLayout && <Header />}
      
      <main className={`flex-grow ${isPublicLayout ? 'pt-20' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<PaginaProdutos />} />
          <Route path="/produtos/:id" element={<PaginaDetalhesProduto />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/sobre" element={<PaginaSobre />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/contato-orcamento" element={<PaginaContatoOrcamento />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/esqueci-senha" element={<PaginaEsqueciSenha />} />
          <Route path="/redefinir-senha" element={<PaginaRedefinirSenha />} />
          <Route path="/carrinho" element={<PaginaCarrinho />} />
          <Route path="/termos-de-servico" element={<PaginaTermos />} />
          <Route path="/politica-de-privacidade" element={<PaginaPrivacidade />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}
          >
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="produtos" element={<AdminGerenciarProdutos />} />
            <Route path="produtos/novo" element={<AdminFormularioProduto />} />
            <Route path="produtos/:id/editar" element={<AdminFormularioProduto />} />
            <Route path="tipos-de-produto" element={<AdminTiposDeProduto />} />
            <Route path="vendas" element={<AdminVendas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          {/* Customer Portal Routes */}
          <Route 
            path="/portal" 
            element={<ProtectedRoute role="USER"><PortalLayout /></ProtectedRoute>}
          >
            {/* Redirect /portal to /portal/meus-produtos */}
            <Route index element={<Navigate to="/portal/meus-produtos" replace />} />
            <Route path="meus-produtos" element={<PortalMeusProdutos />} />
            <Route path="testes" element={<PortalTestes />} />
            <Route path="pagamentos" element={<PortalPagamentos />} />
          </Route>

        </Routes>
      </main>
      
      {isPublicLayout && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
