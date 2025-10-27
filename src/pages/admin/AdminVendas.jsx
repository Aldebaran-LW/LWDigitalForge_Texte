
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const sales = [
  { id: 'TXN123', customer: 'user1@example.com', product: 'AutoBot Pro', amount: 'R$ 297,00', date: '2025-10-22' },
  { id: 'TXN124', customer: 'user2@example.com', product: 'DataMaster', amount: 'R$ 197,00', date: '2025-10-21' },
  { id: 'TXN125', customer: 'user3@example.com', product: 'SalesBot Elite', amount: 'R$ 497,00', date: '2025-10-20' },
  { id: 'TXN126', customer: 'user4@example.com', product: 'FinanceTracker', amount: 'R$ 147,00', date: '2025-10-19' },
];

const AdminVendas = () => {
  return (
    <>
      <Helmet>
        <title>Histórico de Vendas - LWDigitalForge Admin</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Vendas</h1>
        </div>

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
                <th scope="col" className="px-6 py-3">ID do Cliente</th>
                <th scope="col" className="px-6 py-3">Produto Adquirido</th>
                <th scope="col" className="px-6 py-3">Valor</th>
                <th scope="col" className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <motion.tr 
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {sale.id}
                  </th>
                  <td className="px-6 py-4">{sale.customer}</td>
                  <td className="px-6 py-4">{sale.product}</td>
                  <td className="px-6 py-4">{sale.amount}</td>
                  <td className="px-6 py-4">{sale.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </>
  );
};

export default AdminVendas;
