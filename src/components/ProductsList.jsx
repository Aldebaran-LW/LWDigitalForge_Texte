import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Info } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const placeholderImage = "https://placehold.co/600x400/1e293b/white?text=Produto+Digital";

const ProductCard = ({ product, index }) => {
  // Lógica para exibir o menor preço disponível ("A partir de...")
  const prices = [product.price_monthly, product.price_annual, product.price_lifetime].filter(p => p);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  
  const formatPrice = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative mb-4">
          <img
            src={product.image_url || placeholderImage}
            alt={product.name}
            className="w-full h-56 object-cover rounded-lg"
          />
          {product.trial_period_days && product.trial_period_days > 0 && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Teste Grátis
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-[#F9FAFB] mb-2 truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-[#F9FAFB]/70 text-sm mb-4 leading-relaxed flex-grow line-clamp-3">
          {product.description || 'Explore os detalhes deste produto incrível.'}
        </p>

        <div className="text-left mb-4">
           {minPrice > 0 ? (
              <div>
                <span className="text-xs text-gray-500 uppercase">A partir de</span>
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                    {formatPrice(minPrice)}
                </div>
              </div>
           ) : (
               <span className="text-2xl font-bold text-green-500">Grátis</span>
           )}
        </div>
        
        <div className="mt-auto">
          <Button className="w-full btn-secondary py-3 font-semibold rounded-lg bg-transparent btn-pulse">
            <Info className="mr-2 h-4 w-4" /> Ver Detalhes
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('registered_apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 text-blue-500 animate-spin" /></div>;

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
