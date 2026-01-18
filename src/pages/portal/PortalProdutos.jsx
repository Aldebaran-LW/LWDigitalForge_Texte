
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  ExternalLink,
  Loader2,
  X,
  PlayCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { checkUserProductAccess, startProductTrial } from '@/utils/trialHelpers';

const PortalProdutos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('name'); // name, price_asc, price_desc
  const [productAccessStates, setProductAccessStates] = useState({}); // { productId: { hasAccess, accessType, loading } }
  const [startingTrials, setStartingTrials] = useState({}); // { productId: boolean }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('registered_apps')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (error) throw error;

        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os produtos.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Verificar acesso de cada produto quando produtos ou usuário mudarem
  useEffect(() => {
    const checkProductAccess = async () => {
      if (!user || products.length === 0) {
        return;
      }

      const states = {};
      for (const product of products) {
        try {
          const { hasAccess, accessType } = await checkUserProductAccess(user.id, product.id, user.email);
          states[product.id] = {
            hasAccess,
            accessType,
            loading: false
          };
        } catch (error) {
          console.error(`Erro ao verificar acesso para produto ${product.id}:`, error);
          states[product.id] = {
            hasAccess: false,
            accessType: null,
            loading: false
          };
        }
      }
      setProductAccessStates(states);
    };

    checkProductAccess();
  }, [user, products]);

  useEffect(() => {
    let filtered = [...products];

    // Busca por nome ou descrição
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de preço
    if (priceFilter === 'free') {
      filtered = filtered.filter(p => !p.price_monthly && !p.price_annual && !p.price_lifetime);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(p => p.price_monthly || p.price_annual || p.price_lifetime);
    }

    // Ordenação
    if (sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => {
        const priceA = Math.min(
          a.price_monthly || Infinity,
          a.price_annual || Infinity,
          a.price_lifetime || Infinity
        );
        const priceB = Math.min(
          b.price_monthly || Infinity,
          b.price_annual || Infinity,
          b.price_lifetime || Infinity
        );
        return priceA - priceB;
      });
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => {
        const priceA = Math.min(
          a.price_monthly || Infinity,
          a.price_annual || Infinity,
          a.price_lifetime || Infinity
        );
        const priceB = Math.min(
          b.price_monthly || Infinity,
          b.price_annual || Infinity,
          b.price_lifetime || Infinity
        );
        return priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter, sortBy]);

  const formatPrice = (cents) => {
    if (!cents) return 'Grátis';
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  const getMinPrice = (product) => {
    const prices = [product.price_monthly, product.price_annual, product.price_lifetime].filter(Boolean);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const handleStartTrial = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Precisa estar logado para testar.',
      });
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
        // Atualizar estado do produto
        setProductAccessStates(prev => ({
          ...prev,
          [product.id]: {
            hasAccess: true,
            accessType: 'trial',
            loading: false
          }
        }));

        toast({
          title: "Trial Ativado!",
          description: result.message || `Você tem ${product.trial_period_days || 30} dias para testar ${product.name}.`,
        });

        // Opcional: Redirecionar para o app após 2 segundos
        if (result.redirectUrl) {
          setTimeout(() => {
            window.open(result.redirectUrl, '_blank');
          }, 2000);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Não foi possível ativar",
          description: result.message || "Erro ao iniciar o teste.",
        });
      }
    } catch (error) {
      console.error('Erro ao iniciar trial:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível iniciar o teste.",
      });
    } finally {
      setStartingTrials(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Todos os Produtos - Portal LWDigitalForge</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Todos os Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore nossa coleção completa de soluções
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={priceFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={priceFilter === 'free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter('free')}
                >
                  Grátis
                </Button>
                <Button
                  variant={priceFilter === 'paid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter('paid')}
                >
                  Pagos
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => {
              const minPrice = getMinPrice(product);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                    {product.description || 'Sem descrição'}
                  </p>

                  {minPrice && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        A partir de {formatPrice(minPrice)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </motion.div>
                      </Link>
                      {product.vercel_deployment_url && (() => {
                        const productState = productAccessStates[product.id];
                        const hasAccess = productState?.hasAccess || false;
                        
                        if (hasAccess) {
                          return (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="outline"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  if (!user) {
                                    toast({
                                      variant: 'destructive',
                                      title: 'Erro',
                                      description: 'Você precisa estar logado para acessar esta aplicação.',
                                    });
                                    return;
                                  }

                                  // Importar dinamicamente para evitar dependência circular
                                  const { checkAccessViaN8N, createAccessDeniedNotification } = await import('@/lib/n8nAccessCheck');
                                  
                                  // Verificar acesso via n8n antes de abrir aplicação
                                  try {
                                    const accessCheck = await checkAccessViaN8N(user.id, product.id);
                                    
                                    if (!accessCheck.hasAccess) {
                                      // Criar notificação no banco de dados
                                      await createAccessDeniedNotification(
                                        user.id,
                                        accessCheck.reason || 'Acesso negado',
                                        product.name
                                      );

                                      // Mostrar toast e redirecionar
                                      toast({
                                        variant: 'destructive',
                                        title: 'Acesso Negado',
                                        description: accessCheck.message || 'Você não tem acesso a este produto.',
                                      });

                                      // Redirecionar conforme resposta do n8n
                                      if (accessCheck.redirectUrl) {
                                        window.location.href = accessCheck.redirectUrl;
                                      }
                                      return;
                                    }

                                    // Se tem acesso, salvar productId no sessionStorage e abrir aplicação
                                    if (typeof window !== 'undefined') {
                                      sessionStorage.setItem('app_product_id', product.id);
                                      sessionStorage.setItem('app_product_name', product.name);
                                    }
                                    
                                    // Abrir app com URL limpa (sem parâmetros)
                                    window.open(product.vercel_deployment_url, '_blank');
                                  } catch (error) {
                                    console.error('Erro ao verificar acesso:', error);
                                    toast({
                                      variant: 'destructive',
                                      title: 'Erro',
                                      description: 'Erro ao verificar acesso. Tente novamente.',
                                    });
                                  }
                                }}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    {user && (() => {
                      const productState = productAccessStates[product.id];
                      const hasAccess = productState?.hasAccess || false;
                      const isTrial = productState?.accessType === 'trial';
                      const isLoading = startingTrials[product.id] || false;
                      const canStartTrial = !hasAccess && !isLoading;

                      if (hasAccess && isTrial) {
                        return (
                          <Button disabled className="w-full bg-green-600 hover:bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Trial Ativo
                          </Button>
                        );
                      }

                      if (canStartTrial) {
                        return (
                          <Button
                            onClick={(e) => handleStartTrial(product, e)}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Ativando...
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Testar Grátis ({product.trial_period_days || 30} dias)
                              </>
                            )}
                          </Button>
                        );
                      }

                      return null;
                    })()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPriceFilter('all');
                setSortBy('name');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalProdutos;

