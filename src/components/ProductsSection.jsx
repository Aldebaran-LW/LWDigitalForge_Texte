
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/ProductsList';

const ProductsSection = () => {
  return (
    <section className="py-20 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Soluções Criadas para a Sua Produtividade
          </h2>
          <p className="text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto">
            Descubra ferramentas poderosas que transformam a maneira como você trabalha
          </p>
        </motion.div>

        <ProductsList />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
            <Link to="/produtos">Ver Todos os Produtos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
