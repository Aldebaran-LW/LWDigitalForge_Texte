
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Info } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWEyMDNkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzRjYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxXPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Consulte valores';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  const getDisplayPrice = () => {
    if (product.price_lifetime) return formatPrice(product.price_lifetime);
    if (product.price_annual) return formatPrice(product.price_annual);
    if (product.price_monthly) return formatPrice(product.price_monthly);
    return 'Consulte valores';
  };

  const handleCardClick = useCallback(() => {
    navigate(`/produtos/${product.id}`);
  }, [product.id, navigate]);
  
  const actionText = "Saiba Mais";
  const ActionIcon = Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="flex flex-col h-full">
        <div className="relative mb-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-56 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
          ) : (
            <img
              src={placeholderImage}
              alt={product.name}
              className="w-full h-56 object-cover rounded-lg"
            />
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-[#F9FAFB] mb-2 truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-[#F9FAFB]/70 text-sm mb-4 leading-relaxed flex-grow line-clamp-3">
          {product.description || 'Explore os detalhes deste produto incrível.'}
        </p>

        <div className="text-left mb-4">
          <div className="space-y-1">
            {product.price_lifetime && (
              <div>
                <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {formatPrice(product.price_lifetime)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Vitalício</span>
              </div>
            )}
            {!product.price_lifetime && product.price_annual && (
              <div>
                <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {formatPrice(product.price_annual)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Anual</span>
              </div>
            )}
            {!product.price_lifetime && !product.price_annual && product.price_monthly && (
              <div>
                <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {formatPrice(product.price_monthly)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Mensal</span>
              </div>
            )}
            {!product.price_lifetime && !product.price_annual && !product.price_monthly && (
              <span className="text-lg text-gray-500 dark:text-gray-400">Consulte valores</span>
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          <Button className="w-full btn-secondary py-3 font-semibold rounded-lg bg-transparent btn-pulse pointer-events-none">
            <ActionIcon className="mr-2 h-4 w-4" /> {actionText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('registered_apps')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Erro ao buscar produtos:', supabaseError);
          throw new Error(supabaseError.message);
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError(err.message || 'Falha ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-blue-500 dark:text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>Erro ao carregar produtos: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
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
