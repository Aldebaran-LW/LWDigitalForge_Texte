import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminAlertas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const severityStyles = useMemo(
    () => ({
      INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      WARN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      CRITICAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    }),
    []
  );

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!showResolved) {
        query = query.is('resolved_at', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os alertas do sistema.',
      });
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResolved]);

  const handleResolve = async (alertId) => {
    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id || null,
        })
        .eq('id', alertId);

      if (error) throw error;
      toast({ title: 'Resolvido', description: 'Alerta marcado como resolvido.' });
      fetchAlerts();
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível marcar o alerta como resolvido.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Alertas - LWDigitalForge Admin</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Alertas &amp; Erros
          </h1>
          <div className="flex gap-2">
            <Button
              variant={showResolved ? 'outline' : 'default'}
              className="min-h-[44px]"
              onClick={() => setShowResolved(false)}
            >
              Pendentes
            </Button>
            <Button
              variant={showResolved ? 'default' : 'outline'}
              className="min-h-[44px]"
              onClick={() => setShowResolved(true)}
            >
              Todos
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#111827]/80 rounded-lg border border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-gray-300">Nenhum alerta encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white dark:bg-[#111827]/80 rounded-lg border border-gray-200 dark:border-white/10 p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${severityStyles[alert.severity] || severityStyles.WARN}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(alert.created_at).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Fonte: {alert.source}
                      </span>
                    </div>
                    <h2 className="mt-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {alert.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {alert.message}
                    </p>
                    {alert.solution && (
                      <div className="mt-3 p-3 rounded-md bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                          Como resolver
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {alert.solution}
                        </p>
                      </div>
                    )}
                  </div>
                  {!alert.resolved_at && (
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        className="min-h-[44px]"
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marcar resolvido
                      </Button>
                    </div>
                  )}
                </div>
                {alert.resolved_at && (
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Resolvido em {new Date(alert.resolved_at).toLocaleString('pt-BR')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAlertas;

