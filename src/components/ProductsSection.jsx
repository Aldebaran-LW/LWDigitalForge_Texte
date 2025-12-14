
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('registered_apps')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Erro ao buscar produtos:', error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('ProductsSection: Erro ao buscar produtos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Consulte valores';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Soluções Criadas para a Sua Produtividade
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto px-2">
            Descubra ferramentas poderosas que transformam a maneira como você trabalha
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 text-gray-500 dark:text-gray-400">
            <p className="text-sm sm:text-base">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col cursor-pointer"
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

                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 text-center">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300/80 text-xs sm:text-sm mb-3 sm:mb-4 text-center leading-relaxed flex-grow line-clamp-3">
                  {product.description || 'Descrição não disponível'}
                </p>

                <div className="text-center mb-4 sm:mb-6">
                  <div className="space-y-1">
                    {product.price_monthly && (
                      <div className="text-base sm:text-lg font-bold text-teal-500 dark:text-teal-400">
                        Mensal: {formatPrice(product.price_monthly)}
                      </div>
                    )}
                    {product.price_annual && (
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Anual: <span className="font-semibold text-teal-500 dark:text-teal-400">{formatPrice(product.price_annual)}</span>
                      </div>
                    )}
                    {product.price_lifetime && (
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Vitalício: <span className="font-semibold text-teal-500 dark:text-teal-400">{formatPrice(product.price_lifetime)}</span>
                      </div>
                    )}
                    {!product.price_monthly && !product.price_annual && !product.price_lifetime && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Consulte valores</span>
                    )}
                  </div>
                </div>

                <Button className="btn-secondary w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg bg-transparent btn-pulse mt-auto pointer-events-none min-h-[44px]">
                  Saiba Mais
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12 md:mt-16"
        >
          <Button asChild className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg pulse-glow min-h-[48px]">
            <Link to="/produtos">Ver Todos os Produtos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
