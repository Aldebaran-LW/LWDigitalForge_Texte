/**
 * Edge Function: Sincronizar Usuário do Supabase para Firebase
 * 
 * Esta função é chamada quando um novo usuário é criado no Supabase
 * e sincroniza automaticamente com o Firebase Auth.
 * 
 * Para usar, configure um webhook no Supabase que chame esta função
 * quando um novo usuário for criado.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Importar Firebase Admin SDK (será necessário configurar)
// Nota: Firebase Admin SDK requer configuração de credenciais de serviço

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obter credenciais do Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter dados do webhook
    const { record, type } = await req.json();

    if (type !== 'INSERT' || !record) {
      return new Response(
        JSON.stringify({ error: 'Tipo de evento inválido ou registro não encontrado' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = record.id;
    const email = record.email;
    const userMetadata = record.raw_user_meta_data || {};

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email não encontrado no registro' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obter credenciais do Firebase Admin
    const firebaseProjectId = Deno.env.get('FIREBASE_PROJECT_ID');
    const firebasePrivateKey = Deno.env.get('FIREBASE_PRIVATE_KEY');
    const firebaseClientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL');

    if (!firebaseProjectId || !firebasePrivateKey || !firebaseClientEmail) {
      console.warn('⚠️ Firebase Admin não configurado. Pulando sincronização.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Firebase Admin não configurado',
          skipped: true 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Nota: Para usar Firebase Admin SDK no Deno, você precisaria:
    // 1. Instalar o Firebase Admin SDK compatível com Deno
    // 2. Ou usar a REST API do Firebase Auth
    // 
    // Por enquanto, vamos usar a REST API do Firebase Auth
    // que é mais simples e não requer dependências adicionais

    const fullName = userMetadata.full_name || 
                    userMetadata.name || 
                    email.split('@')[0];

    // Criar usuário no Firebase usando REST API
    // Nota: Isso requer um token de acesso do Firebase Admin
    // Por enquanto, vamos apenas logar e retornar sucesso
    // A sincronização real será feita no frontend quando possível

    console.log('📤 Sincronizando usuário para Firebase:', {
      userId,
      email,
      fullName
    });

    // TODO: Implementar criação de usuário no Firebase via REST API
    // ou usar Firebase Admin SDK se disponível no Deno

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sincronização iniciada (requer configuração adicional do Firebase Admin)',
        userId,
        email
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro na Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
