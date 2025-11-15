
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, DollarSign, UserPlus, Zap, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/customSupabaseClient';

const StatCard = ({ title, value, icon: Icon, color, bgColor, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); // Limpa erros anteriores

        // As consultas são feitas em paralelo para mais performance
        const [salesResponse, usersResponse] = await Promise.all([
          supabase.from('sales').select('total_price'),
          supabase.from('users').select('id', { count: 'exact', head: true })
        ]);

        const { data: salesData, error: salesError } = salesResponse;
        const { count: usersCount, error: usersError } = usersResponse;

        // Se houver erros, registra no console, mas não impede a renderização
        if (salesError) console.error('Erro ao buscar dados de vendas:', salesError.message);
        if (usersError) console.error('Erro ao buscar contagem de usuários:', usersError.message);

        // Calcula os totais, tratando os casos onde não há dados
        const totalSales = salesData ? salesData.reduce((acc, sale) => acc + sale.total_price, 0) : 0;
        const totalUsers = usersCount || 0;

        const dashboardStats = [
          { title: 'Total de Acessos', value: 'N/A', icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { title: 'Total de Vendas', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales / 100), icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
          { title: 'Novos Cadastros', value: totalUsers, icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
          { title: 'Taxa de Conversão', value: 'N/A', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        ];
        
        setStats(dashboardStats);

      } catch (e) {
        console.error('Falha inesperada no dashboard:', e)
        setError('Ocorreu um erro inesperado ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-8"
      >
          Dashboard
      </motion.h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2"/>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
            Array.from({ length: 4 }).map((_, index) => <StatCard key={index} loading={true} />)
        ) : (
            stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <StatCard {...stat} />
            </motion.div>
          ))
        )}
      </div>

      {/* Seção de Gráficos e Atividades Recentes */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">Vendas nos Últimos 6 Meses</h3>
            <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Componente de Gráfico</p>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">Atividades Recentes</h3>
            <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Lista de Atividades Recentes</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
