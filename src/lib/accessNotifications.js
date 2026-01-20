import { supabase } from './customSupabaseClient';

/**
 * Cria uma notificação na tabela contact_messages quando acesso é negado
 * @param {string} userId - ID do usuário
 * @param {string} reason - Motivo da negação de acesso
 * @param {string} appName - Nome da aplicação
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function createAccessDeniedNotification(userId, reason, appName = 'JornadaPro') {
  try {
    let subject = 'Acesso Negado';
    let message = '';

    if (reason?.includes('trial expirado') || reason?.toLowerCase().includes('trial')) {
      subject = 'Período de Teste Expirado';
      message = `Seu período de teste para ${appName} expirou. Para continuar usando, você precisa adquirir uma assinatura. Acesse o portal para ver os planos disponíveis.`;
    } else if (reason?.includes('assinatura') || reason?.includes('subscription')) {
      subject = 'Renovação de Assinatura Necessária';
      message = `Sua assinatura para ${appName} expirou ou precisa ser renovada. Acesse o portal para renovar sua assinatura e continuar usando o aplicativo.`;
    } else if (reason?.includes('admin') || reason?.includes('revogado')) {
      subject = 'Acesso Revogado pelo Administrador';
      message = `O acesso ao ${appName} foi revogado. Entre em contato com o suporte para mais informações.`;
    } else if (reason?.includes('nenhuma compra') || reason?.includes('nenhum')) {
      subject = 'Acesso Negado - Assinatura Necessária';
      message = `Você não possui uma assinatura ativa para ${appName}. Acesse o portal para adquirir um plano e começar a usar o aplicativo.`;
    } else {
      subject = 'Acesso Negado';
      message = `Não foi possível conceder acesso ao ${appName}. ${reason || 'Entre em contato com o suporte para mais informações.'}`;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil para notificação:', profileError);
    }

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        user_id: userId,
        name: profile?.full_name || 'Usuário',
        email: profile?.email || '',
        subject,
        message,
        status: 'PENDING',
      });

    if (insertError) {
      console.error('Erro ao criar notificação:', insertError);
      return { success: false, error: insertError.message };
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar notificação de acesso negado:', error);
    return { success: false, error: error.message };
  }
}
