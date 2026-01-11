
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const PaginaLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();

  // Verificar acesso após login e redirecionar apropriadamente
  useEffect(() => {
    if (user) {
      checkAccessAndRedirect();
    }
  }, [user]);

  async function checkAccessAndRedirect() {
    try {
      // Chamar a função RPC que retorna o status de acesso do usuário
      const { data, error } = await supabase.rpc('get_user_apps_status', { 
        p_user_id: user.id 
      });

      if (error) {
        console.error("Erro ao verificar acesso:", error);
        // Fallback: redirecionar para dashboard se a função RPC não estiver disponível
        navigate('/portal/dashboard');
        return;
      }

      // Se o utilizador tiver acesso a QUALQUER app, mandar para o Dashboard
      const hasAnyAccess = data?.some(app => app.has_access);

      if (hasAnyAccess) {
        navigate('/portal/dashboard');
      } else {
        // Se for um utilizador novo sem nada, mandar para a página de produtos
        navigate('/portal/produtos');
      }
    } catch (err) {
      console.error("Erro no redirecionamento:", err);
      navigate('/portal/dashboard'); // Fallback seguro
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
    // Navigation será feita pelo useEffect quando user for definido
  };

  return (
    <>
      <Helmet>
        <title>Login - LWDigitalForge</title>
        <meta name="description" content="Acesse o portal do cliente ou o painel de administração." />
      </Helmet>
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-6 sm:p-7 md:p-8 space-y-6 sm:space-y-8 bg-white dark:bg-[#111827]/50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-blue-500/20"
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Acessar Plataforma</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Bem-vindo de volta!
            </p>
          </div>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px]"
                placeholder="seu@email.com"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 min-h-[48px]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-8 sm:top-9 flex items-center px-3 sm:px-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 min-h-[48px] min-w-[48px]"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm">
                <Link
                  to="/esqueci-senha"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 min-h-[44px] flex items-center"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full btn-primary min-h-[48px] text-base sm:text-lg font-semibold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#111827]/50 text-gray-500">Ou continue com</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={signInWithGoogle}
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[48px] text-base sm:text-lg font-semibold"
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 min-h-[44px] inline-flex items-center"
            >
              Crie uma agora
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default PaginaLogin;
