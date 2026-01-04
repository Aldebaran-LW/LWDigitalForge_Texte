/**
 * EXEMPLO: Como adicionar verificação de acesso em um app web
 * 
 * Copie este código para o componente principal do seu app
 */

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase'; // Configure seu cliente Supabase

// IMPORTANTE: Configure o ID do produto
const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID || 'uuid-do-produto-aqui';

function App() {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar se usuário está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        verifyAccess(session.user.id);
      } else {
        setLoading(false);
        setHasAccess(false);
      }
    });

    // 2. Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        verifyAccess(session.user.id);
      } else {
        setUser(null);
        setHasAccess(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyAccess = async (userId) => {
    try {
      setLoading(true);

      // Verificar assinatura/compra para este produto
      const { data: purchase } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('app_id', PRODUCT_ID)
        .eq('status', 'APPROVED')
        .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
        .single();

      if (purchase) {
        // Verificar se não expirou (para MONTHLY/ANNUAL)
        if (purchase.purchase_type === 'LIFETIME' || 
            (purchase.expires_at && new Date(purchase.expires_at) > new Date())) {
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }

      // Verificar compra específica (não assinatura)
      const { data: specificPurchase } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('app_id', PRODUCT_ID)
        .eq('status', 'APPROVED')
        .neq('purchase_type', 'MONTHLY')
        .neq('purchase_type', 'ANNUAL')
        .neq('purchase_type', 'LIFETIME')
        .single();

      if (specificPurchase) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Verificar trial ativo
      const { data: trial } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', userId)
        .eq('app_id', PRODUCT_ID)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (trial) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Sem acesso
      setHasAccess(false);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setHasAccess(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem acesso a este aplicativo. Por favor, verifique sua assinatura ou entre em contato com o suporte.
          </p>
          <a
            href="https://seu-portal.com/portal/assinaturas"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Ver Assinaturas
          </a>
        </div>
      </div>
    );
  }

  // Seu app normal aqui
  return (
    <div>
      {/* Conteúdo do seu app */}
      <h1>Bem-vindo ao App!</h1>
    </div>
  );
}

export default App;

