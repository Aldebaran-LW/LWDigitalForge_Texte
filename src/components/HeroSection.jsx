import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ASSETS } from '@/config/assets';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <img
          src={ASSETS.Capa}
          alt="Fundo tecnológico com circuitos e linhas de dados"
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--light-bg)] dark:from-[var(--dark-bg)] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight"
          >
            Automação Inteligente
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="text-2xl md:text-4xl font-semibold mb-8 text-gray-800 dark:text-[#F9FAFB]"
          >
            Bots e Ferramentas que Trabalham por Você
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-lg md:text-xl mb-12 text-gray-600 dark:text-[#F9FAFB]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Transforme sua produtividade com soluções automatizadas que funcionam 24/7. 
            Bots Telegram inteligentes e planilhas Excel que fazem o trabalho pesado por você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
              <Link to="/produtos">Ver Nossas Soluções</Link>
            </Button>
            
            <Button asChild className="btn-secondary px-8 py-4 text-lg font-semibold rounded-lg bg-transparent">
              <Link to="/contato-orcamento">Fale Conosco</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;