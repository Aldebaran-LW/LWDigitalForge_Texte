
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
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
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      // Processar cada item do carrinho
      // variant.id: ${product.id}_monthly | ${product.id}_annual (vitalício não é vendido pelo site)
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

        // Verificar se o Mercado Pago SDK está carregado
        if (!window.MercadoPago) {
          throw new Error('SDK do Mercado Pago não carregado. Por favor, recarregue a página.');
        }

        const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('Chave pública do Mercado Pago não configurada.');
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
  }, [cartItems, toast, clearCart, user, navigate, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-gradient">Carrinho</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 min-h-[44px] min-w-[44px]">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center px-4">
                  <ShoppingCartIcon size={40} className="sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Seu carrinho está vazio.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-start gap-3 sm:gap-4 bg-white/50 dark:bg-white/5 p-3 rounded-lg">
                    <img src={item.product.image || placeholderImage} alt={item.product.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white mb-1 line-clamp-2">{item.product.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">{item.variant.title}</p>
                      <p className="text-sm sm:text-base text-blue-500 dark:text-blue-400 font-bold">
                        {item.variant.sale_price_formatted || item.variant.price_formatted || `R$ ${((item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100).toFixed(2).replace('.', ',')}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-md">
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} size="sm" variant="ghost" className="px-2 sm:px-3 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 min-h-[36px] min-w-[36px]">-</Button>
                        <span className="px-2 sm:px-3 text-sm sm:text-base text-gray-800 dark:text-white min-w-[32px] text-center">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 sm:px-3 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 min-h-[36px] min-w-[36px]">+</Button>
                      </div>
                      <Button onClick={() => removeFromCart(item.variant.id)} size="sm" variant="ghost" className="text-red-500 hover:text-red-400 text-xs sm:text-sm min-h-[32px]">Remover</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-3 sm:mb-4 text-gray-800 dark:text-white">
                  <span className="text-base sm:text-lg font-medium">Total</span>
                  <span className="text-xl sm:text-2xl font-bold">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full btn-primary font-semibold py-3 sm:py-4 text-sm sm:text-base min-h-[48px]">
                  Finalizar Compra
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
