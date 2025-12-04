
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Eye, EyeOff, Loader2, User, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaginaCadastro = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fromGoogle, setFromGoogle] = useState(false);
  const { signUp, loading } = useAuth();
  const { toast } = useToast();

  // Verificar se há dados do Google para pré-preencher
  useEffect(() => {
    const googleData = localStorage.getItem('googleSignupData');
    if (googleData) {
      try {
        const data = JSON.parse(googleData);
        setEmail(data.email || '');
        setFullName(data.full_name || '');
        setFromGoogle(true);
        
        toast({
          title: "Dados do Google carregados",
          description: "Complete o cadastro com os dados restantes.",
        });
        
        // Limpar dados do localStorage após uso
        localStorage.removeItem('googleSignupData');
      } catch (error) {
        console.error('Erro ao carregar dados do Google:', error);
      }
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      return;
    }
    
    const { error } = await signUp(fullName, phone, email, password);
    if (!error) {
      setFullName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Criar Conta - LWDigitalForge</title>
        <meta name="description" content="Crie sua conta para acessar nossos produtos e serviços." />
      </Helmet>
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#111827]/50 rounded-2xl shadow-lg border border-gray-200 dark:border-blue-500/20"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient">Criar Nova Conta</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {fromGoogle ? 'Complete seu cadastro para continuar' : 'Junte-se a nós e automatize seu sucesso.'}
            </p>
            {fromGoogle && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                Cadastrando com Google
              </div>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="fullName" name="fullName" type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 p-2 text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="phone" name="phone" type="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 p-2 text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="(XX) XXXXX-XXXX" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={fromGoogle} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Senha</label>
              <input id="confirm-password" name="confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Faça login
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default PaginaCadastro;
