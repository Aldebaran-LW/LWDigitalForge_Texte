import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, User, Mail, Calendar, Key, CheckCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importa o novo componente Input

const PortalMeuPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for password reset
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);

  // States for email change
  const [newEmail, setNewEmail] = useState('');
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState(null);

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

  const handlePasswordReset = async () => {
    if (!user) return;

    setPasswordResetLoading(true);
    setPasswordResetSuccess(false);
    setPasswordResetError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setPasswordResetLoading(false);

    if (error) {
      setPasswordResetError("Ocorreu um erro ao tentar enviar o e-mail de redefinição de senha. Por favor, tente novamente.");
    } else {
      setPasswordResetSuccess(true);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === user.email) {
      setEmailChangeError("Por favor, insira um novo endereço de e-mail.");
      return;
    }

    setEmailChangeLoading(true);
    setEmailChangeSuccess(false);
    setEmailChangeError(null);

    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/portal/meu-perfil` }
    );

    setEmailChangeLoading(false);

    if (error) {
      setEmailChangeError("Ocorreu um erro ao tentar alterar seu e-mail. Verifique o formato e tente novamente.");
    } else {
      setEmailChangeSuccess(true);
    }
  };

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
          return null;
      }
      
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="space-y-8">
                {/* Personal Info Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><User className="mr-2"/> Informações Pessoais</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Endereço de E-mail Atual</div>
                            <div className="flex items-center mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-900/50">
                                <Mail className="h-5 w-5 text-gray-400 mr-3"/>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
                            </div>
                        </div>
                        <div>
                             <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Membro Desde</div>
                            <div className="flex items-center mt-1">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3"/>
                                <p className="text-sm text-gray-600 dark:text-gray-300 pt-2">{formatDate(user.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Email Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 flex items-center"><Edit className="mr-2"/> Alterar E-mail</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Para alterar seu e-mail, digite o novo endereço abaixo. Um link de confirmação será enviado para o novo e-mail.
                  </p>
                  <form onSubmit={handleEmailChange} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Novo Endereço de E-mail</label>
                      <Input
                        id="new-email"
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="seu.novo.email@exemplo.com"
                      />
                    </div>
                    <Button type="submit" disabled={emailChangeLoading || emailChangeSuccess}>
                      {emailChangeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {emailChangeSuccess ? 'Verifique seu Novo E-mail' : 'Salvar Novo E-mail'}
                    </Button>
                  </form>
                  {emailChangeSuccess && (
                    <div className="mt-4 p-3 bg-green-100 dark:bg-green-500/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5"/>
                      <p className="text-sm">Um link de confirmação foi enviado para <strong>{newEmail}</strong>. Por favor, clique no link para validar seu novo endereço de e-mail.</p>
                    </div>
                  )}
                  {emailChangeError && (
                     <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-center">
                        <AlertTriangle className="mr-3 h-5 w-5"/>
                        <p className="text-sm">{emailChangeError}</p>
                      </div>
                  )}
                </div>
                
                {/* Security Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><Key className="mr-2"/> Segurança</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Para alterar sua senha, clique no botão abaixo. Enviaremos um link de redefinição para o seu e-mail.
                    </p>
                    <Button onClick={handlePasswordReset} disabled={passwordResetLoading || passwordResetSuccess}>
                      {passwordResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {passwordResetSuccess ? 'E-mail de Redefinição Enviado!' : 'Alterar Senha'}
                    </Button>
                    {passwordResetSuccess && (
                      <div className="mt-4 p-3 bg-green-100 dark:bg-green-500/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md flex items-center">
                        <CheckCircle className="mr-3 h-5 w-5"/>
                        <p className="text-sm">Um link para redefinição de senha foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada (e spam).</p>
                      </div>
                    )}
                    {passwordResetError && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-center">
                        <AlertTriangle className="mr-3 h-5 w-5"/>
                        <p className="text-sm">{passwordResetError}</p>
                      </div>
                    )}
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
