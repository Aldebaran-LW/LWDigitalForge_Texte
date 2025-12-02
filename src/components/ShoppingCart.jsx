
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Seu carrinho está vazio',
        description: 'Adicione alguns produtos antes de finalizar a compra.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { products: cartItems.map(item => ({ id: item.product.id, quantity: item.quantity })) },
      });

      if (error) {
        throw error;
      }

      const { id } = data;
      const publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('Chave pública do Mercado Pago não configurada.');
      }

      const mercadopago = new window.MercadoPago(publicKey, {
        locale: 'pt-BR',
      });

      mercadopago.checkout({ preference: { id } });

    } catch (error) {
      toast({
        title: 'Erro no Checkout',
        description: 'Houve um problema ao iniciar o checkout. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  }, [cartItems, toast]);

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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-gradient">Carrinho</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-3 rounded-lg">
                    <img src={item.product.image || placeholderImage} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{item.product.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.variant.title}</p>
                      <p className="text-sm text-blue-500 dark:text-blue-400 font-bold">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-md">
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} size="sm" variant="ghost" className="px-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">-</Button>
                        <span className="px-2 text-gray-800 dark:text-white">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">+</Button>
                      </div>
                      <Button onClick={() => removeFromCart(item.variant.id)} size="sm" variant="ghost" className="text-red-500 hover:text-red-400 text-xs">Remover</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-4 text-gray-800 dark:text-white">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full btn-primary font-semibold py-3 text-base">
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
