import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/config/assets';
import { Zap, Clock, TrendingUp, Shield, Globe } from 'lucide-react';

const HeroSection = () => {
  const quickStats = [
    { icon: Globe, value: 'Web', label: 'Aplicações Modernas' },
    { icon: Zap, value: '100%', label: 'Personalizado' },
    { icon: TrendingUp, value: 'Empresas', label: 'Soluções B2B' },
    { icon: Shield, value: '100%', label: 'Seguro e Confiável' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pb-20">
      <div className="absolute inset-0">
        <img
          src={getAssetUrl('Capa')}
          alt="Fundo tecnológico com circuitos e linhas de dados"
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--light-bg)] dark:from-[var(--dark-bg)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--light-bg)] dark:to-[var(--dark-bg)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge de Destaque */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 dark:border-teal-500/20"
          >
            <Zap className="w-4 h-4 text-blue-500 dark:text-teal-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-teal-400">
              Aplicações Web e Sites Personalizados para Empresas
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-gradient leading-tight px-2"
          >
            Aplicações Web
            <br />
            <span className="text-gray-800 dark:text-[#F9FAFB]">que Impulsionam seu Negócio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-gray-700 dark:text-[#F9FAFB]/90 px-2"
          >
            Sites e Aplicações Web Personalizadas para Transformar sua Empresa
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Desenvolvemos <strong className="text-blue-600 dark:text-teal-400">aplicações web modernas</strong>, 
            <strong className="text-blue-600 dark:text-teal-400"> sites institucionais</strong> e 
            <strong className="text-blue-600 dark:text-teal-400"> sistemas personalizados</strong> que 
            automatizam processos, melhoram a produtividade e geram resultados reais para sua empresa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 mb-12 sm:mb-16"
          >
            <Button asChild className="btn-primary w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg pulse-glow min-h-[52px] shadow-lg hover:shadow-xl">
              <Link to="/produtos">🚀 Explorar Soluções</Link>
            </Button>
            
            <Button asChild className="btn-secondary w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-lg bg-transparent min-h-[52px] border-2">
              <Link to="/contato-orcamento">💬 Falar com Especialista</Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-2"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500 dark:text-teal-400" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;