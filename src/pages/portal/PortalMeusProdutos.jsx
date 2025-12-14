
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ExternalLink, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PortalMeusProdutos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Buscar produtos comprados pelo usuário
        const { data: purchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select(`
            *,
            registered_apps (*)
          `)
          .eq('user_id', user.id);

        if (purchasesError) {
          console.error('Erro ao buscar compras:', purchasesError);
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível carregar seus produtos.',
          });
          setMyProducts([]);
        } else {
          // Mapear compras para produtos
          const products = (purchases || [])
            .map(purchase => purchase.registered_apps)
            .filter(Boolean);
          setMyProducts(products);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setMyProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [user, toast]);

  const handleAccess = (product) => {
    if (product.vercel_deployment_url) {
      window.open(product.vercel_deployment_url, '_blank');
    } else if (product.github_repo_url) {
      window.open(product.github_repo_url, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL de acesso não disponível para este produto.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Meus Produtos - Portal LWDigitalForge</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Meus Produtos</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {myProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-[#0D1117] p-4 sm:p-5 md:p-6 rounded-lg border dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-lg mb-3 sm:mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                    {product.description || 'Sem descrição'}
                  </p>
                </div>
                <div className="space-y-2">
                  {product.vercel_deployment_url && (
                    <Button 
                      className="w-full btn-primary min-h-[44px] text-sm sm:text-base"
                      onClick={() => handleAccess(product)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> 
                      <span className="hidden sm:inline">Acessar Aplicação</span>
                      <span className="sm:hidden">Acessar</span>
                    </Button>
                  )}
                  {product.github_repo_url && (
                    <Button 
                      variant="outline"
                      className="w-full min-h-[44px] text-sm sm:text-base"
                      onClick={() => window.open(product.github_repo_url, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" /> 
                      <span className="hidden sm:inline">Ver Repositório</span>
                      <span className="sm:hidden">Repositório</span>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Você ainda não adquiriu nenhum produto.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalMeusProdutos;
