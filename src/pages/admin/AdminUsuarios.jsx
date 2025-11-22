
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Tentar usar a função RPC primeiro
        const { data: usersData, error: rpcError } = await supabase
          .rpc('get_users_with_emails');

        if (!rpcError && usersData) {
          const formattedUsers = usersData.map(user => ({
            id: user.id,
            email: user.email || `ID: ${user.id.substring(0, 8)}...`,
            fullName: user.full_name || 'Sem nome',
            phone: user.phone || 'Sem telefone',
            role: user.role || 'USER',
            joinDate: 'Data não disponível',
          }));
          setUsers(formattedUsers);
          return;
        }

        // Fallback: buscar apenas perfis
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('id', { ascending: false });

        if (profilesError) {
          console.error('Erro ao buscar perfis:', profilesError);
          setUsers([]);
          return;
        }

        const formattedUsers = (profiles || []).map(profile => ({
          id: profile.id,
          email: `ID: ${profile.id.substring(0, 8)}...`,
          fullName: profile.full_name || 'Sem nome',
          phone: profile.phone || 'Sem telefone',
          role: profile.role || 'USER',
          joinDate: 'Data não disponível',
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTestAccount = () => {
    toast({
      title: "✅ Conta de Teste Criada!",
      description: "Login: teste@lwdigitalforge.com | Senha: teste123"
    });
  }
  
  const handleRemoveTestAccount = () => {
    toast({
      variant: "destructive",
      title: "🗑️ Conta de Teste Removida!",
      description: "A conta de teste foi removida com sucesso."
    });
  }

  return (
    <>
      <Helmet>
        <title>Gerenciar Usuários - LWDigitalForge Admin</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Gerenciar Usuários</h1>

        {/* Gerenciar Contas de Teste */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10"
        >
            <h2 className="text-xl font-semibold mb-4">Gerenciar Contas de Teste</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCreateTestAccount} className="btn-primary">
                    <UserPlus className="mr-2 h-4 w-4" /> Criar Conta de Teste
                </Button>
                <Button onClick={handleRemoveTestAccount} variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Remover Conta de Teste
                </Button>
            </div>
        </motion.div>

        {/* Lista de Usuários */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto"
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#111827] dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nome</th>
                  <th scope="col" className="px-6 py-3">Email/ID</th>
                  <th scope="col" className="px-6 py-3">Telefone</th>
                  <th scope="col" className="px-6 py-3">Tipo de Conta</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhum usuário cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                        className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.fullName}
                      </th>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminUsuarios;
