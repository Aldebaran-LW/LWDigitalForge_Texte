
import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const FailurePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Pagamento Recusado</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Houve um problema ao processar seu pagamento. Por favor, tente novamente ou contate o suporte.</p>
        <Link to="/cart">
          <button className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar para o Carrinho
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FailurePage;
