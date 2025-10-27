
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const users = [
  { id: 1, email: 'user1@example.com', joinDate: '2025-10-22' },
  { id: 2, email: 'user2@example.com', joinDate: '2025-10-21' },
  { id: 3, email: 'user3@example.com', joinDate: '2025-10-20' },
  { id: 4, email: 'teste@lwdigitalforge.com', joinDate: '2025-10-19', isTest: true },
];

const AdminUsuarios = () => {

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
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto"
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#111827] dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Email do Usuário</th>
                <th scope="col" className="px-6 py-3">Data de Cadastro</th>
                <th scope="col" className="px-6 py-3">Tipo de Conta</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                    className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.email}
                  </th>
                  <td className="px-6 py-4">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    {user.isTest ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Teste
                        </span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Usuário
                        </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </>
  );
};

export default AdminUsuarios;
