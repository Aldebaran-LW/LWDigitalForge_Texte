
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';
import ShoppingCart from '@/components/ShoppingCart';
import { ASSETS } from '@/config/assets';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20"
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <img
                src={ASSETS.Logo}
                alt="LWDigitalForge Logo"
                className="h-8 mr-2"
              />
              <span className="text-2xl font-bold text-gradient hidden sm:block">
                LWDigitalForge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
            >
              Início
            </Link>
            <Link
              to="/produtos"
              className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
            >
              Produtos
            </Link>
            <Link
              to="/sobre"
              className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
            >
              Sobre
            </Link>
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
          <div className="md:hidden flex items-center gap-4">
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3B82F6]/20 md:hidden"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
                >
                  Início
                </Link>
                <Link
                  to="/produtos"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
                >
                  Produtos
                </Link>
                <Link
                  to="/sobre"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left text-gray-700 dark:text-[#F9FAFB] hover:text-[#3B82F6] transition-colors duration-300"
                >
                  Sobre
                </Link>
                <Button asChild className="w-full btn-primary px-6 py-2 rounded-lg font-semibold">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Portal do Cliente</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;
