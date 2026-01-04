// ========================================
// LWDIGITALFORGE - CHECK SUBSCRIPTION
// Edge Function para verificar status de assinatura e trial do usuário
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

    // Obter dados do body
    const body = await req.json();
    const { userId, email } = body;

    // Validação dos campos obrigatórios
    if (!userId || !email) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "userId e email são obrigatórios",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Email inválido",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verificar se o usuário existe e o email corresponde
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({
          hasAccess: false,
          isSubscriber: false,
          isTrial: false,
          subscriptionStatus: "none",
          message: "Usuário não encontrado ou email não corresponde",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const now = new Date();

    // 1. Verificar assinaturas ativas (user_purchases)
    // Buscar compras aprovadas (MONTHLY, ANNUAL ou LIFETIME)
    const { data: activePurchases, error: purchasesError } = await supabase
      .from("user_purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "APPROVED")
      .in("purchase_type", ["MONTHLY", "ANNUAL", "LIFETIME"]);

    let isSubscriber = false;
    let expiresAt: string | null = null;
    let subscriptionStatus = "none";

    if (!purchasesError && activePurchases && activePurchases.length > 0) {
      // Verificar se há alguma assinatura ativa
      // Priorizar LIFETIME (sempre ativo), depois pegar a que expira mais tarde
      let hasLifetime = false;
      let latestExpiringPurchase: any = null;
      let latestExpiresAt: Date | null = null;

      for (const purchase of activePurchases) {
        // LIFETIME sempre é ativo se aprovado
        if (purchase.purchase_type === "LIFETIME") {
          hasLifetime = true;
          break; // LIFETIME tem prioridade absoluta
        }
        // MONTHLY e ANNUAL precisam verificar expires_at
        else if (purchase.expires_at) {
          const purchaseExpiresAt = new Date(purchase.expires_at);
          if (purchaseExpiresAt > now) {
            // Pegar a assinatura que expira mais tarde
            if (!latestExpiresAt || purchaseExpiresAt > latestExpiresAt) {
              latestExpiresAt = purchaseExpiresAt;
              latestExpiringPurchase = purchase;
            }
          }
        }
      }

      if (hasLifetime) {
        isSubscriber = true;
        subscriptionStatus = "active";
        // Para LIFETIME, não há expires_at
      } else if (latestExpiringPurchase) {
        isSubscriber = true;
        subscriptionStatus = "active";
        expiresAt = latestExpiringPurchase.expires_at;
      }
    }

    // 2. Verificar trials ativos (user_trials)
    const { data: activeTrials, error: trialsError } = await supabase
      .from("user_trials")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .gt("expires_at", now.toISOString());

    let isTrial = false;
    let trialExpiresAt: string | null = null;
    let daysRemaining: number | null = null;

    if (!trialsError && activeTrials && activeTrials.length > 0) {
      // Pegar o trial mais recente (maior expires_at)
      const latestTrial = activeTrials.reduce((latest, current) => {
        const latestDate = new Date(latest.expires_at);
        const currentDate = new Date(current.expires_at);
        return currentDate > latestDate ? current : latest;
      });

      isTrial = true;
      trialExpiresAt = latestTrial.expires_at;
      const trialExpiresDate = new Date(latestTrial.expires_at);
      daysRemaining = Math.ceil(
        (trialExpiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    // Determinar status final
    if (isSubscriber) {
      subscriptionStatus = "active";
    } else if (isTrial) {
      subscriptionStatus = "trial";
    } else {
      subscriptionStatus = "none";
    }

    // hasAccess é true se o usuário tem assinatura OU trial ativo
    const hasAccess = isSubscriber || isTrial;

    // Montar resposta
    const response: any = {
      hasAccess,
      isSubscriber,
      isTrial,
      subscriptionStatus,
    };

    // Adicionar campos condicionais
    if (expiresAt) {
      response.expiresAt = expiresAt;
    }

    if (isTrial && trialExpiresAt) {
      response.trialExpiresAt = trialExpiresAt;
      response.daysRemaining = daysRemaining;
    }

    if (!hasAccess) {
      response.message = "Assinatura não encontrada ou expirada";
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Erro ao verificar assinatura no banco de dados",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

