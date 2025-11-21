
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Erro ao buscar produtos:', error);
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
    <section className="py-20 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Soluções Criadas para a Sua Produtividade
          </h2>
          <p className="text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto">
            Descubra ferramentas poderosas que transformam a maneira como você trabalha
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p>Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col"
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
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mensal: <span className="font-bold text-teal-500 dark:text-teal-400">{formatPrice(product.price_monthly)}</span>
                      </div>
                    )}
                    {product.price_annual && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Anual: <span className="font-bold text-teal-500 dark:text-teal-400">{formatPrice(product.price_annual)}</span>
                      </div>
                    )}
                    {product.price_lifetime && (
                      <div className="text-lg font-bold text-teal-500 dark:text-teal-400">
                        Vitalício: {formatPrice(product.price_lifetime)}
                      </div>
                    )}
                    {!product.price_monthly && !product.price_annual && !product.price_lifetime && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Consulte valores</span>
                    )}
                  </div>
                </div>

                <Button asChild className="btn-secondary w-full py-3 font-semibold rounded-lg bg-transparent btn-pulse mt-auto">
                  <Link to={`/produtos/${product.id}`}>Saiba Mais</Link>
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
          className="text-center mt-16"
        >
          <Button asChild className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
            <Link to="/produtos">Ver Todos os Produtos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
