
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  TestTube2, 
  LogOut, 
  Store, 
  Settings, 
  MessageSquare, 
  LayoutDashboard,
  User,
  ChevronRight,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import ThemeToggle from '@/components/ThemeToggle';
import { getAssetUrl } from '@/config/assets';
import { motion, AnimatePresence } from 'framer-motion';

const PortalLayout = () => {
  const { profile, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    trials: 0,
    subscriptions: 0,
    notifications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        return;
      }

      try {
        // Contar produtos comprados
        const { count: productsCount } = await supabase
          .from('user_purchases')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'APPROVED');

        // Contar testes ativos (não expirados) - mesma lógica do PortalTestes
        const now = new Date().toISOString();
        const { count: trialsCount } = await supabase
          .from('user_trials')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('expires_at', now); // Apenas testes não expirados

        // Contar assinaturas ativas (placeholder - implementar quando tiver tabela de assinaturas)
        const subscriptionsCount = 0;

        setStats({
          products: productsCount || 0,
          trials: trialsCount || 0,
          subscriptions: subscriptionsCount || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, [user]);

  const navLinks = [
    { 
      href: '/portal/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      badge: null
    },
    { 
      href: '/portal/produtos', 
      icon: Store, 
      label: 'Todos os Produtos',
      badge: null
    },
    { 
      href: '/portal/meus-produtos', 
      icon: Package, 
      label: 'Meus Produtos',
      badge: stats.products > 0 ? stats.products : null
    },
    { 
      href: '/portal/testes', 
      icon: TestTube2, 
      label: 'Testes Ativos',
      badge: stats.trials > 0 ? stats.trials : null
    },
    { 
      href: '/portal/assinaturas', 
      icon: Settings, 
      label: 'Assinaturas',
      badge: stats.subscriptions > 0 ? stats.subscriptions : null
    },
    { 
      href: '/portal/pagamentos', 
      icon: CreditCard, 
      label: 'Pagamentos',
      badge: null
    },
    { 
      href: '/portal/contato', 
      icon: MessageSquare, 
      label: 'Contato',
      badge: null
    },
  ];

  const isActive = (href) => {
    if (href === '/portal/dashboard') {
      return location.pathname === '/portal' || location.pathname === '/portal/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col h-full">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <img
              src={getAssetUrl('Logo')}
              alt="LWDigitalForge Logo"
              className="h-10"
            />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Portal do Cliente
            </span>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold">
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={profile?.full_name || profile?.email}>
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={profile?.email}>
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={link.href}
                    className={`group relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                  <div className="flex items-center gap-3">
                    <link.icon size={20} className={active ? 'text-white' : ''} />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      active 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                    {active && (
                      <ChevronRight size={16} className="text-white" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header - Fixed */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src={getAssetUrl('Logo')}
            alt="LWDigitalForge Logo"
            className="h-8"
          />
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Portal do Cliente
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={getAssetUrl('Logo')}
                    alt="LWDigitalForge Logo"
                    className="h-8"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Portal do Cliente
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info Mobile */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Mobile */}
              <nav className="space-y-1 mb-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? 'bg-blue-600 dark:bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={20} />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          active 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
        {/* Spacer for mobile header */}
        <div className="lg:hidden h-16 flex-shrink-0"></div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;
