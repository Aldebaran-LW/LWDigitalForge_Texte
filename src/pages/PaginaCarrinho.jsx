import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Trash2, ShoppingCart } from 'lucide-react';

const PaginaCarrinho = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    toast({
      title: "🚧 Finalização de Compra em Breve!",
      description: "Esta funcionalidade ainda não está implementada, mas seu pedido está salvo!",
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

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

          {cart.length === 0 ? (
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
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between bg-white dark:bg-[#111827]/50 p-4 rounded-lg border border-gray-200 dark:border-[#14B8A6]/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-gradient-to-br from-[#2563EB]/20 to-[#14B8A6]/20 rounded-md flex items-center justify-center">
                        <item.icon size={32} className="text-[#14B8A6]" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 p-2 text-center bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#3B82F6]/30 rounded-lg"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
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
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300">
                    <span>Frete</span>
                    <span>Grátis</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
                  <div className="flex justify-between font-bold text-xl mb-6">
                    <span>Total</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
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