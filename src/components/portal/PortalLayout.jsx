
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, CreditCard, TestTube2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const PortalLayout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/portal/meus-produtos', icon: Package, label: 'Meus Produtos' },
    { href: '/portal/testes', icon: TestTube2, label: 'Testes Ativos' },
    { href: '/portal/pagamentos', icon: CreditCard, label: 'Pagamentos' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
             <img
              src="https://horizons-cdn.hostinger.com/758a5a0c-3537-4df4-a495-ab13beb5b033/afb7579835ff809c5e86f98a5b3a75b6.png"
              alt="LWDigitalForge Logo"
              className="h-8"
            />
            <span className="text-xl font-bold text-gradient">Portal</span>
          </div>
          <div className="mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo(a),</p>
            <p className="font-semibold text-gray-800 dark:text-white truncate" title={profile?.full_name || profile?.email}>
              {profile?.full_name || profile?.email}
            </p>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname.startsWith(link.href)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-2">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
