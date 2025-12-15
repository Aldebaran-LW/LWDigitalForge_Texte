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
        // Supabase OAuth (padrão: PKCE) retorna com `?code=...` e precisa trocar por sessão.
        // Em alguns cenários (implicit flow / sessão já persistida), o code não existe.
        const url = new URL(window.location.href);
        const callbackError =
          url.searchParams.get('error_description') ||
          url.searchParams.get('error') ||
          null;

        if (callbackError) {
          const decoded = decodeURIComponent(callbackError);
          setStatus('error');
          setMessage(`Erro: ${decoded}. Redirecionando para login...`);
          toast({
            variant: 'destructive',
            title: 'Erro no Login',
            description: decoded,
          });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (url.searchParams.get('code')) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );

          if (exchangeError) {
            console.error('Erro ao trocar code por sessão:', exchangeError);
            setStatus('error');
            setMessage(
              `Erro: ${exchangeError.message}. Redirecionando para login...`
            );
            toast({
              variant: 'destructive',
              title: 'Erro no Login',
              description: exchangeError.message,
            });
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
        }

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
          // Primeiro, verificar se há um perfil
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .single();

          // Se não houver perfil, criar um automaticamente para usuários do Google
          // Isso é um fallback caso o trigger do banco não tenha funcionado
          if (profileError && profileError.code === 'PGRST116') {
            console.log('Novo usuário detectado. Criando perfil...');
            
            // Captura nome completo de múltiplas fontes (Google OAuth pode usar diferentes campos)
            const fullName = session.user.user_metadata?.full_name || 
                           session.user.user_metadata?.name ||
                           session.user.raw_user_meta_data?.full_name ||
                           session.user.raw_user_meta_data?.name ||
                           session.user.email?.split('@')[0] || 
                           'Usuário';
            
            // Captura avatar de múltiplas fontes
            const avatarUrl = session.user.user_metadata?.avatar_url || 
                            session.user.user_metadata?.picture ||
                            session.user.raw_user_meta_data?.avatar_url ||
                            session.user.raw_user_meta_data?.picture ||
                            null;
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                email: session.user.email,
                full_name: fullName,
                role: 'USER',
                avatar_url: avatarUrl
              }])
              .select()
              .single();

            if (createError) {
              console.error('Erro ao criar perfil:', createError);
              setStatus('error');
              setMessage(`Erro ao criar perfil: ${createError.message}. Redirecionando para login...`);
              toast({
                variant: 'destructive',
                title: 'Erro ao Criar Perfil',
                description: createError.message,
              });
              setTimeout(() => navigate('/login'), 3000);
              return;
            }
            
            profile = newProfile;
            toast({
              title: 'Perfil Criado!',
              description: 'Seu perfil foi criado com sucesso.',
            });
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
