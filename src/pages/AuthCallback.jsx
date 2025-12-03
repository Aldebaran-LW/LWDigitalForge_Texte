import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Processando autenticação...');
        
        // Supabase automaticamente processa o callback e estabelece a sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro no callback:', error);
          setStatus('error');
          toast({
            variant: "destructive",
            title: "Erro no Login",
            description: "Não foi possível completar o login. Tente novamente.",
          });
          
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (session) {
          console.log('AuthCallback: Sessão estabelecida para', session.user.email);
          setStatus('success');
          
          // Verificar o perfil do usuário para determinar o redirecionamento
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .single();

          const userRole = profile?.role || 'USER';
          const userName = profile?.full_name || session.user.email?.split('@')[0];
          
          toast({
            title: `Bem-vindo, ${userName}!`,
            description: "Login realizado com sucesso! Redirecionando...",
          });
          
          // Pequeno delay para mostrar o toast
          setTimeout(() => {
            if (userRole === 'ADMIN') {
              console.log('AuthCallback: Redirecionando para /admin/dashboard');
              navigate('/admin/dashboard');
            } else {
              console.log('AuthCallback: Redirecionando para /portal/meus-produtos');
              navigate('/portal/meus-produtos');
            }
          }, 1500);
        } else {
          console.log('AuthCallback: Nenhuma sessão encontrada');
          setStatus('error');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro inesperado. Tente novamente.",
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {status === 'processing' && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Processando login...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Aguarde um momento</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Login realizado com sucesso!</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Redirecionando...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">✕</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Erro no login</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Redirecionando...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

