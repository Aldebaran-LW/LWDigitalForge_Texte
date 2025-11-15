
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminVendas = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchSales = useCallback(async () => {
    setLoading(true);
    // Nota: Esta query busca as últimas 50 vendas. Uma implementação futura
    // deve incluir paginação para lidar com um grande volume de dados.
    const { data, error } = await supabase
      .from('sales')
      .select(`
        id,
        created_at,
        total_price,
        user_email,
        products (name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar vendas', description: error.message });
    } else {
      setSales(data);
      setError(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Vendas</h1>
        {/* Espaço para futuros filtros ou botão de exportação */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin text-blue-500" /></div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
          <p className="font-bold flex items-center"><AlertTriangle className="mr-2"/>Erro</p>
          <p>{error}</p>
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">ID da Venda</th>
                <th scope="col" className="px-6 py-3">Cliente (Email)</th>
                <th scope="col" className="px-6 py-3">Produto</th>
                <th scope="col" className="px-6 py-3">Valor Total</th>
                <th scope="col" className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhuma venda encontrada.</td>
                </tr>
              ) : sales.map((sale, index) => (
                <motion.tr 
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {sale.id}
                  </th>
                  <td className="px-6 py-4">{sale.user_email || 'Não identificado'}</td>
                  <td className="px-6 py-4">{sale.products?.name || 'Produto não encontrado'}</td>
                  <td className="px-6 py-4">{formatPrice(sale.total_price)}</td>
                  <td className="px-6 py-4">{formatDate(sale.created_at)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminVendas;
