/**
 * Hook para Verificação de Acesso via Portal
 * 
 * Este hook verifica se o usuário veio do portal principal e autentica automaticamente.
 * Se falhar ou não houver hash, o sistema de login normal continua funcionando.
 * 
 * USO:
 * import { usePortalAuth } from '@/hooks/usePortalAuth';
 * 
 * function App() {
 *   const { isChecking } = usePortalAuth();
 *   // ... resto do código
 * }
 * 
 * IMPORTANTE: Este hook é opcional e não invasivo. Se falhar, o login normal funciona.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // Ajustar caminho conforme necessário

// ⚠️ CONFIGURAR: ID do produto desta aplicação
const PRODUCT_ID = 'SUBSTITUIR_PELO_ID_DO_PRODUTO'; // Ex: '0cb79942-0696-4c43-bae4-d2acc46804cd'

// ⚠️ CONFIGURAR: Rota padrão da aplicação (onde redirecionar após autenticação do portal)
const DEFAULT_ROUTE = '/'; // Ex: '/apontamentos' para JornadaPro, '/' para StockForge

/**
 * Hook opcional para verificar se veio do portal
 * Se funcionar, autentica automaticamente
 * Se falhar, retorna false e o sistema de login normal continua
 */
export function usePortalAuth() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [cameFromPortal, setCameFromPortal] = useState(false);

  useEffect(() => {
    checkPortalAuth();
  }, []);

  async function checkPortalAuth() {
    try {
      const hash = window.location.hash;
      
      // Se não tem hash do portal, não fazer nada (usar login normal)
      if (!hash.includes('#auth=')) {
        setIsChecking(false);
        return;
      }

      const cameFromPortal = await handlePortalAuth(hash);
      
      if (cameFromPortal) {
        setCameFromPortal(true);
        // Limpar hash da URL
        window.history.replaceState(null, '', window.location.pathname);
        // Se está na raiz, redirecionar para rota padrão
        if (window.location.pathname === '/') {
          navigate(DEFAULT_ROUTE);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação do portal:', error);
      // Se falhar, não fazer nada - deixar login normal funcionar
    } finally {
      setIsChecking(false);
    }
  }

  async function handlePortalAuth(hash) {
    try {
      const encodedAuth = hash.split('#auth=')[1];
      const authData = JSON.parse(atob(encodedAuth));
      
      // Verificar se veio do portal
      if (authData.from !== 'portal') {
        return false;
      }
      
      // Validar timestamp (5 minutos)
      const maxAge = 5 * 60 * 1000;
      if (Date.now() - authData.timestamp > maxAge) {
        console.warn('Token do portal expirado');
        return false;
      }
      
      // Autenticar no Supabase
      const { error } = await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: ''
      });
      
      if (error) {
        console.error('Erro ao autenticar com token do portal:', error);
        return false;
      }
      
      // Verificar se o product_id corresponde
      if (authData.product_id !== PRODUCT_ID) {
        console.warn('Product ID não corresponde');
        return false;
      }
      
      return true; // Sucesso - autenticado via portal
    } catch (error) {
      console.error('Erro ao processar hash do portal:', error);
      return false;
    }
  }

  return { isChecking, cameFromPortal };
}
