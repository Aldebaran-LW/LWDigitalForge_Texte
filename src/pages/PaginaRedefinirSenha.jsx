
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaginaRedefinirSenha = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { updateUserPassword, loading, session, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // This effect checks if the user is in a password recovery flow.
        // If not, it redirects them.
        if (!authLoading && !session) {
            toast({
                variant: 'destructive',
                title: 'Link Inválido ou Expirado',
                description: 'Para redefinir sua senha, por favor, solicite um novo link.',
            });
            navigate('/esqueci-senha');
        }
    }, [session, authLoading, navigate, toast]);


    const handleReset = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast({ variant: "destructive", title: "Senha muito curta", description: "A senha deve ter no mínimo 6 caracteres." });
            return;
        }
        if (password !== confirmPassword) {
            toast({ variant: "destructive", title: "As senhas não coincidem" });
            return;
        }
        await updateUserPassword(password);
    };

    // Render a loading state or nothing while checking the session
    if (authLoading || !session) {
        return (
            <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Redefinir Senha - LWDigitalForge</title>
                <meta name="description" content="Crie uma nova senha para sua conta LWDigitalForge." />
            </Helmet>
            <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={handleReset}
                        className="bg-white dark:bg-[#111827]/50 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-[#3B82F6]/20"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gradient">Redefinir Senha</h1>
                            <p className="text-gray-600 dark:text-[#F9FAFB]/70 mt-2">Crie uma nova senha forte e segura.</p>
                        </div>

                        <div className="mb-4 relative">
                            <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-2" htmlFor="new-password">Nova Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                  id="new-password" 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Mínimo 6 caracteres" 
                                  className="w-full pl-10 p-3 text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                                  required
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 relative">
                            <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-2" htmlFor="confirm-new-password">Confirmar Nova Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                  id="confirm-new-password" 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  className="w-full pl-10 p-3 text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                                  required
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <Button type="submit" className="w-full btn-primary py-3 text-base font-semibold rounded-lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                            </Button>
                        </div>

                        <p className="text-center text-sm text-gray-600 dark:text-[#F9FAFB]/70">
                            Voltar para o{' '}
                            <Link to="/login" className="font-bold text-[#3B82F6] hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default PaginaRedefinirSenha;
