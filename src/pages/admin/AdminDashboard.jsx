
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, DollarSign, UserPlus, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

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

        // Buscar total de vendas e receita (a partir de user_purchases)
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('user_purchases')
          .select('amount_paid')
          .eq('status', 'APPROVED');

        if (purchasesError) {
          console.error('Erro ao buscar compras:', purchasesError);
        }

        const totalRevenue = purchasesData && Array.isArray(purchasesData)
          ? purchasesData.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
          : 0;

        // Buscar total de produtos
        const { count: totalProducts, error: productsError } = await supabase
          .from('registered_apps')
          .select('*', { count: 'exact', head: true });

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
        }

        setStats([
          { title: 'Total de Acessos', value: '0', icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { title: 'Total de Vendas', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
          { title: 'Total de Usuários', value: formatNumber(totalUsers || 0), icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
          { title: 'Total de Produtos', value: formatNumber(totalProducts || 0), icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
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
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8"
        >
            Dashboard
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-[#111827]/80 p-4 sm:p-5 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white truncate">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} ${stat.color} flex-shrink-0 ml-2 sm:ml-3`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
