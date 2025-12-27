
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PortalPagamentos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Buscar compras do usuário
        const { data: purchases, error } = await supabase
          .from('user_purchases')
          .select(`
            *,
            registered_apps:app_id (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Mapear compras para formato de pagamento
        const formattedPayments = (purchases || []).map(purchase => ({
          id: purchase.id,
          product: purchase.registered_apps?.name || 'Produto não encontrado',
          amount: purchase.amount_paid ? `R$ ${(purchase.amount_paid / 100).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
          date: purchase.created_at ? new Date(purchase.created_at).toLocaleDateString('pt-BR') : 'N/A',
          status: purchase.status === 'APPROVED' ? 'Pago' : purchase.status,
          isSubscription: purchase.purchase_type !== 'LIFETIME',
          productId: purchase.app_id
        }));

        setPayments(formattedPayments);
      } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar o histórico de pagamentos.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, toast]);
  return (
    <>
      <Helmet>
        <title>Pagamentos - Portal LWDigitalForge</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Histórico de Pagamentos</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualize todas as suas transações</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="py-2 sm:py-3 px-3 sm:px-4">Produto</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">Valor</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 hidden md:table-cell">Data</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">Status</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-right"></th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment, index) => (
                    <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                    <td className="py-3 sm:py-4 px-3 sm:px-4 font-medium">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[200px] sm:max-w-none">{payment.product}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">{payment.date}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-nowrap">{payment.amount}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell whitespace-nowrap">{payment.date}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${payment.status === 'Pago' || payment.status === 'Ativa' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                            {payment.status}
                        </span>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                        {payment.isSubscription ? (
                          <Link to="/portal/assinaturas">
                            <Button variant="outline" size="sm" className="min-h-[36px] text-xs sm:text-sm">
                              Gerenciar
                            </Button>
                          </Link>
                        ) : payment.productId ? (
                          <Link to={`/product/${payment.productId}`}>
                            <Button variant="ghost" size="sm" className="min-h-[36px] text-xs sm:text-sm">
                              Ver Produto
                            </Button>
                          </Link>
                        ) : null}
                    </td>
                    </motion.tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhum pagamento encontrado.
            </p>
            <Link to="/portal/produtos">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalPagamentos;
