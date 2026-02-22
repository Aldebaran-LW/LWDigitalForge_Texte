
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, TestTube2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { startProductTrial } from '@/utils/trialHelpers';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingTrials, setStartingTrials] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('registered_apps')
          .select('*')
          .eq('is_active', true)
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

  const handleStartTrial = async (product) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login ou cadastre-se para iniciar o teste grátis.",
      });
      navigate('/login');
      return;
    }

    setStartingTrials(prev => ({ ...prev, [product.id]: true }));

    try {
      const result = await startProductTrial(
        user.id,
        product.id,
        product.name,
        product.trial_period_days || 30,
        user.email
      );

      if (result.success) {
        toast({
          title: "Teste Iniciado!",
          description: `Você tem ${product.trial_period_days} dias para testar ${product.name}.`,
        });
        if (result.redirectUrl) {
          setTimeout(() => {
            window.open(result.redirectUrl, '_blank');
          }, 1500);
        }
      } else {
        if (result.redirectUrl) {
          toast({
            title: "Você já tem acesso!",
            description: "Redirecionando para o aplicativo...",
          });
          setTimeout(() => {
            window.open(result.redirectUrl, '_blank');
          }, 1000);
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: result.message || "Não foi possível iniciar o teste.",
          });
        }
      }
    } catch (error) {
      console.error('Erro ao iniciar teste:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o teste.",
      });
    } finally {
      setStartingTrials(prev => ({ ...prev, [product.id]: false }));
    }
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Nossas Aplicações Web
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto px-2 font-medium">
            Aplicações web desenvolvidas para empresas que buscam soluções personalizadas e resultados reais
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col cursor-pointer shadow-lg hover:shadow-2xl group overflow-hidden"
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

                  <div className="flex flex-col gap-2 mt-auto">
                    {product.trial_period_days && product.trial_period_days > 0 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTrial(product);
                        }}
                        className="btn-secondary w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg bg-transparent border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white min-h-[44px]"
                        disabled={startingTrials[product.id]}
                      >
                        {startingTrials[product.id] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando...
                          </>
                        ) : (
                          <>
                            <TestTube2 className="mr-2 h-4 w-4" />
                            Testar Grátis
                          </>
                        )}
                      </Button>
                    )}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg min-h-[48px] group-hover:shadow-lg transition-all"
                    >
                      Ver Detalhes →
                    </Button>
                  </div>
                </div>
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
