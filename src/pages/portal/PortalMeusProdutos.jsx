
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ExternalLink, Download, Filter, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const PortalMeusProdutos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myProducts, setMyProducts] = useState([]);
  const [trials, setTrials] = useState([]);
  const [filter, setFilter] = useState('todos'); // todos, adquiridos, testando
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Buscar produtos comprados pelo usuário
        const { data: purchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select(`
            *,
            registered_apps:app_id (*)
          `)
          .eq('user_id', user.id);

        if (purchasesError) {
          console.error('Erro ao buscar compras:', purchasesError);
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível carregar seus produtos.',
          });
          setMyProducts([]);
        } else {
          // Mapear compras para produtos
          const products = (purchases || [])
            .map(purchase => purchase.registered_apps)
            .filter(Boolean);
          setMyProducts(products);
        }

        // Buscar testes ativos
        const { data: trialsData, error: trialsError } = await supabase
          .from('user_trials')
          .select(`
            *,
            registered_apps:app_id (*)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (!trialsError && trialsData) {
          setTrials(trialsData.map(t => t.registered_apps).filter(Boolean));
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setMyProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [user, toast]);

  const handleAccess = (product) => {
    if (product.vercel_deployment_url) {
      window.open(product.vercel_deployment_url, '_blank');
    } else if (product.github_repo_url) {
      window.open(product.github_repo_url, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL de acesso não disponível para este produto.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meus Produtos</h1>
          <p className="text-gray-600 dark:text-gray-400">Produtos que você adquiriu ou está testando</p>
        </div>

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'todos' ? 'default' : 'outline'}
              onClick={() => setFilter('todos')}
              className="transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              Todos ({myProducts.length + trials.length})
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'adquiridos' ? 'default' : 'outline'}
              onClick={() => setFilter('adquiridos')}
              className="transition-all"
            >
              Adquiridos ({myProducts.length})
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'testando' ? 'default' : 'outline'}
              onClick={() => setFilter('testando')}
              className="transition-all"
            >
              Testando ({trials.length})
            </Button>
          </motion.div>
        </motion.div>

        {/* Lista de Produtos */}
        <div>
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (() => {
          let displayProducts = [];
          if (filter === 'todos') {
            displayProducts = [...myProducts, ...trials];
          } else if (filter === 'adquiridos') {
            displayProducts = myProducts;
          } else if (filter === 'testando') {
            displayProducts = trials;
          }

          return displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer group"
              >
                <div>
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-lg mb-3 sm:mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                    {product.description || 'Sem descrição'}
                  </p>
                </div>
                <div className="space-y-2">
                  {product.vercel_deployment_url && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 min-h-[44px] text-sm sm:text-base shadow-lg shadow-blue-500/25"
                        onClick={() => handleAccess(product)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Acessar Aplicação</span>
                        <span className="sm:hidden">Acessar</span>
                      </Button>
                    </motion.div>
                  )}
                  {product.github_repo_url && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline"
                        className="w-full min-h-[44px] text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => window.open(product.github_repo_url, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Ver Repositório</span>
                        <span className="sm:hidden">Repositório</span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'adquiridos' && 'Você ainda não adquiriu nenhum produto.'}
                {filter === 'testando' && 'Você não possui produtos em teste no momento.'}
                {filter === 'todos' && 'Você ainda não possui produtos.'}
              </p>
              <Link to="/portal/produtos">
                <Button className="mt-4">
                  Explorar Produtos
                </Button>
              </Link>
            </motion.div>
          );
        })()}
        </div>
      </div>
    </>
  );
};

export default PortalMeusProdutos;
