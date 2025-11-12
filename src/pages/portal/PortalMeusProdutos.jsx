
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Bot, Loader2, AlertTriangle, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';

// Mapeia tipos de produto para ícones, com um padrão.
const productIcons = {
  default: Bot,
  bot: Bot,
  planilha: Download,
};

const PortalMeusProdutos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      setLoading(true);
      setError(null);

      // 1. Obter a sessão do usuário logado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Erro ao verificar sua sessão. Por favor, tente recarregar a página.");
        setLoading(false);
        return;
      }
      
      if (!session?.user) {
        // Se não houver sessão, não há produtos para mostrar.
        setProducts([]);
        setLoading(false);
        return;
      }

      const userEmail = session.user.email;

      // 2. Buscar as vendas (e os produtos relacionados) do usuário logado
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          id,
          products (*)
        `)
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (salesError) {
        setError("Falha ao buscar seus produtos. Tente novamente mais tarde.");
        console.error('Supabase error:', salesError.message);
        setLoading(false);
        return;
      }

      // 3. Extrair os produtos das vendas
      // Filtramos para remover vendas que, por algum motivo, não tenham um produto associado
      const userProducts = sales.map(sale => sale.products).filter(Boolean);

      setProducts(userProducts);
      setLoading(false);
    };

    fetchUserProducts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center">
          <AlertTriangle className="mr-3 h-6 w-6"/>
          <div>
            <p className="font-bold">Ocorreu um erro</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg border-2 border-dashed dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Nenhum produto por aqui ainda</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Parece que você ainda não adquiriu nenhum produto. Que tal explorar nossa loja?</p>
            <Button asChild>
                <Link to="/produtos">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Ver Produtos
                </Link>
            </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => {
          const ProductIcon = productIcons[product.type] || productIcons.default;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-[#0D1117] p-6 rounded-lg border dark:border-gray-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{product.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                  {product.subtitle || 'Produto Digital'}
                </p>
              </div>
              {/* A ação do botão pode ser personalizada futuramente */}
              <Button className="w-full mt-4 btn-primary">
                <ProductIcon className="mr-2 h-4 w-4" /> Acessar Produto
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Meus Produtos</h1>
        {renderContent()}
      </div>
    </>
  );
};

export default PortalMeusProdutos;
