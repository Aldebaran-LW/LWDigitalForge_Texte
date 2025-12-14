
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart as ShoppingCartIcon, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ShoppingCart from '@/components/ShoppingCart';
import { getAssetUrlFromStorage } from '@/config/assets';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20"
      >
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center min-h-[44px] min-w-[44px]" onClick={closeMenu}>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <img
                src={getAssetUrlFromStorage('Logo')}
                alt="LWDigitalForge Logo"
                className="h-7 sm:h-8 mr-2"
              />
              <span className="text-xl sm:text-2xl font-bold text-gradient hidden sm:block">
                LWDigitalForge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-sm lg:text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300 py-2 px-1">Início</Link>
            <Link to="/produtos" className="text-sm lg:text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300 py-2 px-1">Produtos</Link>
            <Link to="/sobre" className="text-sm lg:text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300 py-2 px-1">Sobre</Link>
            
            {user ? (
              <>
                <Button asChild className="btn-primary px-4 lg:px-6 py-2 text-sm lg:text-base rounded-lg font-semibold min-h-[44px]">
                  <Link to="/portal/meus-produtos">
                    <User size={16} className="mr-2" />
                    <span className="hidden lg:inline">{profile?.full_name || 'Minha Conta'}</span>
                    <span className="lg:hidden">Conta</span>
                  </Link>
                </Button>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Sair">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Button asChild className="btn-primary px-4 lg:px-6 py-2 text-sm lg:text-base rounded-lg font-semibold min-h-[44px]">
                <Link to="/login">Portal do Cliente</Link>
              </Button>
            )}
            
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ShoppingCartIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold text-center leading-5">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ShoppingCartIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold text-center leading-5">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-40 mt-[60px] sm:mt-[68px] bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20 md:hidden max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-68px)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-1">
              <Link to="/" onClick={closeMenu} className="block w-full text-left py-3 px-2 text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center">Início</Link>
              <Link to="/produtos" onClick={closeMenu} className="block w-full text-left py-3 px-2 text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center">Produtos</Link>
              <Link to="/sobre" onClick={closeMenu} className="block w-full text-left py-3 px-2 text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center">Sobre</Link>
              
              {user ? (
                <>
                  <Link to="/portal/meus-produtos" onClick={closeMenu} className="block w-full text-left py-3 px-2 text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center">
                    <User size={18} className="mr-3" />
                    {profile?.full_name || 'Minha Conta'}
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-3 px-2 text-base text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center">
                    <LogOut size={18} className="mr-3" />
                    Sair
                  </button>
                </>
              ) : (
                <Button asChild className="w-full btn-primary py-3 rounded-lg font-semibold min-h-[48px] mt-2">
                  <Link to="/login" onClick={closeMenu}>Portal do Cliente</Link>
                </Button>
              )}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
                <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex-1">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span className="text-sm">Alternar Tema</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;
