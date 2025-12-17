
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
          .from('user_purchases')
          .select(`
            id,
            status,
            purchase_type,
            amount_paid,
            created_at,
            expires_at,
            payment_method,
            payment_id,
            profiles:user_id ( email ),
            registered_apps:app_id ( name )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar vendas:', error);
          setSales([]);
        } else {
          const formattedSales = (data || []).map(sale => ({
            id: sale.id,
            customer: sale.profiles?.email || 'N/A',
            product: sale.registered_apps?.name || 'Produto não encontrado',
            amount: formatCurrency(sale.amount_paid),
            date: sale.created_at ? new Date(sale.created_at).toLocaleDateString('pt-BR') : 'N/A',
            status: sale.status || 'N/A',
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
      <div className="px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Histórico de Vendas</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto -mx-4 sm:mx-0"
          >
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-xs sm:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#111827] dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">ID</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden md:table-cell">Email</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Produto</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">Valor</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">Status</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden lg:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm">
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
                        <th scope="row" className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <span className="font-mono text-xs">#{String(sale.id).substring(0, 8)}</span>
                        </th>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <span className="truncate block max-w-[200px]">{sale.customer}</span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px] sm:max-w-none">{sale.product}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1 truncate max-w-[150px]">{sale.customer}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 lg:hidden mt-1">{sale.date}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">{sale.amount}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            sale.status === 'APPROVED' || sale.status === 'Pago' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell whitespace-nowrap">{sale.date}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminVendas;
