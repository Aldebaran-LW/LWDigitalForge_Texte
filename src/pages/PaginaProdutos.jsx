
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
      <section className="py-12 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Nossas Soluções de Automação
            </h1>
            <p className="text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto">
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
