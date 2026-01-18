import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { checkAccessViaN8N, createAccessDeniedNotification } from '@/lib/n8nAccessCheck';

/**
 * Componente que protege rotas de produtos/apps
 * Verifica se o usuário tem acesso (is_liberado ou trial/compra ativo)
 * Se não tiver acesso, redireciona para página de assinatura necessária
 */
const ProtectedProductRoute = ({ children, appId: propAppId }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id: urlAppId } = useParams(); // Pega appId da URL se disponível
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [appData, setAppData] = useState(null);

  // Determina qual appId usar (prop > url > sessionStorage)
  const appId = propAppId || urlAppId || (typeof window !== 'undefined' ? sessionStorage.getItem('app_product_id') : null);

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading || !user) {
        setLoading(true);
        return;
      }

      if (!appId) {
        console.error('ProtectedProductRoute: appId não fornecido');
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // 1. Buscar dados do app
        const { data: app, error: appError } = await supabase
          .from('registered_apps')
          .select('id, name, is_active')
          .eq('id', appId)
          .single();

        if (appError || !app || !app.is_active) {
          console.error('App não encontrado ou inativo:', appError);
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setAppData(app);

        // 2. Verificar acesso via webhook n8n (fonte da verdade)
        const accessCheck = await checkAccessViaN8N(user.id, appId);

        if (accessCheck.hasAccess) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // 3. Se não tem acesso, criar notificação e redirecionar
        await createAccessDeniedNotification(
          user.id,
          accessCheck.reason || 'Acesso negado',
          app.name
        );

        setHasAccess(false);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, profile, appId, authLoading]);

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se não tem acesso, redirecionar para portal/produtos conforme especificado
  if (!hasAccess) {
    // Redirecionar para página de produtos (conforme especificado)
    navigate('/portal/produtos', { replace: true });
    return null; // Não renderizar nada durante o redirecionamento
  }

  // Se tem acesso, renderizar o conteúdo
  return children;
};

/**
 * Página de "Assinatura Necessária"
 */
const SubscriptionRequiredPage = ({ appData }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-4">
            <Lock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Assinatura Necessária
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {appData
            ? `Você precisa de uma assinatura ativa para acessar ${appData.name}.`
            : 'Você precisa de uma assinatura ativa para acessar este produto.'}
        </p>

        <div className="space-y-3">
          <Link to="/portal/assinaturas">
            <Button className="w-full">
              Ver Assinaturas Disponíveis
            </Button>
          </Link>

          <Link to="/portal/produtos">
            <Button variant="outline" className="w-full">
              Ver Todos os Produtos
            </Button>
          </Link>

          <Link to="/portal/dashboard">
            <Button variant="ghost" className="w-full">
              Voltar para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProtectedProductRoute;
