
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, AppWindow, ArrowLeft, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const adminNavLinks = [
  { to: '/admin/dashboard', text: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/produtos', text: 'Produtos', icon: Package },
  { to: '/admin/aplicacoes', text: 'Aplicações', icon: AppWindow },
  { to: '/admin/vendas', text: 'Vendas', icon: ShoppingCart },
  { to: '/admin/usuarios', text: 'Usuários', icon: Users },
  { to: '/admin/tipos-produto', text: 'Tipos de Produto', icon: Tag },
];

const AdminLayout = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-500 text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gradient">Admin</h1>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {adminNavLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={getNavLinkClass} onClick={() => setSidebarOpen(false)}>
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
    </>
  );

  return (
    <div className={`relative min-h-screen md:flex bg-gray-100 dark:bg-gray-900 ${theme}`}>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                   transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 
                   w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out z-30`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gradient">Admin</h1>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
