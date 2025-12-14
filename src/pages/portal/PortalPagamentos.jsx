
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const payments = [
  { id: 'PAY123', product: 'AutoBot Pro (Vitalícia)', amount: 'R$ 297,00', date: '2025-10-22', status: 'Pago' },
  { id: 'PAY124', product: 'DataMaster (Vitalícia)', amount: 'R$ 197,00', date: '2025-10-21', status: 'Pago' },
  { id: 'PAY125', product: 'SalesBot Elite (Assinatura Mensal)', amount: 'R$ 49,90', date: '2025-10-01', status: 'Ativa', isSubscription: true },
];

const PortalPagamentos = () => {
  return (
    <>
      <Helmet>
        <title>Pagamentos - Portal LWDigitalForge</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Histórico de Pagamentos</h1>
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
                        {payment.isSubscription && (
                            <Button variant="outline" size="sm" className="min-h-[36px] text-xs sm:text-sm">Gerenciar</Button>
                        )}
                    </td>
                    </motion.tr>
                ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </>
  );
};

export default PortalPagamentos;
