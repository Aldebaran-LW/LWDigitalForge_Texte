
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';
import ShoppingCart from '@/components/ShoppingCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20"
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <img
                src="https://horizons-cdn.hostinger.com/758a5a0c-3537-4df4-a495-ab13beb5b033/afb7579835ff809c5e86f98a5b3a75b6.png"
                alt="LWDigitalForge Logo"
                className="h-8 mr-2"
              />
              <span className="text-2xl font-bold text-gradient hidden sm:block">
                LWDigitalForge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300">Início</Link>
            <Link to="/produtos" className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300">Produtos</Link>
            <Link to="/sobre" className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300">Sobre</Link>
            <Button asChild className="btn-primary px-6 py-2 rounded-lg font-semibold">
              <Link to="/login">Portal do Cliente</Link>
            </Button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ShoppingCartIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] text-center leading-4">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors">
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
            className="fixed top-0 left-0 right-0 z-40 mt-[73px] bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20 md:hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link to="/" onClick={closeMenu} className="block w-full text-left py-2 text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6]">Início</Link>
              <Link to="/produtos" onClick={closeMenu} className="block w-full text-left py-2 text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6]">Produtos</Link>
              <Link to="/sobre" onClick={closeMenu} className="block w-full text-left py-2 text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6]">Sobre</Link>
              <Button asChild className="w-full btn-primary py-3 rounded-lg font-semibold">
                <Link to="/login" onClick={closeMenu}>Portal do Cliente</Link>
              </Button>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <button onClick={toggleTheme} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Alternar Tema</span>
                </button>
                <button onClick={() => { closeMenu(); setIsCartOpen(true); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
                  <ShoppingCartIcon size={20} />
                  <span>Carrinho</span>
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] text-center leading-4">
                      {totalItems}
                    </span>
                  )}
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
