import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * Componente que protege rotas de produtos/apps
 * Verifica se o usuário tem acesso (is_liberado ou trial/compra ativo)
 * Se não tiver acesso, redireciona para página de assinatura necessária
 */
const ProtectedProductRoute = ({ children, appId: propAppId }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const { id: urlAppId } = useParams(); // Pega appId da URL se disponível
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [appData, setAppData] = useState(null);

  // Determina qual appId usar (prop > url)
  const appId = propAppId || urlAppId;

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

        // 2. Verificar is_liberado no profile (mais rápido)
        if (profile?.is_liberado) {
          // Verificar se a data de vencimento ainda é válida (se não for LIFETIME)
          if (profile.data_vencimento) {
            const expiresAt = new Date(profile.data_vencimento);
            const now = new Date();
            if (expiresAt > now || expiresAt.toISOString() === '2099-01-01T00:00:00.000Z') {
              setHasAccess(true);
              setLoading(false);
              return;
            }
          } else {
            // Se is_liberado = true mas sem data_vencimento, pode ser LIFETIME
            setHasAccess(true);
            setLoading(false);
            return;
          }
        }

        // 3. Se is_liberado = false, verificar diretamente nas tabelas (verificação adicional)
        // Verificar compra LIFETIME
        const { data: lifetimePurchase } = await supabase
          .from('user_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('app_id', appId)
          .eq('purchase_type', 'LIFETIME')
          .eq('status', 'APPROVED')
          .limit(1)
          .single();

        if (lifetimePurchase) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Verificar compra MONTHLY/ANNUAL ativa
        const { data: activePurchase } = await supabase
          .from('user_purchases')
          .select('id, expires_at')
          .eq('user_id', user.id)
          .eq('app_id', appId)
          .eq('status', 'APPROVED')
          .in('purchase_type', ['MONTHLY', 'ANNUAL'])
          .gt('expires_at', new Date().toISOString())
          .limit(1)
          .single();

        if (activePurchase) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Verificar trial ativo
        const { data: activeTrial } = await supabase
          .from('user_trials')
          .select('id, expires_at')
          .eq('user_id', user.id)
          .eq('app_id', appId)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .limit(1)
          .single();

        if (activeTrial) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Se nenhuma verificação passou, não tem acesso
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

  // Se não tem acesso, mostrar página de assinatura necessária
  if (!hasAccess) {
    return <SubscriptionRequiredPage appData={appData} />;
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
