
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminGerenciarProdutos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registered_apps')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar produtos', description: error.message });
    } else {
      setProducts(data);
      setError(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId) => {
    const { error } = await supabase.from('registered_apps').delete().eq('id', productId);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir produto', description: error.message });
    } else {
      toast({ title: 'Produto excluído com sucesso!' });
      fetchProducts(); // Refresh list
    }
  };

  const formatPrice = (priceInCents) => {
    if (priceInCents === null || priceInCents === undefined) return 'N/A';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <>
      <Helmet>
        <title>Gerenciar Produtos - LWDigitalForge Admin</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Produtos</h1>
          <Button asChild className="btn-primary w-full sm:w-auto min-h-[44px]">
            <Link to="/admin/produtos/novo">
              <PlusCircle className="mr-2 h-4 w-4" /> 
              <span className="hidden sm:inline">Adicionar Novo Produto</span>
              <span className="sm:hidden">Novo Produto</span>
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64"><Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded" role="alert">
            <p className="font-bold flex items-center text-sm sm:text-base"><AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5"/>Erro</p>
            <p className="text-xs sm:text-sm mt-1">{error}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto -mx-4 sm:mx-0"
          >
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-xs sm:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">Nome</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden md:table-cell">Descrição</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">Mensal</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap hidden lg:table-cell">Anual</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap hidden lg:table-cell">Vitalício</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm">Nenhum produto encontrado.</td>
                    </tr>
                  ) : products.map((product, index) => (
                    <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <th scope="row" className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1 truncate max-w-[150px]">{product.description || 'Sem descrição'}</span>
                        </div>
                      </th>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 max-w-xs truncate hidden md:table-cell" title={product.description}>
                        {product.description || 'Sem descrição'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">{formatPrice(product.price_monthly)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">{formatPrice(product.price_annual)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">{formatPrice(product.price_lifetime)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button asChild variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 min-h-[36px] min-w-[36px]">
                              <Link to={`/admin/produtos/${product.id}/editar`}><Edit className="h-4 w-4" /></Link>
                          </Button>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 min-h-[36px] min-w-[36px]">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto "{product.name}".
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(product.id)} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminGerenciarProdutos;
