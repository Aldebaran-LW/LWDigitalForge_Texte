import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const PaginaCarrinho = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Seu carrinho está vazio',
        description: 'Adicione alguns produtos antes de finalizar a compra.',
        variant: 'destructive',
      });
      return;
    }

    // Verificar se o usuário está autenticado
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Por favor, faça login para finalizar a compra.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Verificar se o Mercado Pago SDK está carregado
    if (!window.MercadoPago) {
      toast({
        title: 'Erro',
        description: 'SDK do Mercado Pago não carregado. Por favor, recarregue a página.',
        variant: 'destructive',
      });
      return;
    }

    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey) {
      toast({
        title: 'Erro de Configuração',
        description: 'Chave pública do Mercado Pago não configurada.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Processar cada item do carrinho
      for (const item of cartItems) {
        let purchaseType = null;

        if (item.variant.id) {
          const idParts = item.variant.id.split('_');
          if (idParts.length > 1) {
            const type = idParts[idParts.length - 1].toLowerCase();
            if (type === 'monthly') purchaseType = 'MONTHLY';
            else if (type === 'annual') purchaseType = 'ANNUAL';
            else if (type === 'lifetime') purchaseType = 'LIFETIME';
          }
        }

        if (purchaseType === 'LIFETIME') {
          throw new Error(
            'O plano vitalício não está disponível para compra. Remova o item do carrinho e escolha mensal ou anual no produto.',
          );
        }

        if (!purchaseType && item.variant.title) {
          const titleLower = item.variant.title.toLowerCase();
          if (titleLower.includes('vitalíci') || titleLower.includes('vitalicio')) {
            throw new Error(
              'O plano vitalício não está disponível para compra. Remova o item do carrinho e escolha mensal ou anual no produto.',
            );
          }
          if (titleLower.includes('mensal')) purchaseType = 'MONTHLY';
          else if (titleLower.includes('anual')) purchaseType = 'ANNUAL';
        }

        if (!purchaseType) {
          throw new Error(
            'Não foi possível identificar o plano. Remova o item e adicione novamente ao carrinho.',
          );
        }

        // Chamar a Edge Function para criar o checkout
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { 
            appId: item.product.id,
            purchaseType: purchaseType
          },
        });

        if (error) {
          throw error;
        }

        if (!data?.preferenceId) {
          throw new Error('Preference ID não retornado pelo servidor');
        }

        // Inicializar Mercado Pago e abrir checkout
        const mercadopago = new window.MercadoPago(publicKey, {
          locale: 'pt-BR',
        });

        mercadopago.checkout({
          preference: {
            id: data.preferenceId
          }
        });
      }

      // Limpar o carrinho após iniciar o checkout
      clearCart();

    } catch (error) {
      console.error('Erro no checkout:', error);
      toast({
        title: 'Erro no Checkout',
        description: error.message || 'Houve um problema ao iniciar o checkout. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  }, [cartItems, toast, user, navigate, clearCart]);

  return (
    <>
      <Helmet>
        <title>Carrinho de Compras - LWDigitalForge</title>
        <meta name="description" content="Revise seus produtos e finalize sua compra." />
      </Helmet>
      <div className="min-h-[calc(100vh-14rem)] py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gradient px-2">
              Seu Carrinho de Compras
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-[#F9FAFB]/80 px-2">
              Revise seus itens e prepare-se para automatizar!
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white dark:bg-[#111827]/50 p-6 sm:p-8 md:p-12 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
            >
              <ShoppingCart className="mx-auto text-gray-400 mb-4 w-12 h-12 sm:w-16 sm:h-16" size={64} />
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Seu carrinho está vazio</h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 px-4">
                Parece que você ainda não adicionou nenhum produto.
              </p>
              <Button asChild className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg min-h-[48px]">
                <Link to="/produtos">Explorar Produtos</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.variant.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#111827]/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-[#14B8A6]/20 gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <img 
                        src={item.product.image || placeholderImage} 
                        alt={item.product.title || 'Produto'} 
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2">{item.product.title || 'Produto'}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">{item.variant.title}</p>
                        <p className="text-sm sm:text-base text-blue-500 dark:text-blue-400 font-bold">
                          {item.variant.sale_price_formatted || item.variant.price_formatted || `R$ ${((item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100).toFixed(2).replace('.', ',')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity > 0) {
                              updateQuantity(item.variant.id, newQuantity);
                            }
                          }}
                          className="w-12 sm:w-16 p-1.5 sm:p-2 text-center text-sm sm:text-base bg-gray-100 dark:bg-[#0D1117] border-0 focus:outline-none focus:ring-0 min-h-[36px]"
                        />
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.variant.id)} className="min-h-[36px] min-w-[36px]">
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#111827]/50 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20 sticky top-20 md:top-24 lg:top-28">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Resumo do Pedido</h2>
                  <div className="flex justify-between mb-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-medium">{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    <span>Frete</span>
                    <span className="font-medium">Grátis</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-3 sm:my-4"></div>
                  <div className="flex justify-between font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                    <span>Total</span>
                    <span>{getCartTotal()}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg min-h-[48px] mb-2 sm:mb-3">
                    Finalizar Compra
                  </Button>
                  <Button onClick={clearCart} variant="ghost" className="w-full text-sm sm:text-base text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[44px]">
                    Esvaziar Carrinho
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaginaCarrinho;