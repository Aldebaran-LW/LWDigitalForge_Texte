
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart'; // Adjusted import path

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart only when the success page is loaded
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Pagamento Aprovado!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Sua compra foi concluída com sucesso. Agradecemos a sua preferência!</p>
        <Link to="/">
          <button className="btn-primary inline-flex items-center gap-2">
            Voltar à Página Inicial <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
