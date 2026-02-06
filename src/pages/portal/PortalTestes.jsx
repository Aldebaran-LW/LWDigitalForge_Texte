
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, ExternalLink, ShoppingCart, Clock } from 'lucide-react';

const PortalTestes = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para atualizar testes expirados
  const updateExpiredTrials = async () => {
    if (!user) return;
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('user_trials')
      .update({ is_active: false })
      .lt('expires_at', now)
      .eq('is_active', true)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Erro ao atualizar testes expirados:', error);
    }
  };

  // Função para buscar testes ativos (memoizada para evitar recriações desnecessárias)
  const fetchActiveTrials = useCallback(async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Atualizar testes expirados primeiro
        await updateExpiredTrials();
        
        // Buscar apenas testes realmente ativos (não expirados)
        const now = new Date().toISOString();
        const { data: trialsData, error: trialsError } = await supabase
          .from('user_trials')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('expires_at', now) // Apenas testes não expirados
          .order('started_at', { ascending: false });

        if (trialsError) {
          console.error('Erro detalhado ao buscar testes:', {
            error: trialsError,
            message: trialsError.message,
            code: trialsError.code,
            details: trialsError.details,
            hint: trialsError.hint,
            userId: user.id
          });
          throw trialsError;
        }

        if (!trialsData || trialsData.length === 0) {
          setTrials([]);
          return;
        }

        // Buscar informações dos produtos associados
        const appIds = [...new Set(trialsData.map(trial => trial.app_id))];
        const { data: productsData, error: productsError } = await supabase
          .from('registered_apps')
          .select('id, name, description, image_url, vercel_deployment_url, github_repo_url, price_monthly, price_annual, price_lifetime')
          .in('id', appIds);

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
          throw productsError;
        }

        // Criar mapa de produtos para facilitar o join
        const productsMap = {};
        if (productsData) {
          productsData.forEach(product => {
            productsMap[product.id] = product;
          });
        }

        // Combinar testes com informações dos produtos
        const trialsWithProducts = trialsData.map(trial => ({
          ...trial,
          registered_apps: productsMap[trial.app_id] || null
        })).filter(trial => trial.registered_apps !== null); // Remover testes sem produto encontrado

        console.log('Testes encontrados:', trialsWithProducts.length, trialsWithProducts);
        setTrials(trialsWithProducts);
      } catch (error) {
        console.error('Erro ao buscar testes:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: error.message || 'Não foi possível carregar seus testes.',
        });
        // Mesmo com erro, definir array vazio para não ficar em loading infinito
        setTrials([]);
      } finally {
        setLoading(false);
      }
  }, [user, toast]);

  useEffect(() => {
    fetchActiveTrials();

    // Configurar listener do Supabase Realtime para atualizar automaticamente quando novos testes são criados/atualizados
    if (!user) return;

    const channel = supabase
      .channel('user_trials_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_trials',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Mudança detectada em user_trials:', payload);
          // Recarregar testes quando houver mudanças
          fetchActiveTrials();
        }
      )
      .subscribe();

    // Atualizar quando a página recebe foco (útil quando usuário volta de outra aba)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchActiveTrials();
      }
    };

    const handleFocus = () => {
      fetchActiveTrials();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup: remover subscription e listeners quando componente desmontar ou usuário mudar
    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, toast, fetchActiveTrials]);

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

  const handleAccessProduct = async (trial) => {
    const product = trial.registered_apps;
    
    // Validar se URL existe
    if (!product?.vercel_deployment_url) {
      if (product?.github_repo_url && role === 'ADMIN') {
        // Apenas admins podem acessar repositório
        window.open(product.github_repo_url, '_blank');
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL de acesso não configurada para este produto. Entre em contato com o suporte.',
      });
      return;
    }

    // Validar formato da URL
    try {
      new URL(product.vercel_deployment_url);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL de acesso inválida. Entre em contato com o suporte.',
      });
      return;
    }

    // Se o produto está na lista de testes, o usuário já tem acesso validado
    // Obter sessão atual do Supabase para passar token de autenticação
    const { data: { session } } = await supabase.auth.getSession();
    
    // Construir URL com informações de autenticação
    // A aplicação vai redirecionar para login normalmente
    let appUrl = product.vercel_deployment_url;
    
    if (session?.access_token) {
      // Passar informações via hash
      const authData = {
        access_token: session.access_token,
        user_id: user.id,
        product_id: product.id,
        timestamp: Date.now(),
        from: 'portal' // Indica que veio do portal (já verificado)
      };
      
      const encodedAuth = btoa(JSON.stringify(authData));
      appUrl = `${appUrl}#auth=${encodedAuth}`;
    }
    
    // Abrir app em nova aba (vai redirecionar para login)
    const newWindow = window.open(appUrl, '_blank');
    
    // Verificar se popup foi bloqueado
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast({
        variant: 'destructive',
        title: 'Popup Bloqueado',
        description: 'Por favor, permita popups para este site e tente novamente.',
      });
    }
  };

  const formatPrice = (cents) => {
    if (!cents) return 'Grátis';
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meus Testes - Portal LWDigitalForge</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Produtos em Teste</h1>
        
        {trials.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {trials.map((trial, index) => {
              const product = trial.registered_apps;
              const isActive = trial.is_active === true;
              const timeLeft = calculateTimeLeft(trial.expires_at);
              const isExpired = timeLeft === 'Expirado' || !isActive;

              return (
                <motion.div
                  key={trial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white dark:bg-[#111827] p-4 sm:p-5 md:p-6 rounded-xl border-2 ${
                    isExpired ? 'border-red-300 dark:border-red-700' : 'border-green-300 dark:border-green-700'
                  } shadow-md`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
                    {product?.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{product?.name || 'Produto'}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product?.description}</p>
                        </div>
                        {isExpired ? (
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
                            Expirado
                          </span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
                            Ativo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Tempo restante: <strong className={isExpired ? 'text-red-600' : 'text-green-600'}>{timeLeft}</strong></span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {!isExpired && (
                          <Button 
                            onClick={() => handleAccessProduct(trial)}
                            className="bg-blue-600 hover:bg-blue-700 min-h-[44px] text-sm sm:text-base w-full sm:w-auto"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Acessar Produto</span>
                            <span className="sm:hidden">Acessar</span>
                          </Button>
                        )}
                        
                        <Link to={`/product/${product?.id}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isExpired ? 'Comprar Agora' : 'Ver Planos'}
                          </Button>
                        </Link>
                      </div>

                      {!isExpired && product && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preços disponíveis:</p>
                          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                            {product.price_monthly && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                                Mensal: {formatPrice(product.price_monthly)}
                              </span>
                            )}
                            {product.price_annual && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                                Anual: {formatPrice(product.price_annual)}
                              </span>
                            )}
                            {product.price_lifetime && (
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded font-semibold whitespace-nowrap">
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
          <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 px-4">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Você não possui produtos em período de teste.</p>
            <Link to="/portal/produtos">
              <Button className="min-h-[44px] text-sm sm:text-base">
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
