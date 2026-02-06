/**
 * Hook para Verificação de Acesso via Portal - Ponto Diário (JornadaPro)
 * 
 * Este hook verifica se o usuário veio do portal principal e autentica automaticamente.
 * Se falhar ou não houver hash, o sistema de login normal continua funcionando.
 * 
 * ARQUIVO PRONTO PARA COPIAR
 * Copiar para: src/hooks/usePortalAuth.js
 * 
 * IMPORTANTE: Este hook é opcional e não invasivo. Se falhar, o login normal funciona.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // ⚠️ AJUSTAR: Verificar caminho do Supabase na aplicação

// ✅ CONFIGURADO: ID do produto JornadaPro (Ponto Diário)
const PRODUCT_ID = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';

// ✅ CONFIGURADO: Rota padrão (/apontamentos)
const DEFAULT_ROUTE = '/apontamentos';

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
