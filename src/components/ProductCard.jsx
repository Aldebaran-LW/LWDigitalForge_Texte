import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Consulte valores';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <motion.div
      onClick={() => navigate(`/product/${product.id}`)}
      whileHover={{ y: -12, scale: 1.03 }}
      className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col cursor-pointer shadow-lg hover:shadow-2xl group overflow-hidden h-full"
    >
      {/* Gradiente de fundo sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:to-teal-500/5 transition-all duration-300 rounded-2xl" />
      
      <div className="relative z-10">
        {product.image_url && (
          <div className="flex justify-center mb-6 overflow-hidden rounded-xl">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300/80 text-sm sm:text-base mb-6 text-center leading-relaxed flex-grow line-clamp-3">
          {product.description || 'Descrição não disponível'}
        </p>

        <div className="text-center mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          {product.price_monthly ? (
            <div className="text-2xl sm:text-3xl font-bold text-teal-500 dark:text-teal-400">
              {formatPrice(product.price_monthly)}
              <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">/mês</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">Consulte valores</span>
          )}
        </div>

        <Button className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg mt-auto min-h-[48px] group-hover:shadow-lg transition-all">
          Ver Detalhes →
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;








