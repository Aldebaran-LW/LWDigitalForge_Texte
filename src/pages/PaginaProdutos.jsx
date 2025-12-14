
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';

const PaginaProdutos = () => {
  return (
    <>
      <Helmet>
        <title>Nossas Soluções - LWDigitalForge</title>
        <meta name="description" content="Explore nossa gama de bots Telegram e planilhas Excel projetadas para maximizar sua produtividade." />
      </Helmet>
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gradient px-2">
              Nossas Soluções de Automação
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto px-2">
              Ferramentas poderosas e inteligentes projetadas para transformar a maneira como você trabalha.
            </p>
          </motion.div>

          <ProductsList />
        </div>
      </section>
    </>
  );
};

export default PaginaProdutos;
