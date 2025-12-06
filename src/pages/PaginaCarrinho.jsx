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
        let purchaseType = 'LIFETIME'; // padrão
        
        // Extrair o tipo de compra do variant.id (formato: ${product.id}_monthly, ${product.id}_annual, etc.)
        if (item.variant.id) {
          const idParts = item.variant.id.split('_');
          if (idParts.length > 1) {
            const type = idParts[idParts.length - 1].toLowerCase();
            if (type === 'monthly') {
              purchaseType = 'MONTHLY';
            } else if (type === 'annual') {
              purchaseType = 'ANNUAL';
            } else if (type === 'lifetime') {
              purchaseType = 'LIFETIME';
            }
          }
        }
        
        // Fallback: tentar extrair do variant.title se o ID não tiver o formato esperado
        if (purchaseType === 'LIFETIME' && item.variant.title) {
          const titleLower = item.variant.title.toLowerCase();
          if (titleLower.includes('mensal')) {
            purchaseType = 'MONTHLY';
          } else if (titleLower.includes('anual')) {
            purchaseType = 'ANNUAL';
          }
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
      <div className="min-h-[calc(100vh-14rem)] py-12 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Seu Carrinho de Compras
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80">
              Revise seus itens e prepare-se para automatizar!
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white dark:bg-[#111827]/50 p-12 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
            >
              <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Parece que você ainda não adicionou nenhum produto.
              </p>
              <Button asChild className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg">
                <Link to="/produtos">Explorar Produtos</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.variant.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between bg-white dark:bg-[#111827]/50 p-4 rounded-lg border border-gray-200 dark:border-[#14B8A6]/20"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.product.image || placeholderImage} 
                        alt={item.product.title || 'Produto'} 
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                      <div>
                        <h3 className="font-bold">{item.product.title || 'Produto'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.variant.title}</p>
                        <p className="text-sm text-blue-500 dark:text-blue-400 font-bold">
                          {item.variant.sale_price_formatted || item.variant.price_formatted || `R$ ${((item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100).toFixed(2).replace('.', ',')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                        className="w-16 p-2 text-center bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.variant.id)}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#111827]/50 p-6 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20 sticky top-28">
                  <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
                  <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300">
                    <span>Frete</span>
                    <span>Grátis</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
                  <div className="flex justify-between font-bold text-xl mb-6">
                    <span>Total</span>
                    <span>{getCartTotal()}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full btn-primary py-3 text-lg font-semibold rounded-lg">
                    Finalizar Compra
                  </Button>
                  <Button onClick={clearCart} variant="ghost" className="w-full mt-2 text-red-500">
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