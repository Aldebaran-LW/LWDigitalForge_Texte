
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Package, 
  TestTube2, 
  CreditCard, 
  Clock, 
  ExternalLink,
  ShoppingCart,
  Calendar,
  Loader2,
  Bell,
  Gift,
  Sparkles,
  MessageSquare,
  Tag
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PortalDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeTrials: 0,
    activeSubscriptions: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeTrials, setActiveTrials] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Função para buscar notificações
      const fetchNotifications = async () => {
        const notifs = [];
        
        // Verificar mensagens de contato não lidas (apenas as que ainda não foram marcadas como READ)
        try {
          const { data: messages, error: messagesError } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('user_id', user.id)
            .neq('status', 'READ') // Apenas não lidas
            .order('created_at', { ascending: false })
            .limit(5);

          if (!messagesError && messages && messages.length > 0) {
            messages.forEach(msg => {
              notifs.push({
                id: `msg-${msg.id}`,
                type: 'message',
                title: msg.status === 'REPLIED' ? 'Mensagem respondida' : 'Nova mensagem',
                description: `Sua mensagem "${msg.subject}"`,
                icon: MessageSquare,
                color: 'blue',
                link: '/portal/contato',
                date: msg.created_at,
                read: false
              });
            });
          }
        } catch (err) {
          // Ignorar erro se tabela não existir ainda
        }

        // Verificar produtos novos (lançamentos)
        // Verificar quais produtos já foram visualizados (localStorage)
        const viewedProducts = JSON.parse(localStorage.getItem('viewedProductNotifications') || '[]');
        
        const { data: newProducts, error: newProductsError } = await supabase
          .from('registered_apps')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!newProductsError && newProducts && newProducts.length > 0) {
          // Verificar se são produtos realmente novos (últimos 30 dias)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          newProducts.forEach(product => {
            const productDate = new Date(product.created_at);
            // Só adicionar se for novo e ainda não foi visualizado
            if (productDate > thirtyDaysAgo && !viewedProducts.includes(product.id)) {
              notifs.push({
                id: `product-${product.id}`,
                type: 'launch',
                title: 'Novo lançamento!',
                description: `${product.name} está disponível`,
                icon: Sparkles,
                color: 'purple',
                link: `/product/${product.id}`,
                date: product.created_at,
                read: false
              });
            }
          });
        }

        // Verificar notificações já lidas no localStorage (para outros tipos)
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        
        // Filtrar notificações já lidas
        const unreadNotifs = notifs.filter(notif => !readNotifications.includes(notif.id));

        // Ordenar por data (mais recentes primeiro)
        unreadNotifs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(unreadNotifs.slice(0, 5)); // Limitar a 5 notificações
      };

      try {
        // Buscar produtos comprados
        const { data: purchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select(`
            *,
            registered_apps:product_id (*)
          `)
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false })
          .limit(5);

        if (!purchasesError && purchases) {
          setRecentProducts(purchases.filter(p => p.registered_apps).map(p => p.registered_apps));
        }

        // Buscar testes ativos
        const { data: trials, error: trialsError } = await supabase
          .from('user_trials')
          .select(`
            *,
            registered_apps:app_id (*)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('started_at', { ascending: false })
          .limit(3);

        if (!trialsError && trials) {
          setActiveTrials(trials);
        }

        // Buscar notificações
        await fetchNotifications();
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os dados do dashboard.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Escutar atualizações de notificações
    const handleNotificationsUpdate = () => {
      if (user) {
        const fetchNotifications = async () => {
          const notifs = [];
          
          // Verificar mensagens de contato não lidas
          try {
            const { data: messages, error: messagesError } = await supabase
              .from('contact_messages')
              .select('*')
              .eq('user_id', user.id)
              .neq('status', 'READ')
              .order('created_at', { ascending: false })
              .limit(5);

            if (!messagesError && messages && messages.length > 0) {
              messages.forEach(msg => {
                notifs.push({
                  id: `msg-${msg.id}`,
                  type: 'message',
                  title: msg.status === 'REPLIED' ? 'Mensagem respondida' : 'Nova mensagem',
                  description: `Sua mensagem "${msg.subject}"`,
                  icon: MessageSquare,
                  color: 'blue',
                  link: '/portal/contato',
                  date: msg.created_at,
                  read: false
                });
              });
            }
          } catch (err) {
            // Ignorar erro
          }

          // Verificar produtos novos
          const viewedProducts = JSON.parse(localStorage.getItem('viewedProductNotifications') || '[]');
          const { data: newProducts, error: newProductsError } = await supabase
            .from('registered_apps')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!newProductsError && newProducts && newProducts.length > 0) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            newProducts.forEach(product => {
              const productDate = new Date(product.created_at);
              if (productDate > thirtyDaysAgo && !viewedProducts.includes(product.id)) {
                notifs.push({
                  id: `product-${product.id}`,
                  type: 'launch',
                  title: 'Novo lançamento!',
                  description: `${product.name} está disponível`,
                  icon: Sparkles,
                  color: 'purple',
                  link: `/product/${product.id}`,
                  date: product.created_at,
                  read: false
                });
              }
            });
          }

          const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
          const unreadNotifs = notifs.filter(notif => !readNotifications.includes(notif.id));
          unreadNotifs.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotifications(unreadNotifs.slice(0, 5));
        };
        
        fetchNotifications();
      }
    };
    
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
    };
  }, [user, toast]);

  // Calcular estatísticas (separado para não recarregar tudo)
  useEffect(() => {
    if (!user) return;

    const calculateStats = async () => {
      try {
        const { count: productsCount } = await supabase
          .from('user_purchases')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: trialsCount } = await supabase
          .from('user_trials')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true);

        setStats({
          totalProducts: productsCount || 0,
          activeTrials: trialsCount || 0,
          activeSubscriptions: 0 // Implementar quando tiver tabela de assinaturas
        });
      } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
      }
    };

    calculateStats();
  }, [user]);

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return 'Expirado';
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    if (diff <= 0) return 'Expirado';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} dia${days > 1 ? 's' : ''}`;
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
        <title>Dashboard - Portal LWDigitalForge</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral da sua conta e produtos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Produtos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Testes Ativos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.activeTrials}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TestTube2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assinaturas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Notificações Card */}
          <Link to="/portal/notificacoes">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notificações</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {notifications.length}
                  </p>
                </div>
                {notifications.length > 0 && (
                  <div className="px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white text-xs font-bold rounded-full">
                    {notifications.length}
                  </div>
                )}
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </Link>

        </div>

        {/* Recent Products and Active Trials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Produtos Recentes
              </h2>
              <Link to="/portal/meus-produtos">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {product.description}
                      </p>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Você ainda não possui produtos
                </p>
                <Link to="/portal/produtos">
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Explorar Produtos
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Active Trials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Testes Ativos
              </h2>
              <Link to="/portal/testes">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            {activeTrials.length > 0 ? (
              <div className="space-y-3">
                {activeTrials.map((trial, index) => {
                  const product = trial.registered_apps;
                  const timeLeft = calculateTimeLeft(trial.expires_at);
                  return (
                    <div
                      key={trial.id}
                      className="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {product?.name || 'Produto'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {timeLeft} restantes
                            </span>
                          </div>
                        </div>
                      </div>
                      {product?.id && (
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Ver Detalhes
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TestTube2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum teste ativo no momento
                </p>
                <Link to="/portal/produtos">
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Explorar Produtos
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-600 dark:bg-blue-500 rounded-xl p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/portal/produtos">
              <Button variant="secondary" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Explorar Produtos
              </Button>
            </Link>
            <Link to="/portal/pagamentos">
              <Button variant="secondary" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Ver Pagamentos
              </Button>
            </Link>
            <Link to="/portal/contato">
              <Button variant="secondary" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Falar com Suporte
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PortalDashboard;

