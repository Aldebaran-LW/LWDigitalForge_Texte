
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PortalPagamentos = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSales = async () => {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Erro ao verificar sua sessão. Por favor, tente recarregar a página.");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setSales([]);
        setLoading(false);
        return;
      }

      const userEmail = session.user.email;

      const { data, error: salesError } = await supabase
        .from('sales')
        .select(`
          id,
          created_at,
          total_amount,
          products (name)
        `)
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (salesError) {
        setError("Falha ao buscar seu histórico. Tente novamente mais tarde.");
        console.error('Supabase error:', salesError.message);
        setLoading(false);
        return;
      }

      setSales(data);
      setLoading(false);
    };

    fetchUserSales();
  }, []);

  const formatPrice = (priceInCents) => {
    if (priceInCents === null || priceInCents === undefined) return 'N/A';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center">
          <AlertTriangle className="mr-3 h-6 w-6" />
          <div>
            <p className="font-bold">Ocorreu um erro</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (sales.length === 0) {
        return (
            <div className="text-center bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg border-2 border-dashed dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2">Nenhum pagamento no histórico</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Parece que você ainda não fez nenhuma compra. Explore nossos produtos!</p>
                <Button asChild>
                    <Link to="/produtos">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Ver Produtos
                    </Link>
                </Button>
            </div>
        );
    }

    return (
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="py-3 px-4">Produto</th>
              <th className="py-3 px-4">Valor</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">ID da Transação</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <motion.tr
                key={sale.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-200">{sale.products?.name || 'Produto Indisponível'}</td>
                <td className="py-4 px-4">{formatPrice(sale.total_amount)}</td>
                <td className="py-4 px-4">{formatDate(sale.created_at)}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Pago
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-gray-400 dark:text-gray-500 font-mono text-xs">{sale.id}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Histórico de Pagamentos - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Histórico de Pagamentos</h1>
        {renderContent()}
      </div>
    </>
  );
};

export default PortalPagamentos;
