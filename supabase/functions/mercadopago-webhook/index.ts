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

    const createAdminAlert = async (params: {
      source: string;
      severity: "INFO" | "WARN" | "ERROR" | "CRITICAL";
      title: string;
      message: string;
      solution?: string;
      related_user_id?: string;
      related_purchase_id?: string;
      meta?: Record<string, unknown>;
    }) => {
      try {
        await supabase.from("admin_alerts").insert({
          source: params.source,
          severity: params.severity,
          title: params.title,
          message: params.message,
          solution: params.solution ?? null,
          related_user_id: params.related_user_id ?? null,
          related_purchase_id: params.related_purchase_id ?? null,
          meta: params.meta ?? {},
        });
      } catch (_e) {
        // Não falhar o webhook por erro de logging.
      }
    };

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
      await createAdminAlert({
        source: "supabase-edge:mercadopago-webhook",
        severity: "ERROR",
        title: "Falha ao atualizar compra após webhook do Mercado Pago",
        message: updateError.message,
        solution:
          "Verifique se a tabela `user_purchases` existe e se as colunas `status`, `payment_id` e `expires_at` estão corretas. Confirme também `SUPABASE_SERVICE_ROLE_KEY` e o acesso ao banco.",
        related_user_id: purchase?.user_id,
        related_purchase_id: purchaseId,
        meta: { mpStatus, paymentId },
      });
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar compra" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sincronizar "direito de acesso" na tabela user_product_access (idempotente)
    if (purchase?.user_id && purchase?.app_id) {
      const accessLevel =
        purchase.purchase_type === "LIFETIME"
          ? "lifetime"
          : purchase.purchase_type === "ANNUAL"
            ? "annual"
            : purchase.purchase_type === "MONTHLY"
              ? "monthly"
              : "trial";

      // Buscar nome do produto (opcional, para UX e auditoria)
      let productName: string | null = null;
      try {
        const { data: app } = await supabase
          .from("registered_apps")
          .select("name")
          .eq("id", purchase.app_id)
          .single();
        productName = app?.name ?? null;
      } catch (_e) {
        // ignore
      }

      if (purchaseStatus === "APPROVED") {
        const { error: accessError } = await supabase
          .from("user_product_access")
          .upsert(
            {
              user_id: purchase.user_id,
              product_id: purchase.app_id,
              product_name: productName,
              is_trial: false,
              status: "active",
              access_level: accessLevel,
              expires_at: updateData.expires_at ?? null,
              purchase_id: purchase.id,
              source: "PAYMENT",
            },
            { onConflict: "user_id,product_id,is_trial" }
          );

        if (accessError) {
          console.error("Erro ao conceder acesso (user_product_access):", accessError);
          await createAdminAlert({
            source: "supabase-edge:mercadopago-webhook",
            severity: "ERROR",
            title: "Pagamento aprovado, mas falha ao conceder acesso",
            message: accessError.message,
            solution:
              "Verifique a tabela `user_product_access` (RLS/constraints) e se o produto existe em `registered_apps`. Se necessário, conceda acesso manual via Admin > Usuários.",
            related_user_id: purchase.user_id,
            related_purchase_id: purchase.id,
            meta: { purchaseStatus, mpStatus, paymentId, app_id: purchase.app_id },
          });
        }
      } else if (purchaseStatus === "CANCELLED" || purchaseStatus === "REFUNDED") {
        const { error: revokeError } = await supabase
          .from("user_product_access")
          .upsert(
            {
              user_id: purchase.user_id,
              product_id: purchase.app_id,
              product_name: productName,
              is_trial: false,
              status: "revoked",
              access_level: accessLevel,
              expires_at: null,
              purchase_id: purchase.id,
              source: "PAYMENT",
              notes: `Acesso revogado automaticamente (status: ${purchaseStatus})`,
            },
            { onConflict: "user_id,product_id,is_trial" }
          );

        if (revokeError) {
          console.error("Erro ao revogar acesso (user_product_access):", revokeError);
          await createAdminAlert({
            source: "supabase-edge:mercadopago-webhook",
            severity: "WARN",
            title: "Falha ao revogar acesso após cancelamento/reembolso",
            message: revokeError.message,
            solution:
              "Verifique `user_product_access` e revogue manualmente no Admin > Usuários. Confirme se existe conflito de UNIQUE (user_id, product_id, is_trial).",
            related_user_id: purchase.user_id,
            related_purchase_id: purchase.id,
            meta: { purchaseStatus, mpStatus, paymentId, app_id: purchase.app_id },
          });
        }
      } else if (purchaseStatus === "PENDING") {
        // opcional: marcar como pending no acesso (mantém UX coerente)
        await supabase
          .from("user_product_access")
          .upsert(
            {
              user_id: purchase.user_id,
              product_id: purchase.app_id,
              product_name: productName,
              is_trial: false,
              status: "pending",
              access_level: accessLevel,
              expires_at: updateData.expires_at ?? null,
              purchase_id: purchase.id,
              source: "PAYMENT",
            },
            { onConflict: "user_id,product_id,is_trial" }
          );
      }
    }

    // Opcional: avisar n8n (se configurado) para automações/alertas externos
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_PAYMENT_EVENT_URL");
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "payment",
            purchaseId,
            paymentId: paymentId.toString(),
            mpStatus,
            status: purchaseStatus,
            userId: purchase?.user_id,
            appId: purchase?.app_id,
          }),
        });
      } catch (_e) {
        // ignore
      }
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






