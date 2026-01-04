// ========================================
// LWDIGITALFORGE - CREATE CHECKOUT
// Edge Function para criar checkout sessions do Mercado Pago
// ========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { MercadoPagoConfig, Preference } from "npm:mercadopago@2.1.1";

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

    // Obter token de autenticação do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verificar usuário autenticado
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obter dados do body
    const { appId, purchaseType } = await req.json();

    if (!appId) {
      return new Response(
        JSON.stringify({ error: "appId é obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Buscar informações do produto/app
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
    let price = app.price_lifetime || 0;
    if (purchaseType === "MONTHLY" && app.price_monthly) {
      price = app.price_monthly;
    } else if (purchaseType === "ANNUAL" && app.price_annual) {
      price = app.price_annual;
    }

    if (!price || price <= 0) {
      return new Response(
        JSON.stringify({ error: "Preço não configurado para este tipo de compra" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Configurar Mercado Pago
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      console.error("MERCADOPAGO_ACCESS_TOKEN não configurado");
      return new Response(
        JSON.stringify({ error: "Configuração de pagamento não disponível" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Criar registro de compra pendente PRIMEIRO para obter o ID
    const { data: purchase, error: purchaseError } = await supabase
      .from("user_purchases")
      .insert({
        user_id: user.id,
        app_id: appId,
        purchase_type: purchaseType,
        status: "PENDING",
        amount: price,
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      console.error("Erro ao criar registro de compra:", purchaseError);
      return new Response(
        JSON.stringify({ error: "Erro ao criar registro de compra" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Criar preferência de pagamento com external_reference = purchase.id
    const origin = req.headers.get("origin") || "https://lwdigitalforge.com";
    const preferenceData = {
      items: [
        {
          title: app.name,
          quantity: 1,
          unit_price: price,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: user.email || "",
      },
      back_urls: {
        success: `${origin}/success`,
        failure: `${origin}/carrinho`,
        pending: `${origin}/success`,
      },
      auto_return: "approved",
      external_reference: purchase.id, // ID da compra para o webhook identificar
      notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
    };

    const { id: preferenceId } = await preference.create({ body: preferenceData });

    // Atualizar compra com preference_id
    await supabase
      .from("user_purchases")
      .update({ preference_id: preferenceId })
      .eq("id", purchase.id);

    return new Response(
      JSON.stringify({
        preferenceId,
        purchaseId: purchase?.id,
        message: "Checkout criado com sucesso",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro no create-checkout:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Erro interno do servidor",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});





