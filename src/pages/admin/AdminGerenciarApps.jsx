
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, GitBranch, Link as LinkIcon } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

const AdminGerenciarApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchApps = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registered_apps')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar aplicações', description: error.message });
    } else {
      setApps(data);
      setError(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleDelete = async (appId) => {
    const { error } = await supabase.from('registered_apps').delete().eq('id', appId);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir aplicação', description: error.message });
    } else {
      toast({ title: 'Aplicação excluída com sucesso!' });
      fetchApps(); // Recarrega a lista
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerenciar Aplicações - Admin</title>
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Aplicações</h1>
          <Button asChild>
            <Link to="/admin/aplicacoes/nova">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Aplicação
            </Link>
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin" /></div>
        ) : error ? (
           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold flex items-center"><AlertTriangle className="mr-2"/>Erro</p>
            <p>{error}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto"
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nome da Aplicação</th>
                  <th scope="col" className="px-6 py-3">Descrição</th>
                  <th scope="col" className="px-6 py-3">Links</th>
                  <th scope="col" className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-16 px-6">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Nenhuma aplicação encontrada</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Comece adicionando sua primeira aplicação para poder vinculá-la a um produto.</p>
                      <Button asChild>
                        <Link to="/admin/aplicacoes/nova">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Primeira Aplicação
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ) : apps.map((app, index) => (
                  <motion.tr 
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                       <div className="flex items-center">
                        {app.image_url && <img src={app.image_url} alt={app.name} className="w-8 h-8 rounded-full mr-3 object-cover"/>}
                        <span>{app.name}</span>
                      </div>
                    </th>
                    <td className="px-6 py-4 max-w-sm truncate">{app.description || '---'}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                            {app.github_repo_url && 
                                <a href={app.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <GitBranch className="h-5 w-5" />
                                </a>
                            }
                            {app.vercel_deployment_url && 
                                <a href={app.vercel_deployment_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <LinkIcon className="h-5 w-5" />
                                </a>
                            }
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button asChild variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                          <Link to={`/admin/aplicacoes/${app.id}/editar`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a aplicação "{app.name}".
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(app.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminGerenciarApps;
