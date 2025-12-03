
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, ExternalLink, ShoppingCart, Clock } from 'lucide-react';

const PortalTestes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTrials = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_product_access')
          .select(`
            *,
            registered_apps:product_id (
              id,
              name,
              description,
              image_url,
              vercel_deployment_url,
              github_repo_url,
              price_monthly,
              price_annual,
              price_lifetime
            )
          `)
          .eq('user_id', user.id)
          .eq('is_trial', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setTrials(data || []);
      } catch (error) {
        console.error('Erro ao buscar testes:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar seus testes.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTrials();
  }, [user, toast]);

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return 'Expirado';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return 'Expirado';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} e ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  };

  const handleAccessProduct = (trial) => {
    const product = trial.registered_apps;
    if (product?.vercel_deployment_url) {
      window.open(product.vercel_deployment_url, '_blank');
    } else if (product?.github_repo_url) {
      window.open(product.github_repo_url, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL de acesso não disponível para este produto.',
      });
    }
  };

  const formatPrice = (cents) => {
    if (!cents) return 'Grátis';
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 text-blue-500 dark:text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meus Testes - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-6">Produtos em Teste</h1>
        
        {trials.length > 0 ? (
          <div className="space-y-4">
            {trials.map((trial, index) => {
              const product = trial.registered_apps;
              const isActive = trial.status === 'active';
              const timeLeft = calculateTimeLeft(trial.expires_at);
              const isExpired = timeLeft === 'Expirado';

              return (
                <motion.div
                  key={trial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white dark:bg-[#111827] p-6 rounded-xl border-2 ${
                    isExpired ? 'border-red-300 dark:border-red-700' : 'border-green-300 dark:border-green-700'
                  } shadow-md`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {product?.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product?.name || trial.product_name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product?.description}</p>
                        </div>
                        {isExpired ? (
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-semibold">
                            Expirado
                          </span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                            Ativo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>Tempo restante: <strong className={isExpired ? 'text-red-600' : 'text-green-600'}>{timeLeft}</strong></span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {!isExpired && (
                          <Button 
                            onClick={() => handleAccessProduct(trial)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Acessar Produto
                          </Button>
                        )}
                        
                        <Link to={`/product/${product?.id}`}>
                          <Button variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isExpired ? 'Comprar Agora' : 'Ver Planos'}
                          </Button>
                        </Link>
                      </div>

                      {!isExpired && product && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preços disponíveis:</p>
                          <div className="flex flex-wrap gap-2 text-sm">
                            {product.price_monthly && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Mensal: {formatPrice(product.price_monthly)}
                              </span>
                            )}
                            {product.price_annual && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Anual: {formatPrice(product.price_annual)}
                              </span>
                            )}
                            {product.price_lifetime && (
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-semibold">
                                Vitalício: {formatPrice(product.price_lifetime)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Você não possui produtos em período de teste.</p>
            <Link to="/produtos">
              <Button>
                Explorar Produtos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalTestes;
