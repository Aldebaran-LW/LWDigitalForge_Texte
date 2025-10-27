
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
      <div>
        <h1 className="text-2xl font-bold mb-6">Histórico de Pagamentos</h1>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4"></th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment, index) => (
                    <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 dark:border-gray-700"
                    >
                    <td className="py-4 px-4 font-medium">{payment.product}</td>
                    <td className="py-4 px-4">{payment.amount}</td>
                    <td className="py-4 px-4">{payment.date}</td>
                    <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'Pago' || payment.status === 'Ativa' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                            {payment.status}
                        </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                        {payment.isSubscription && (
                            <Button variant="outline" size="sm">Gerenciar</Button>
                        )}
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default PortalPagamentos;
