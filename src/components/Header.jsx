
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart as ShoppingCartIcon, User, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ShoppingCart from '@/components/ShoppingCart';
import { getAssetUrl } from '@/config/assets';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/portfolio', label: 'Portfólio' },
    { to: '/sobre', label: 'Sobre' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#080C14]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-gray-200/50 dark:border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative">
                <img
                  src={getAssetUrl('Logo')}
                  alt="LWDigitalForge Logo"
                  className="h-8 w-8 rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-md" />
              </div>
              <span className="text-lg font-bold hidden sm:block bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                LWDigitalForge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-500"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-all duration-200"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-all duration-200"
              aria-label="Carrinho"
            >
              <ShoppingCartIcon size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#080C14]">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  asChild
                  className="btn-primary h-9 px-4 text-sm font-semibold rounded-xl"
                >
                  <Link to="/portal/meus-produtos" className="flex items-center gap-1.5">
                    <User size={14} />
                    <span>{profile?.full_name?.split(' ')[0] || 'Portal'}</span>
                  </Link>
                </Button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Button
                asChild
                className="btn-primary h-9 px-5 text-sm font-semibold rounded-xl ml-1"
              >
                <Link to="/login" className="flex items-center gap-1.5">
                  Portal do Cliente
                  <ChevronRight size={14} />
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
            >
              <ShoppingCartIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[68px] left-4 right-4 z-40 md:hidden rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/8 shadow-2xl shadow-black/20 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    <ChevronRight size={14} className="opacity-40" />
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-white/5 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/portal/meus-produtos"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <User size={16} className="text-blue-500" />
                      {profile?.full_name || 'Minha Conta'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </>
                ) : (
                  <Button asChild className="btn-primary w-full h-11 rounded-xl font-semibold">
                    <Link to="/login" onClick={closeMenu}>
                      Portal do Cliente
                    </Link>
                  </Button>
                )}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;
