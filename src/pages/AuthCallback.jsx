import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Processando login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro no callback:', error);
          setStatus('error');
          setMessage(`Erro: ${error.message}. Redirecionando para login...`);
          toast({
            variant: 'destructive',
            title: 'Erro no Login',
            description: error.message,
          });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') { // Nenhum perfil encontrado
            console.log('Novo usuário do Google. Redirecionando para cadastro.');
            // Salvar dados do Google para pré-preencher o cadastro
            localStorage.setItem('google_signup_data', JSON.stringify({
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url,
            }));
            setStatus('success');
            setMessage('Quase lá! Complete seu cadastro...');
            toast({
              title: 'Bem-vindo!',
              description: 'Complete seu cadastro para acessar a plataforma.',
            });
            setTimeout(() => navigate('/cadastro'), 2000);
            return;
          } else if (profileError) {
            console.error('Erro ao buscar perfil:', profileError);
            setStatus('error');
            setMessage(`Erro ao carregar perfil: ${profileError.message}. Redirecionando para login...`);
            toast({
              variant: 'destructive',
              title: 'Erro de Perfil',
              description: profileError.message,
            });
            setTimeout(() => navigate('/login'), 3000);
            return;
          }

          const userRole = profile?.role || 'USER';
          const userName = profile?.full_name || session.user.email;

          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          toast({
            title: `Bem-vindo${userName ? `, ${userName}` : ''}!`,
            description: 'Você está sendo redirecionado para a plataforma.',
          });

          setTimeout(() => {
            if (userRole === 'ADMIN') {
              navigate('/admin/dashboard');
            } else {
              navigate('/portal/meus-produtos');
            }
          }, 1500);

        } else {
          setStatus('error');
          setMessage('Nenhuma sessão encontrada. Redirecionando para login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        setStatus('error');
        setMessage(`Erro inesperado: ${error.message}. Redirecionando para login...`);
        toast({
          variant: 'destructive',
          title: 'Erro Inesperado',
          description: error.message,
        });
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-[#111827]/50 rounded-lg shadow-xl">
        {renderContent()}
        <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
