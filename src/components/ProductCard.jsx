import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Consulte valores';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col cursor-pointer h-full"
    >
      {product.image_url && (
        <div className="flex justify-center mb-4">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
        {product.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300/80 text-sm mb-4 text-center leading-relaxed flex-grow line-clamp-3">
        {product.description || 'Descrição não disponível'}
      </p>

      <div className="text-center mb-6">
        <div className="space-y-1">
          {product.price_monthly && (
            <div className="text-lg font-bold text-teal-500 dark:text-teal-400">
              Mensal: {formatPrice(product.price_monthly)}
            </div>
          )}
          {product.price_annual && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Anual: <span className="font-semibold text-teal-500 dark:text-teal-400">{formatPrice(product.price_annual)}</span>
            </div>
          )}
          {product.price_lifetime && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Vitalício: <span className="font-semibold text-teal-500 dark:text-teal-400">{formatPrice(product.price_lifetime)}</span>
            </div>
          )}
          {!product.price_monthly && !product.price_annual && !product.price_lifetime && (
            <span className="text-sm text-gray-500 dark:text-gray-400">Consulte valores</span>
          )}
        </div>
      </div>

      <Button className="btn-secondary w-full py-3 font-semibold rounded-lg bg-transparent btn-pulse mt-auto pointer-events-none">
        Saiba Mais
      </Button>
    </div>
  );
};

export default ProductCard;

