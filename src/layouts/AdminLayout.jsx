
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const adminNavLinks = [
  { to: '/admin/dashboard', text: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/produtos', text: 'Produtos', icon: Package },
  { to: '/admin/vendas', text: 'Vendas', icon: ShoppingCart },
  { to: '/admin/usuarios', text: 'Usuários', icon: Users },
  { to: '/admin/tipos-produto', text: 'Tipos de Produto', icon: Tag },
];

const AdminLayout = () => {
  const { theme } = useTheme();

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-500 text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${theme}`}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gradient">Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {adminNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
              <link.icon className="w-5 h-5 mr-3" />
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink to="/" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 mr-3" />
            <span>Voltar ao Site</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
