
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Helmet>
        <title>Compra Realizada com Sucesso! - LWDigitalForge</title>
        <meta name="description" content="Obrigado pela sua compra. Seu pedido foi processado com sucesso." />
      </Helmet>
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 text-center bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-[#111827]/50 p-10 rounded-xl shadow-lg border border-gray-200 dark:border-blue-500/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Obrigado! Seu pedido foi processado. Em breve você receberá um e-mail com os detalhes e as instruções para acessar seu produto.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/produtos">Continuar Comprando</Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default SuccessPage;
