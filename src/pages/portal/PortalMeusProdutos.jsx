
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ExternalLink, Download, Filter, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserProductAccess } from '@/utils/trialHelpers';
import { createAccessDeniedNotification } from '@/lib/accessNotifications';

const PortalMeusProdutos = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [trials, setTrials] = useState([]);
  const [filter, setFilter] = useState('todos'); // todos, adquiridos, testando
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(false);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Buscar produtos comprados pelo usuário (apenas aprovados e não expirados)
        // Inclui: acesso vitalício do admin + compras via pagamento (mensal, anual, vitalício)
        const now = new Date().toISOString();
        const { data: purchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select(`
            *,
            registered_apps:app_id (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'APPROVED');
        
        // Filtrar compras não expiradas (expires_at IS NULL ou expires_at > now)
        const validPurchases = purchases?.filter(purchase => 
          !purchase.expires_at || new Date(purchase.expires_at) > new Date(now)
        ) || [];

        if (purchasesError) {
          console.error('Erro ao buscar compras:', purchasesError);
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível carregar seus produtos.',
          });
          setMyProducts([]);
        } else {
          // Mapear compras válidas para produtos
          const products = validPurchases
            .map(purchase => purchase.registered_apps)
            .filter(Boolean);
          
          // Remover duplicados baseado no ID do produto
          // Isso evita mostrar o mesmo produto múltiplas vezes quando há múltiplas compras
          const uniqueProducts = Array.from(
            new Map(products.map(product => [product.id, product])).values()
          );
          
          setMyProducts(uniqueProducts);
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

  const handleAccess = async (product) => {
    // Validar se URL existe
    if (!product.vercel_deployment_url) {
      if (product.github_repo_url && role === 'ADMIN') {
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

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para acessar esta aplicação.',
      });
      navigate('/login');
      return;
    }

    // Verificar acesso direto no Supabase antes de abrir aplicação
    setCheckingAccess(true);
    try {
      const accessCheck = await checkUserProductAccess(user.id, product.id, user.email);
      
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

        // Redirecionar para página de produtos conforme especificado
          navigate('/portal/produtos');
        return;
      }

      // Se tem acesso, preparar informações para passar para a aplicação
      // Obter sessão atual do Supabase para passar token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      
      // Construir URL com informações de autenticação (via hash para segurança)
      // Quando vem do portal, já foi verificado, então pode ir direto para a aplicação
      let appUrl = product.vercel_deployment_url;
      
      // Determinar rota padrão da aplicação baseado no slug
      // Ex: JornadaPro -> /apontamentos, StockForge -> página inicial
      let defaultRoute = '';
      if (product.slug === 'jornadapro') {
        defaultRoute = '/apontamentos';
      } else if (product.slug === 'stockforge') {
        defaultRoute = '/'; // Página inicial
      }
      
      // Adicionar rota padrão se especificada
      if (defaultRoute && !appUrl.endsWith('/')) {
        appUrl = `${appUrl}${defaultRoute}`;
      } else if (defaultRoute && appUrl.endsWith('/')) {
        appUrl = `${appUrl.slice(0, -1)}${defaultRoute}`;
      }
      
      if (session?.access_token) {
        // Passar informações via hash (não aparece no servidor, mais seguro)
        // A aplicação deve ler isso e usar para autenticar
        // O parâmetro 'from=portal' indica que veio do portal (já verificado)
        const authData = {
          access_token: session.access_token,
          user_id: user.id,
          product_id: product.id,
          timestamp: Date.now(),
          from: 'portal' // Indica que veio do portal (já verificado)
        };
        
        // Codificar em base64 para passar via hash
        const encodedAuth = btoa(JSON.stringify(authData));
        appUrl = `${appUrl}#auth=${encodedAuth}`;
      }
      
      // Abrir app com URL contendo informações de autenticação
      // Como já foi verificado no portal, vai direto para a aplicação
      const newWindow = window.open(appUrl, '_blank');
      
      // Verificar se popup foi bloqueado
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        toast({
          variant: 'destructive',
          title: 'Popup Bloqueado',
          description: 'Por favor, permita popups para este site e tente novamente.',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao verificar acesso. Tente novamente.',
      });
    } finally {
      setCheckingAccess(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meus Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Produtos que você adquiriu ou está testando
          </p>
        </div>

        {/* Filtros em Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={filter === 'todos' ? 'default' : 'outline'}
                onClick={() => setFilter('todos')}
                className="transition-all"
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos ({myProducts.length + trials.length})
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={filter === 'adquiridos' ? 'default' : 'outline'}
                onClick={() => setFilter('adquiridos')}
                className="transition-all"
              >
                Adquiridos ({myProducts.length})
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={filter === 'testando' ? 'default' : 'outline'}
                onClick={() => setFilter('testando')}
                className="transition-all"
              >
                Testando ({trials.length})
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {(() => {
            let count = 0;
            if (filter === 'todos') count = myProducts.length + trials.length;
            else if (filter === 'adquiridos') count = myProducts.length;
            else if (filter === 'testando') count = trials.length;
            return `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
          })()}
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product, index) => (
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
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                  {product.description || 'Sem descrição'}
                </p>

                <div className="flex gap-2 mt-auto">
                  {product.vercel_deployment_url && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25"
                        onClick={() => handleAccess(product)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Acessar Aplicação
                      </Button>
                    </motion.div>
                  )}
                  {/* Mostrar repositório apenas para admins */}
                  {product.github_repo_url && role === 'ADMIN' && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        onClick={() => window.open(product.github_repo_url, '_blank')}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'adquiridos' && 'Você ainda não adquiriu nenhum produto.'}
                {filter === 'testando' && 'Você não possui produtos em teste no momento.'}
                {filter === 'todos' && 'Você ainda não possui produtos.'}
              </p>
              <Link to="/portal/produtos">
                <Button variant="outline">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          );
        })()}
        </div>
      </div>
    </>
  );
};

export default PortalMeusProdutos;
