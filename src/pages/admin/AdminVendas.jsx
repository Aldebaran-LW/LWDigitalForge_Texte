
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const AdminVendas = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (cents) => {
    if (!cents || cents === 0) return 'R$ 0,00';
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select(`
            *,
            registered_apps (name)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar vendas:', error);
          setSales([]);
        } else {
          const formattedSales = (data || []).map(sale => ({
            id: sale.id,
            customer: sale.user_email || 'N/A',
            product: sale.registered_apps?.name || 'Produto não encontrado',
            amount: formatCurrency(sale.total_price),
            date: sale.created_at ? new Date(sale.created_at).toLocaleDateString('pt-BR') : 'N/A',
            status: sale.payment_status || 'N/A',
          }));
          setSales(formattedSales);
        }
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <>
      <Helmet>
        <title>Histórico de Vendas - LWDigitalForge Admin</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Vendas</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto"
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#111827] dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID da Transação</th>
                  <th scope="col" className="px-6 py-3">Email do Cliente</th>
                  <th scope="col" className="px-6 py-3">Produto Adquirido</th>
                  <th scope="col" className="px-6 py-3">Valor</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhuma venda registrada ainda.
                    </td>
                  </tr>
                ) : (
                  sales.map((sale, index) => (
                    <motion.tr 
                        key={sale.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        #{String(sale.id).substring(0, 8)}
                      </th>
                      <td className="px-6 py-4">{sale.customer}</td>
                      <td className="px-6 py-4">{sale.product}</td>
                      <td className="px-6 py-4 font-semibold">{sale.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          sale.status === 'paid' || sale.status === 'Pago' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{sale.date}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminVendas;
