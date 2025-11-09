
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

const PendingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        <AlertCircle className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Pagamento Pendente</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Seu pagamento está sendo processado. Você receberá uma notificação assim que for concluído.</p>
        <Link to="/">
          <button className="btn-secondary inline-flex items-center gap-2">
            Voltar à Página Inicial <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PendingPage;
