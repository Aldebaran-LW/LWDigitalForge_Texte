
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, User, Mail, Calendar, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PortalMeuPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Erro ao carregar sua sessão.");
      } else if (!session?.user) {
        setError("Nenhum usuário logado encontrado.");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };
  
  const renderProfile = () => {
      if (loading) {
          return <div className="flex justify-center items-center h-48"><Loader2 className="h-12 w-12 animate-spin text-blue-500" /></div>;
      }
      
      if (error) {
          return (
              <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center">
                  <AlertTriangle className="mr-3 h-6 w-6"/>
                  <p>{error}</p>
              </div>
          );
      }
      
      if (!user) {
          return null; // ou uma mensagem mais específica
      }
      
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="space-y-8">
                {/* Seção de Informações Pessoais */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><User className="mr-2"/> Informações Pessoais</h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Endereço de E-mail</Label>
                            <div className="flex items-center mt-1">
                                <Mail className="h-5 w-5 text-gray-400 mr-3"/>
                                <Input id="email" type="email" value={user.email} disabled className="cursor-not-allowed"/>
                            </div>
                        </div>
                        <div>
                            <Label>Membro Desde</Label>
                            <div className="flex items-center mt-1">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3"/>
                                <p className="text-sm text-gray-600 dark:text-gray-300 pt-2">{formatDate(user.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Seção de Segurança */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><Key className="mr-2"/> Segurança</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Para alterar sua senha, clique no botão abaixo. Enviaremos um link de redefinição para o seu e-mail.
                    </p>
                     {/* Lógica de redefinição de senha a ser implementada aqui */}
                    <Button disabled>Alterar Senha (em breve)</Button>
                </div>
            </div>
        </motion.div>
      );
  };

  return (
    <>
      <Helmet>
        <title>Meu Perfil - Portal LWDigitalForge</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Meu Perfil</h1>
        {renderProfile()}
      </div>
    </>
  );
};

export default PortalMeuPerfil;
