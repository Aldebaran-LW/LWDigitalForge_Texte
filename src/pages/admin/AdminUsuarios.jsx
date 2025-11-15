
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Esta função busca os usuários da tabela de autenticação do Supabase.
// Requer privilégios de administrador e, por segurança, é executada numa Edge Function.
const fetchAllUsers = async () => {
  const { data, error } = await supabase.functions.invoke('get-all-users');
  if (error) throw error;
  return data.users;
}

const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar usuários', description: error.message });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTestAccountAction = async (action) => {
    setIsSubmitting(true);
    try {
        const { data, error } = await supabase.functions.invoke(action);
        
        if (error) throw error;

        toast({
            title: action === 'create-test-user' ? '✅ Conta de Teste Criada!' : '🗑️ Conta de Teste Removida!',
            description: data.message,
        });
        
        fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
        toast({
            variant: "destructive",
            title: 'Ocorreu um erro',
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Gerenciar Usuários</h1>

      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      >
          <h2 className="text-xl font-semibold mb-4">Gerenciar Conta de Teste</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Crie ou remova uma conta de teste para verificar o fluxo de compra e acesso ao portal do cliente.</p>
          <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleTestAccountAction('create-test-user')} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />} 
                  Criar Conta de Teste
              </Button>
              <Button onClick={() => handleTestAccountAction('delete-test-user')} variant="destructive" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} 
                  Remover Conta de Teste
              </Button>
          </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin text-blue-500" /></div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
            <p className="font-bold flex items-center"><AlertTriangle className="mr-2"/>Erro</p>
            <p>{error}</p>
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Email do Usuário</th>
                <th scope="col" className="px-6 py-3">Data de Cadastro</th>
                 <th scope="col" className="px-6 py-3">ID do Usuário</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</td>
                  </tr>
              ) : users.map((user, index) => (
                <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.email}</th>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4 font-mono text-xs">{user.id}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsuarios;
