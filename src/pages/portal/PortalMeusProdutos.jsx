
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Bot } from 'lucide-react';

const myProducts = [
  { id: 1, name: 'AutoBot Pro', type: 'BOT TELEGRAM', icon: Bot, actionText: 'Acessar Instruções' },
  { id: 2, name: 'DataMaster', type: 'PLANILHA EXCEL', icon: Download, actionText: 'Baixar Planilha' },
];

const PortalMeusProdutos = () => {
  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-6">Meus Produtos</h1>
        {myProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-[#0D1117] p-6 rounded-lg border dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.type}</p>
                </div>
                <Button className="w-full mt-4 btn-primary">
                  <product.icon className="mr-2 h-4 w-4" /> {product.actionText}
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Você ainda não adquiriu nenhum produto.</p>
        )}
      </div>
    </>
  );
};

export default PortalMeusProdutos;
