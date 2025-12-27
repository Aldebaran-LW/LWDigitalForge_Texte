// ========================================
// LWDIGITALFORGE - MERCADOPAGO WEBHOOK
// Edge Function para receber notificações do Mercado Pago
// ========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { MercadoPagoConfig, Payment } from "npm:mercadopago@2.1.1";

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

    // Obter dados da notificação
    const body = await req.json();
    const { type, data } = body;

    // Mercado Pago envia notificações de diferentes tipos
    // Estamos interessados em "payment" quando o status muda
    if (type !== "payment") {
      return new Response(
        JSON.stringify({ message: "Tipo de notificação não processado" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: "ID do pagamento não fornecido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Configurar Mercado Pago para buscar detalhes do pagamento
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
    const payment = new Payment(client);

    // Buscar detalhes do pagamento no Mercado Pago
    const paymentData = await payment.get({ id: paymentId });

    if (!paymentData) {
      return new Response(
        JSON.stringify({ error: "Pagamento não encontrado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obter external_reference (ID da compra na nossa tabela)
    const purchaseId = paymentData.external_reference;
    if (!purchaseId) {
      console.error("external_reference não encontrado no pagamento");
      return new Response(
        JSON.stringify({ error: "Referência externa não encontrada" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Mapear status do Mercado Pago para nosso sistema
    const mpStatus = paymentData.status;
    let purchaseStatus = "PENDING";

    switch (mpStatus) {
      case "approved":
        purchaseStatus = "APPROVED";
        break;
      case "cancelled":
      case "rejected":
        purchaseStatus = "CANCELLED";
        break;
      case "refunded":
      case "charged_back":
        purchaseStatus = "REFUNDED";
        break;
      case "pending":
      case "in_process":
      case "in_mediation":
        purchaseStatus = "PENDING";
        break;
      default:
        purchaseStatus = "PENDING";
    }

    // Buscar a compra no banco de dados
    const { data: purchase, error: purchaseError } = await supabase
      .from("user_purchases")
      .select("*")
      .eq("id", purchaseId)
      .single();

    if (purchaseError || !purchase) {
      console.error("Erro ao buscar compra:", purchaseError);
      return new Response(
        JSON.stringify({ error: "Compra não encontrada" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Atualizar status da compra
    const updateData: any = {
      status: purchaseStatus,
      payment_id: paymentId.toString(),
      updated_at: new Date().toISOString(),
    };

    // Se o pagamento foi aprovado e é uma assinatura, atualizar expires_at
    if (purchaseStatus === "APPROVED" && purchase.purchase_type !== "LIFETIME") {
      const now = new Date();
      let expiresAt = new Date();

      if (purchase.purchase_type === "MONTHLY") {
        expiresAt.setMonth(now.getMonth() + 1);
      } else if (purchase.purchase_type === "ANNUAL") {
        expiresAt.setFullYear(now.getFullYear() + 1);
      }

      updateData.expires_at = expiresAt.toISOString();
    }

    // Se foi reembolsado ou cancelado, limpar expires_at
    if (purchaseStatus === "REFUNDED" || purchaseStatus === "CANCELLED") {
      updateData.expires_at = null;
    }

    const { error: updateError } = await supabase
      .from("user_purchases")
      .update(updateData)
      .eq("id", purchaseId);

    if (updateError) {
      console.error("Erro ao atualizar compra:", updateError);
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar compra" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      `Compra ${purchaseId} atualizada para status: ${purchaseStatus}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        purchaseId,
        status: purchaseStatus,
        message: "Compra atualizada com sucesso",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
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







