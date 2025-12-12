
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [purchase, setPurchase] = useState(null);

  const verifyPaymentStatus = useCallback(async (paymentId, status, preferenceId) => {
    try {
      if (!user) {
        toast({
          title: 'Login necessário',
          description: 'Por favor, faça login para verificar o status do pagamento.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Se temos payment_id, buscar a compra pelo payment_id
      if (paymentId) {
        const { data: purchases, error } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('payment_id', paymentId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Erro ao buscar compra:', error);
          throw error;
        }

        if (purchases && purchases.length > 0) {
          const foundPurchase = purchases[0];
          setPurchase(foundPurchase);
          setPaymentStatus(foundPurchase.status === 'APPROVED' ? 'approved' : 
                          foundPurchase.status === 'PENDING' ? 'pending' : 'rejected');
        } else {
          // Se não encontrou pelo payment_id, pode ser que o webhook ainda não processou
          // Tentar buscar pela preferência ou aguardar
          setPaymentStatus(status === 'approved' ? 'approved' : 
                          status === 'pending' ? 'pending' : 'rejected');
        }
      } else if (preferenceId) {
        // Se só temos preference_id, buscar compras recentes do usuário
        const { data: purchases, error } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && purchases && purchases.length > 0) {
          setPurchase(purchases[0]);
          setPaymentStatus('pending');
        } else {
          setPaymentStatus(status === 'approved' ? 'approved' : 
                          status === 'pending' ? 'pending' : 'rejected');
        }
      }

      // Se o status da URL é 'approved', mas ainda não temos confirmação no banco
      // Pode ser que o webhook ainda não processou, então mostramos como aprovado
      if (status === 'approved' && !purchase) {
        setPaymentStatus('approved');
      }
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar o status do pagamento.',
        variant: 'destructive',
      });
      setPaymentStatus('pending');
    } finally {
      setLoading(false);
    }
  }, [user, toast, navigate]);

  useEffect(() => {
    // Limpar carrinho quando a página carregar
    clearCart();

    // Verificar parâmetros da URL do Mercado Pago
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const preferenceId = searchParams.get('preference_id');

    if (!paymentId && !preferenceId) {
      // Se não há parâmetros, apenas mostrar mensagem genérica
      setLoading(false);
      setPaymentStatus('approved');
      return;
    }

    // Verificar status do pagamento
    verifyPaymentStatus(paymentId, status, preferenceId);
  }, [searchParams, clearCart, verifyPaymentStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <Loader2 className="w-24 h-24 text-blue-500 mx-auto mb-6 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Verificando pagamento...
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Aguarde enquanto confirmamos seu pagamento.
          </p>
        </div>
      </div>
    );
  }

  // Renderizar baseado no status
  if (paymentStatus === 'approved') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Sua compra foi concluída com sucesso. Agradecemos a sua preferência!
          </p>
          {purchase && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              ID da compra: {purchase.id.slice(0, 8)}...
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Button asChild className="btn-primary inline-flex items-center gap-2">
              <Link to="/portal/meus-produtos">
                Ver Meus Produtos <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                Voltar à Página Inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <Clock className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Pagamento Pendente
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail quando for aprovado.
          </p>
          {purchase && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              ID da compra: {purchase.id.slice(0, 8)}...
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Button asChild className="btn-primary inline-flex items-center gap-2">
              <Link to="/portal/meus-produtos">
                Ver Meus Produtos <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                Voltar à Página Inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Status rejeitado ou erro
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Pagamento Não Aprovado
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          O pagamento não foi aprovado. Por favor, tente novamente ou entre em contato conosco.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="btn-primary inline-flex items-center gap-2">
            <Link to="/carrinho">
              Tentar Novamente <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              Voltar à Página Inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
