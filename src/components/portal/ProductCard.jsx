import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { startProductTrial } from '@/utils/trialHelpers';
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/**
 * Componente de Card de Produto para o Portal
 * Verifica se o usuário tem acesso e mostra o botão apropriado
 * @param {Object} props
 * @param {Object} props.app - Objeto do produto/app
 * @param {boolean} props.userHasAccess - Se o usuário já tem acesso (paid ou trial ativo)
 * @param {string} props.subscriptionType - Tipo de acesso: 'trial', 'subscription', 'lifetime', etc.
 */
export default function ProductCard({ app, userHasAccess = false, subscriptionType = null }) {
  const [loading, setLoading] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ 
          title: "Login necessário", 
          description: "Faça login para ativar o teste." 
        });
        return;
      }

      // Usar startProductTrial (função completa com validações)
      const result = await startProductTrial(
        user.id,
        app.id,
        app.name,
        app.trial_period_days || 30,
        user.email
      );

      if (result.success) {
        setTrialSuccess(true);
        toast({
          title: "Trial Ativado! 🚀",
          description: `Tem ${app.trial_period_days || 30} dias de acesso ao ${app.name}.`,
        });
        // Recarregar a página após 1.5s para atualizar o estado
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(result.message || 'Erro ao iniciar trial');
      }
    } catch (error) {
      const msg = error.message?.includes("unique_user_app_trial") || 
                  error.message?.includes("unique") ||
                  error.message?.includes("já utilizou")
        ? "Já utilizou o seu período de teste para este produto." 
        : error.message || 'Erro ao iniciar trial';
        
      toast({
        variant: "destructive",
        title: "Não foi possível ativar",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Determinar se deve mostrar botão "Entrar no App"
  const hasAccess = userHasAccess || trialSuccess;

  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold">{app.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {app.description || 'Sem descrição disponível'}
        </p>
      </div>

      <div className="space-y-3">
        {/* CASO 1: UTILIZADOR JÁ TEM ACESSO (PAID OU TRIAL ATIVO) */}
        {hasAccess ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              if (app.vercel_deployment_url) {
                window.open(app.vercel_deployment_url, '_blank');
              } else {
                toast({
                  variant: "destructive",
                  title: "URL não disponível",
                  description: "URL do aplicativo não está configurada.",
                });
              }
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" /> Entrar no App
          </Button>
        ) : (
          /* CASO 2: UTILIZADOR NÃO TEM ACESSO AINDA */
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleStartTrial}
              disabled={loading}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4 mr-2" />
              )}
              Testar Grátis
            </Button>
            
            <Button 
              onClick={() => {
                // Redirecionar para página de checkout ou detalhes do produto
                if (app.slug) {
                  window.location.href = `/checkout/${app.slug}`;
                } else {
                  window.location.href = `/product/${app.id}`;
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Comprar
            </Button>
          </div>
        )}
      </div>
      
      {/* Indicador de Trial Ativo */}
      {subscriptionType === 'trial' && (
        <p className="text-[10px] text-orange-500 mt-2 text-center font-medium">
          Modo Trial Ativo - {app.trial_period_days || 30} dias
        </p>
      )}
    </div>
  );
}
