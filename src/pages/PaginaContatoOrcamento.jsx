import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';

const PaginaContatoOrcamento = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "✅ Orçamento Enviado!",
            description: "Recebemos sua solicitação. Nossa equipe entrará em contato em breve.",
        });
        e.target.reset();
    };

    return (
        <>
            <Helmet>
                <title>Contato e Orçamento - LWDigitalForge</title>
                <meta name="description" content="Solicite um orçamento para sua automação personalizada ou entre em contato conosco." />
            </Helmet>
            <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-[#111827]/50 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-[#3B82F6]/20"
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient px-2">Central de Orçamentos de Automação</h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-[#F9FAFB]/70 mt-2 px-2">Tem uma ideia? Nós podemos construir.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div>
                                <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-1.5 sm:mb-2" htmlFor="name">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="name" type="text" placeholder="Seu nome" className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 text-base text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] min-h-[48px]" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-1.5 sm:mb-2" htmlFor="email">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="email" type="email" placeholder="seu@email.com" className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 text-base text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] min-h-[48px]" required />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 sm:mb-4">
                            <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-1.5 sm:mb-2" htmlFor="phone">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 text-base text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] min-h-[48px]" />
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <label className="block text-gray-700 dark:text-[#F9FAFB]/80 text-sm font-bold mb-1.5 sm:mb-2" htmlFor="message">Descreva a automação que você deseja</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 sm:left-4 top-4 h-5 w-5 text-gray-400" />
                                <textarea id="message" placeholder="Ex: Preciso de um bot que envie lembretes de agendamento..." rows="5" className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-3 text-base text-gray-700 dark:text-white bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-y min-h-[120px]" required></textarea>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <Button type="submit" className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg min-h-[48px]">
                                Enviar Pedido de Orçamento
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default PaginaContatoOrcamento;