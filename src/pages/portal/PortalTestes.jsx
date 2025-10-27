
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const testProducts = [
  { id: 3, name: 'SalesBot Elite', timeLeft: '5 dias, 12 horas' },
];

const PortalTestes = () => {
  return (
    <>
      <Helmet>
        <title>Gerenciar Testes - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-6">Produtos em Teste</h1>
        {testProducts.length > 0 ? (
          <div className="space-y-4">
            {testProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-[#0D1117] p-4 rounded-lg border dark:border-gray-700 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tempo restante: {product.timeLeft}</p>
                </div>
                <Button>Comprar Agora</Button>
              </motion.div>
            ))}
          </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400">Você não possui produtos em período de teste.</p>
        )}
      </div>
    </>
  );
};

export default PortalTestes;
