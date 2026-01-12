import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

/**
 * Página exibida quando o usuário tenta acessar um produto sem assinatura
 */
const AssinaturaNecessaria = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('app');

  return (
    <>
      <Helmet>
        <title>Assinatura Necessária - LW Digital Forge</title>
        <meta name="description" content="Você precisa de uma assinatura ativa para acessar este produto." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
        >
          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-4">
              <Lock className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Assinatura Necessária
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Você precisa de uma assinatura ativa para acessar este produto.
            Escolha um plano que melhor se adequa às suas necessidades.
          </p>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Link to="/portal/assinaturas">
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ver Assinaturas Disponíveis
              </Button>
            </Link>

            <Link to="/portal/produtos">
              <Button variant="outline" className="w-full" size="lg">
                <Package className="h-5 w-5 mr-2" />
                Ver Todos os Produtos
              </Button>
            </Link>

            <Link to="/portal/dashboard">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Dashboard
              </Button>
            </Link>
          </div>

          {/* Informação adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Precisa de ajuda?{' '}
              <Link
                to="/portal/contato"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Entre em contato
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AssinaturaNecessaria;
