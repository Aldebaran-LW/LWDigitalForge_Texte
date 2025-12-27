
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  CreditCard, 
  Calendar, 
  RotateCcw, 
  X, 
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PortalAssinaturas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const fetchSubscriptions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Buscar assinaturas de user_purchases (compras não lifetime e não trial, apenas aprovadas)
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          registered_apps:app_id (*)
        `)
        .eq('user_id', user.id)
        .neq('purchase_type', 'LIFETIME')
        .neq('purchase_type', 'TRIAL')
        .eq('status', 'APPROVED');

      if (error) throw error;

      // Mapear para formato de assinatura
      const subs = (data || []).map(purchase => ({
        id: purchase.id,
        product: purchase.registered_apps,
        productName: purchase.registered_apps?.name,
        accessLevel: purchase.purchase_type,
        createdAt: purchase.created_at,
        expiresAt: purchase.expires_at,
        status: purchase.status
      }));

      setSubscriptions(subs);
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar as assinaturas.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user, toast]);

  const handleCancel = async () => {
    if (!selectedSubscription) return;

    try {
      // Atualizar status da compra para CANCELLED
      const { error } = await supabase
        .from('user_purchases')
        .update({ 
          status: 'CANCELLED',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSubscription.id);

      if (error) throw error;

      toast({
        title: 'Assinatura cancelada',
        description: 'Sua assinatura foi cancelada com sucesso. Você terá acesso até o fim do período atual.',
      });
      
      setCancelDialogOpen(false);
      setSelectedSubscription(null);
      
      // Recarregar assinaturas
      await fetchSubscriptions();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível cancelar a assinatura. Tente novamente ou entre em contato com o suporte.',
      });
    }
  };

  const handleRenew = async (subscription) => {
    // Redirecionar para página do produto para renovar
    if (subscription.product?.id) {
      navigate(`/product/${subscription.product.id}`);
    } else {
      toast({
        title: 'Produto não encontrado',
        description: 'Não foi possível redirecionar para a página do produto.',
        variant: 'destructive',
      });
    }
  };

  const handleRefund = async (subscription) => {
    // Redirecionar para contato para solicitar reembolso
    navigate('/portal/contato', { 
      state: { 
        subject: `Solicitação de Reembolso - ${subscription.productName || 'Assinatura'}`,
        message: `Olá,\n\nGostaria de solicitar o reembolso da minha assinatura: ${subscription.productName || 'Assinatura'} (ID: ${subscription.id}).\n\nMotivo: [Por favor, descreva o motivo do reembolso]\n\nAtenciosamente.`
      }
    });
    toast({
      title: 'Redirecionando',
      description: 'Por favor, preencha o formulário de contato para solicitar reembolso.',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        <title>Assinaturas - Portal LWDigitalForge</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Minhas Assinaturas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas assinaturas e pagamentos recorrentes
          </p>
        </div>

        {subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {subscription.productName || subscription.product?.name}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Próxima renovação: {formatDate(subscription.expiresAt)}</span>
                      </div>
                      <div>
                        <span className="capitalize">Nível de acesso: {subscription.accessLevel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRenew(subscription)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renovar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRefund(subscription)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Solicitar Reembolso
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedSubscription(subscription);
                        setCancelDialogOpen(true);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma assinatura ativa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você não possui assinaturas ativas no momento.
            </p>
          </div>
        )}

        {/* Cancel Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Assinatura?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar a assinatura de {selectedSubscription?.productName}? 
                Você perderá o acesso após o período atual expirar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                Cancelar Assinatura
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default PortalAssinaturas;

