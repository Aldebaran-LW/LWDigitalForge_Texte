// ========================================
// LWDIGITALFORGE - CREATE CHECKOUT
// Edge Function para criar sessão de checkout
// ========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter token de autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Autorização necessária" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validar usuário autenticado
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse do body
    const { appId, purchaseType } = await req.json();

    if (!appId || !purchaseType) {
      return new Response(
        JSON.stringify({ error: "appId e purchaseType são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Buscar informações do produto
    const { data: app, error: appError } = await supabase
      .from("registered_apps")
      .select("*")
      .eq("id", appId)
      .single();

    if (appError || !app) {
      return new Response(
        JSON.stringify({ error: "Produto não encontrado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determinar preço baseado no tipo de compra
    let amount = 0;
    switch (purchaseType) {
      case "MONTHLY":
        amount = app.price_monthly;
        break;
      case "ANNUAL":
        amount = app.price_annual;
        break;
      case "LIFETIME":
        amount = app.price_lifetime;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Tipo de compra inválido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Preço não disponível para este tipo" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Criar registro de compra pendente
    const { data: purchase, error: purchaseError } = await supabase
      .from("user_purchases")
      .insert([
        {
          user_id: user.id,
          app_id: appId,
          purchase_type: purchaseType,
          amount_paid: amount,
          status: "PENDING",
          expires_at: purchaseType === "LIFETIME" 
            ? null 
            : new Date(Date.now() + (purchaseType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000),
        },
      ])
      .select()
      .single();

    if (purchaseError) {
      console.error("Erro ao criar compra:", purchaseError);
      return new Response(
        JSON.stringify({ error: "Erro ao criar compra" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Integrar com gateway de pagamento (Mercado Pago, Stripe, etc)
    // Por enquanto, retorna apenas o ID da compra
    // Em produção, você deve criar uma sessão de checkout no gateway escolhido

    return new Response(
      JSON.stringify({
        success: true,
        purchaseId: purchase.id,
        message: "Compra criada com sucesso. Aguardando pagamento.",
        // TODO: Adicionar checkout_url do gateway de pagamento
        // checkout_url: "https://gateway.com/checkout/session_id"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno do servidor" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

