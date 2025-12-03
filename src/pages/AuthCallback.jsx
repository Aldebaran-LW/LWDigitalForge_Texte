import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automaticamente processa o callback e estabelece a sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro no callback:', error);
          navigate('/login');
          return;
        }

        if (session) {
          // Verificar o perfil do usuário para determinar o redirecionamento
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const userRole = profile?.role || 'USER';
          
          if (userRole === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/portal/meus-produtos');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">Processando login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

