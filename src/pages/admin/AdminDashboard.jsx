
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, DollarSign, UserPlus, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total de Acessos', value: '1,257', icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Total de Vendas', value: 'R$ 8,920', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Novos Cadastros', value: '82', icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    { title: 'Taxa de Conversão', value: '6.52%', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - LWDigitalForge Admin</title>
      </Helmet>
      <div className="container mx-auto">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-8"
        >
            Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#111827]/80 p-6 rounded-lg shadow-md border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
