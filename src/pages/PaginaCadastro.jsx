import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Eye, EyeOff, Loader2, User, Phone, Mail, Lock, ArrowRight, Code2, CheckCircle2 } from 'lucide-react';
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
  const { signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const googleData = localStorage.getItem('googleSignupData');
    if (googleData) {
      try {
        const data = JSON.parse(googleData);
        setEmail(data.email || '');
        setFullName(data.full_name || '');
        setFromGoogle(true);
        toast({
          title: 'Dados do Google carregados',
          description: 'Complete o cadastro com os dados restantes.',
        });
        localStorage.removeItem('googleSignupData');
      } catch (error) {
        console.error('Erro ao carregar dados do Google:', error);
      }
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Senha muito curta', description: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Erro', description: 'As senhas não coincidem.' });
      return;
    }
    const { error } = await signUp(fullName, phone, email, password);
    if (!error) {
      setFullName(''); setPhone(''); setEmail(''); setPassword(''); setConfirmPassword('');
    }
  };

  const InputField = ({ id, label, type, value, onChange, placeholder, icon: Icon, disabled, extra }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${extra ? 'pr-11' : 'pr-4'} py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Criar Conta - LWDigitalForge</title>
        <meta name="description" content="Crie sua conta para acessar nossos produtos e serviços." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-violet-600 via-blue-700 to-blue-600 items-center justify-center p-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
          />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-400/20 blur-[80px]" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-10">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">LWDigitalForge</span>
            </Link>

            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Comece sua
              <br />
              jornada digital
            </h2>
            <p className="text-blue-100 text-base leading-relaxed mb-10">
              Crie sua conta e tenha acesso às nossas soluções digitais desenvolvidas para impulsionar seu negócio.
            </p>

            <div className="space-y-3">
              {[
                'Acesso a todas as soluções digitais',
                'Suporte técnico dedicado',
                'Atualizações e melhorias constantes',
                'Tecnologia de ponta para seu negócio',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-blue-100 text-sm">
                  <CheckCircle2 size={16} className="text-cyan-300 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#080C14] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <Code2 size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">LWDigitalForge</span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {fromGoogle ? 'Complete seu cadastro' : 'Criar nova conta'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Já tem conta?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Faça login
              </Link>
            </p>

            {/* Google button (only if not from google) */}
            {!fromGoogle && (
              <>
                <Button
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full h-11 mb-5 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl font-medium text-sm transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar com Google
                </Button>
                <div className="relative flex items-center mb-5">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                  <span className="px-3 text-xs text-gray-400">ou com e-mail</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                </div>
              </>
            )}

            {fromGoogle && (
              <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
                <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Cadastrando com conta Google
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    disabled={fromGoogle}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all group"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaginaCadastro;
