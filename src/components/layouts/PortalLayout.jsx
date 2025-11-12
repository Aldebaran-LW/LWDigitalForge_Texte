
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const SidebarContent = ({ onLinkClick }) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao sair", description: error.message });
        } else {
            navigate('/'); // Redireciona para a página inicial após o logout
            toast({ title: "Você saiu da sua conta.", description: "Até a próxima!" });
        }
    };

    const navLinks = [
        { to: '/portal/meus-produtos', icon: ShoppingBag, label: 'Meus Produtos' },
        { to: '/portal/pagamentos', icon: CreditCard, label: 'Pagamentos' },
        { to: '/portal/meu-perfil', icon: User, label: 'Meu Perfil' },
    ];

    const baseLinkClasses = "flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg";
    const activeLinkClasses = "bg-gray-200 dark:bg-gray-700 font-bold text-gray-900 dark:text-white";
    const inactiveLinkClasses = "hover:bg-gray-200/50 dark:hover:bg-gray-700/50";

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Portal</h1>
            </div>
            <nav className="flex-grow space-y-2">
                {navLinks.map(link => (
                    <NavLink 
                        key={link.to} 
                        to={link.to}
                        onClick={onLinkClick}
                        className={({ isActive }) => 
                            `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                        }
                    >
                        <link.icon className="h-5 w-5 mr-3" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto space-y-2">
                 <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <Home className="mr-3 h-5 w-5" /> Ver Site
                    </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" /> Sair
                </Button>
            </div>
        </div>
    );
};

const PortalLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-black">
            {/* Sidebar para telas grandes */}
            <aside className="w-64 hidden lg:block fixed h-full z-20">
                <SidebarContent />
            </aside>

            {/* Sidebar para telas pequenas (mobile) */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside 
                className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
            </aside>

            {/* Conteúdo principal */}
            <div className="flex-1 lg:pl-64">
                 <header className="lg:hidden sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold">Portal</h1>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PortalLayout;
