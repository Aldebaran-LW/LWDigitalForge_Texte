
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Bot, ShoppingCart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';

const PortalMeusProdutos = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id, products (id, name, product_types (name))')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user products:', error);
        setMyProducts([]);
      } else {
        const formattedProducts = data.map(purchase => ({
          id: purchase.products.id,
          name: purchase.products.name,
          type: purchase.products.product_types.name.toUpperCase(),
          icon: purchase.products.product_types.name.toUpperCase() === 'BOT TELEGRAM' ? Bot : Download,
          actionText: purchase.products.product_types.name.toUpperCase() === 'BOT TELEGRAM' ? 'Acessar Instruções' : 'Baixar Planilha',
        }));
        setMyProducts(formattedProducts);
      }
      setLoading(false);
    };

    fetchMyProducts();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-6">Meus Produtos</h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        ) : myProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-[#0D1117] p-6 rounded-lg border dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.type}</p>
                </div>
                <Button className="w-full mt-4 btn-primary">
                  <product.icon className="mr-2 h-4 w-4" /> {product.actionText}
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 dark:bg-[#0D1117] p-10 rounded-lg border-2 border-dashed dark:border-gray-700">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Você ainda não adquiriu nenhum de nossos produtos.
            </p>
            <Button asChild className="btn-primary">
              <Link to="/produtos">Explorar Produtos</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalMeusProdutos;
