import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';
import { Sparkles, Zap } from 'lucide-react';

const PaginaProdutos = () => {
  return (
    <>
      <Helmet>
        <title>Nossas Soluções - LWDigitalForge</title>
        <meta name="description" content="Explore nossa gama de soluções digitais projetadas para maximizar sua produtividade." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#F0F4FF] to-white dark:from-[#080C14] dark:to-[#0D1526]">
        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-500/8 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo de Soluções
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900 dark:text-white"
          >
            Nossas{' '}
            <span className="text-gradient">Soluções</span>
            <br />
            Digitais
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Ferramentas digitais inteligentes desenvolvidas para transformar a maneira como você trabalha
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {[
              { label: 'Soluções Disponíveis', value: '10+', icon: Zap },
              { label: 'Clientes Atendidos', value: '50+', icon: Sparkles },
              { label: 'Satisfação', value: '100%', icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/6">
                <span className="font-bold text-blue-600 dark:text-blue-400">{stat.value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products list */}
      <section className="py-12 md:py-20 px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <ProductsList />
        </div>
      </section>
    </>
  );
};

export default PaginaProdutos;
