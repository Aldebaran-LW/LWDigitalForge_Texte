
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PortalPagamentos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  const formatCurrency = useMemo(
    () => (cents) => {
      if (cents === null || cents === undefined) return '—';
      return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
    },
    []
  );

  const formatStatus = (status) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Pago', kind: 'success' };
      case 'PENDING':
        return { label: 'Pendente', kind: 'warning' };
      case 'CANCELLED':
        return { label: 'Cancelado', kind: 'danger' };
      case 'REFUNDED':
        return { label: 'Reembolsado', kind: 'danger' };
      default:
        return { label: status || '—', kind: 'warning' };
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) {
        setPayments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_purchases')
          .select(
            `
            id,
            amount_paid,
            purchase_type,
            status,
            created_at,
            expires_at,
            payment_id,
            preference_id,
            registered_apps (name)
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPayments(data || []);
      } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar seu histórico de pagamentos.',
        });
        setPayments([]);
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
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Histórico de Pagamentos</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-xs sm:text-sm text-left">
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
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Nenhum pagamento encontrado ainda.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, index) => {
                      const productName = payment.registered_apps?.name || 'Produto';
                      const date = payment.created_at
                        ? new Date(payment.created_at).toLocaleDateString('pt-BR')
                        : '—';
                      const statusInfo = formatStatus(payment.status);
                      const isSubscription = payment.purchase_type === 'MONTHLY' || payment.purchase_type === 'ANNUAL';

                      return (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                        >
                          <td className="py-3 sm:py-4 px-3 sm:px-4 font-medium">
                            <div className="flex flex-col">
                              <span className="truncate max-w-[200px] sm:max-w-none">
                                {productName} ({payment.purchase_type})
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">
                                {date}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-nowrap">
                            {formatCurrency(payment.amount_paid)}
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell whitespace-nowrap">
                            {date}
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                                statusInfo.kind === 'success'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : statusInfo.kind === 'danger'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                            {isSubscription && (
                              <Button variant="outline" size="sm" className="min-h-[36px] text-xs sm:text-sm" disabled>
                                Gerenciar (em breve)
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalPagamentos;
