
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Bell, 
  MessageSquare, 
  Sparkles, 
  Gift, 
  Tag,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Filter,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PortalNotificacoes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, messages, updates, offers
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allNotifications = [];

      try {
        // Buscar mensagens de contato
        try {
          const { data: messages, error: messagesError } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!messagesError && messages) {
            messages.forEach(msg => {
              // Só adicionar mensagens que ainda não foram lidas
              if (msg.status !== 'READ') {
                allNotifications.push({
                  id: `msg-${msg.id}`,
                  type: 'message',
                  title: msg.status === 'REPLIED' ? 'Mensagem respondida' : 'Nova mensagem',
                  description: `Sua mensagem: "${msg.subject}"`,
                  content: msg.message,
                  icon: MessageSquare,
                  color: 'blue',
                  link: '/portal/contato',
                  date: msg.created_at,
                  read: false,
                  status: msg.status
                });
              }
            });
          }
        } catch (err) {
          console.log('Erro ao buscar mensagens:', err);
        }

        // Buscar produtos novos (lançamentos - últimos 30 dias)
        // Verificar quais produtos já foram visualizados (localStorage)
        const viewedProducts = JSON.parse(localStorage.getItem('viewedProductNotifications') || '[]');
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: newProducts, error: newProductsError } = await supabase
          .from('registered_apps')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!newProductsError && newProducts) {
          newProducts.forEach(product => {
            const productDate = new Date(product.created_at);
            // Só adicionar se for novo (últimos 30 dias) e ainda não foi visualizado
            if (productDate > thirtyDaysAgo && !viewedProducts.includes(product.id)) {
              allNotifications.push({
                id: `product-${product.id}`,
                type: 'update',
                title: 'Novo lançamento!',
                description: `${product.name} está disponível`,
                content: product.description || 'Confira este novo produto em nossa plataforma.',
                icon: Sparkles,
                color: 'purple',
                link: `/product/${product.id}`,
                date: product.created_at,
                read: false,
                product: product
              });
            }
          });
        }

        // Notificações de atualizações (pode ser expandido no futuro)
        // Por enquanto, adicionar uma notificação de boas-vindas se não houver outras
        if (allNotifications.length === 0) {
          allNotifications.push({
            id: 'welcome',
            type: 'update',
            title: 'Bem-vindo ao Portal!',
            description: 'Explore nossos produtos e recursos disponíveis',
            content: 'Você pode gerenciar seus produtos, assinaturas e muito mais aqui.',
            icon: Bell,
            color: 'green',
            link: '/portal/produtos',
            date: new Date().toISOString(),
            read: false
          });
        }

        // Ordenar por data (mais recentes primeiro)
        allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(allNotifications);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar as notificações.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  const markAsRead = async (notification) => {
    if (notification.type === 'message') {
      try {
        const messageId = notification.id.replace('msg-', '');
        const { error } = await supabase
          .from('contact_messages')
          .update({ status: 'READ' })
          .eq('id', messageId);

        if (!error) {
          // Marcar como lida na lista (não remover)
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notification.id 
                ? { ...notif, read: true, status: 'READ' }
                : notif
            )
          );
          toast({
            title: 'Marcada como lida',
            description: 'A notificação foi marcada como lida.',
          });
        } else {
          throw error;
        }
      } catch (err) {
        console.error('Erro ao marcar como lida:', err);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível marcar a notificação como lida.',
        });
      }
    } else if (notification.type === 'update' && notification.product) {
      // Para produtos novos, marcar como visualizado no localStorage
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProductNotifications') || '[]');
      if (!viewedProducts.includes(notification.product.id)) {
        viewedProducts.push(notification.product.id);
        localStorage.setItem('viewedProductNotifications', JSON.stringify(viewedProducts));
        // Disparar evento customizado para atualizar Dashboard
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
      
      // Marcar como lida na lista (não remover)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notification.id 
            ? { ...notif, read: true }
            : notif
        )
      );
      toast({
        title: 'Marcada como lida',
        description: 'A notificação foi marcada como lida.',
      });
    } else {
      // Para outros tipos, salvar no localStorage também
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notification.id)) {
        readNotifications.push(notification.id);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
        // Disparar evento customizado para atualizar Dashboard
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
      
      // Marcar como lida na lista (não remover)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notification.id 
            ? { ...notif, read: true }
            : notif
        )
      );
      toast({
        title: 'Marcada como lida',
        description: 'A notificação foi marcada como lida.',
      });
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'messages') return notif.type === 'message';
    if (filter === 'updates') return notif.type === 'update';
    if (filter === 'offers') return notif.type === 'offer';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const messagesCount = notifications.filter(n => n.type === 'message').length;
  const updatesCount = notifications.filter(n => n.type === 'update').length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getColorClasses = (color) => {
    const classes = {
      blue: {
        icon: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800'
      },
      purple: {
        icon: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-800'
      },
      green: {
        icon: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800'
      },
      orange: {
        icon: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-200 dark:border-orange-800'
      }
    };
    return classes[color] || classes.blue;
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
        <title>Notificações - Portal do Cliente</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notificações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0 
                ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas as notificações foram lidas'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={async () => {
                // Marcar todas as mensagens como lidas no banco
                const messageNotifications = notifications.filter(
                  n => n.type === 'message' && !n.read
                );
                
                for (const notif of messageNotifications) {
                  try {
                    const messageId = notif.id.replace('msg-', '');
                    await supabase
                      .from('contact_messages')
                      .update({ status: 'READ' })
                      .eq('id', messageId);
                  } catch (err) {
                    console.error('Erro ao marcar mensagem como lida:', err);
                  }
                }
                
                // Marcar produtos novos como visualizados no localStorage
                const productNotifications = notifications.filter(
                  n => n.type === 'update' && n.product && !n.read
                );
                const viewedProducts = JSON.parse(localStorage.getItem('viewedProductNotifications') || '[]');
                productNotifications.forEach(notif => {
                  if (!viewedProducts.includes(notif.product.id)) {
                    viewedProducts.push(notif.product.id);
                  }
                });
                localStorage.setItem('viewedProductNotifications', JSON.stringify(viewedProducts));
                
                // Marcar todas como lidas na lista (não remover)
                setNotifications(prev => 
                  prev.map(notif => ({ ...notif, read: true, status: notif.type === 'message' ? 'READ' : notif.status }))
                );
                
                toast({
                  title: 'Todas marcadas como lidas',
                  description: 'Todas as notificações foram marcadas como lidas.',
                });
              }}
              className="transition-all"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              Todas ({notifications.length})
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'messages' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('messages')}
              className="transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens ({messagesCount})
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === 'updates' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('updates')}
              className="transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Atualizações ({updatesCount})
            </Button>
          </motion.div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              const colorClasses = getColorClasses(notification.color);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl border-2 ${
                    notification.read 
                      ? 'border-gray-200 dark:border-gray-700 opacity-75' 
                      : colorClasses.border
                  } p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div 
                      className={`p-3 rounded-lg ${colorClasses.icon} flex-shrink-0 transition-all duration-300 ${
                        notification.read ? 'opacity-60' : 'group-hover:scale-110'
                      }`}
                      whileHover={!notification.read ? { rotate: 5, scale: 1.1 } : {}}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-1 ${
                            notification.read 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.description}
                          </p>
                          {notification.content && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
                              {notification.content}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 mt-2"
                          ></motion.div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(notification.date)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification)}
                                className="text-xs hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Marcar como lida
                              </Button>
                            </motion.div>
                          )}
                          {notification.read && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              <span>Lida</span>
                            </div>
                          )}
                          <Link to={notification.link}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button variant="outline" size="sm" className="text-xs group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors">
                                Ver detalhes
                                <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                              </Button>
                            </motion.div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Você não possui notificações no momento.'
                : `Não há notificações do tipo "${filter === 'messages' ? 'Mensagens' : 'Atualizações'}" no momento.`
              }
            </p>
            <Link to="/portal/produtos">
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

export default PortalNotificacoes;

