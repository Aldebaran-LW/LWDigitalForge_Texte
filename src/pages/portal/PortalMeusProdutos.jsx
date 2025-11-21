
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
      <div>
        <h1 className="text-2xl font-bold mb-6">Meus Produtos</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 dark:text-white animate-spin" />
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
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.description || 'Sem descrição'}
                  </p>
                </div>
                <div className="space-y-2">
                  {product.vercel_deployment_url && (
                    <Button 
                      className="w-full btn-primary"
                      onClick={() => handleAccess(product)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Acessar Aplicação
                    </Button>
                  )}
                  {product.github_repo_url && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(product.github_repo_url, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" /> Ver Repositório
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Você ainda não adquiriu nenhum produto.</p>
        )}
      </div>
    </>
  );
};

export default PortalMeusProdutos;
