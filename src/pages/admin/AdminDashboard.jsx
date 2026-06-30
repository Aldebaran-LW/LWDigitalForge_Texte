
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, DollarSign, UserPlus, Zap, Loader2, CreditCard, TestTube2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { AdminCheckSubscription } from '@/components/admin/AdminCheckSubscription';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total de Acessos', value: '0', icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Total de Vendas', value: 'R$ 0,00', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Total de Usuários', value: '0', icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    { title: 'Total de Produtos', value: '0', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Formatar valores
        const formatCurrency = (cents) => {
          if (!cents || cents === 0) return 'R$ 0,00';
          return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
        };

        const formatNumber = (num) => {
          return num?.toLocaleString('pt-BR') || '0';
        };

        // Buscar total de usuários
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Erro ao buscar usuários:', usersError);
        }

        // Buscar total de vendas e receita
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('total_price');

        if (salesError) {
          console.error('Erro ao buscar vendas:', salesError);
        }

        const totalRevenue = salesData && Array.isArray(salesData) 
          ? salesData.reduce((sum, sale) => sum + (sale.total_price || 0), 0) 
          : 0;

        // Buscar total de produtos
        const { count: totalProducts, error: productsError } = await supabase
          .from('registered_apps')
          .select('*', { count: 'exact', head: true });

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
        }

        // Buscar assinaturas ativas (MONTHLY e ANNUAL aprovadas e não expiradas)
        const now = new Date().toISOString();
        const { data: activePurchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select('id')
          .eq('status', 'APPROVED')
          .in('purchase_type', ['MONTHLY', 'ANNUAL'])
          .gt('expires_at', now);

        if (purchasesError) {
          console.error('Erro ao buscar assinaturas:', purchasesError);
        }

        // Buscar trials ativos
        const { data: activeTrials, error: trialsError } = await supabase
          .from('user_trials')
          .select('id')
          .eq('is_active', true)
          .gt('expires_at', now);

        if (trialsError) {
          console.error('Erro ao buscar trials:', trialsError);
        }

        setStats([
          { title: 'Total de Acessos', value: '0', icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { title: 'Total de Vendas', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
          { title: 'Total de Usuários', value: formatNumber(totalUsers || 0), icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
          { title: 'Total de Produtos', value: formatNumber(totalProducts || 0), icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
          { title: 'Assinaturas Ativas', value: formatNumber(activePurchases?.length || 0), icon: CreditCard, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
          { title: 'Trials Ativos', value: formatNumber(activeTrials?.length || 0), icon: TestTube2, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
        ]);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard - LWDigitalForge Admin</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visão geral do sistema e estatísticas
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 blur-[60px] group-hover:bg-amber-500/10 transition-colors" />
                <div className="relative flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl border flex-shrink-0 ml-3 ${stat.bgColor} ${stat.color.replace('text-', 'border-').replace('-500', '-500/20')}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Componente para verificar assinatura de usuários */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <AdminCheckSubscription />
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;
