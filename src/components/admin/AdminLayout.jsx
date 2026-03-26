
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Tag, Menu, X, MessageSquare, Briefcase, ImageIcon, Home } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { getAssetUrl } from '@/config/assets';
import { setAllowPublicHome } from '@/lib/publicSiteNav';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/produtos', icon: Package, label: 'Produtos' },
    { href: '/admin/portfolio', icon: Briefcase, label: 'Portfólio' },
    { href: '/admin/hero-home', icon: ImageIcon, label: 'Banners Home' },
    { href: '/admin/tipos-produto', icon: Tag, label: 'Tipos de Produto' },
    { href: '/admin/vendas', icon: ShoppingCart, label: 'Vendas' },
    { href: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { href: '/admin/contato', icon: MessageSquare, label: 'Mensagens', badge: null },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 sm:p-6 flex flex-col justify-between z-40 lg:z-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6 sm:mb-8 md:mb-10">
              <img
                src={getAssetUrl('Logo')}
                alt="LWDigitalForge Logo"
                className="h-7 sm:h-8"
              />
              <span className="text-lg sm:text-xl font-bold text-gradient">Admin</span>
            </div>
            <nav className="space-y-1 sm:space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base ${
                    location.pathname.startsWith(link.href)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <link.icon size={18} className="sm:w-5 sm:h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-1 sm:space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              onClick={() => {
                setAllowPublicHome();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] text-sm sm:text-base"
            >
              <Home size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Voltar ao site</span>
            </Link>
            <div className="px-3 sm:px-4">
              <ThemeToggle />
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400 transition-colors min-h-[44px] text-sm sm:text-base"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
