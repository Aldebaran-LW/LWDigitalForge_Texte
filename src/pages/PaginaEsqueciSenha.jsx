
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Mail, Loader2 } from 'lucide-react';

const PaginaEsqueciSenha = () => {
    const [email, setEmail] = useState('');
    const { resetPasswordForEmail, loading } = useAuth();

    const handleRecovery = async (e) => {
        e.preventDefault();
        await resetPasswordForEmail(email);
    };

    return (
        <>
            <Helmet>
                <title>Recuperar Senha - LWDigitalForge</title>
                <meta name="description" content="Recupere o acesso à sua conta LWDigitalForge." />
            </Helmet>
            <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={handleRecovery}
                        className="bg-white dark:bg-[#111827]/50 rounded-xl shadow-lg p-6 sm:p-7 md:p-8 border border-gray-200 dark:border-[#3B82F6]/20"
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Esqueceu a Senha?</h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-[#F9FAFB]/70 mt-2">Sem problemas. Insira seu e-mail para recuperar o acesso.</p>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-1.5 sm:mb-2" htmlFor="email">E-mail de Cadastro</label>
                            <div className="relative">
                                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                  id="email" 
                                  type="email" 
                                  placeholder="seu@email.com" 
                                  className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 text-base text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] min-h-[48px]" 
                                  required 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <Button type="submit" className="w-full btn-primary py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg min-h-[48px]" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </Button>
                        </div>

                        <p className="text-center text-sm text-gray-600 dark:text-[#F9FAFB]/70">
                            Lembrou a senha?{' '}
                            <Link to="/login" className="font-bold text-[#3B82F6] hover:underline">
                                Voltar para o Login
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default PaginaEsqueciSenha;
