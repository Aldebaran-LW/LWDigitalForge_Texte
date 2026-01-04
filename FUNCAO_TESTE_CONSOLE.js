/**
 * Função Helper para Testar Assinatura no Console do Navegador
 * 
 * Cole este código no Console do navegador (F12) e use:
 * 
 * testarAssinatura('user-id', 'email@exemplo.com')
 */

async function testarAssinatura(userId, email) {
  try {
    console.log('🔍 Verificando assinatura...');
    console.log('User ID:', userId);
    console.log('Email:', email);
    console.log('');
    
    const response = await fetch(
      'https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      }
    );
    
    const data = await response.json();
    
    console.log('═══════════════════════════════════════');
    console.log('📊 RESULTADO DA VERIFICAÇÃO');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('✅ Tem acesso?', data.hasAccess ? 'SIM' : 'NÃO');
    console.log('💳 É assinante?', data.isSubscriber ? 'SIM' : 'NÃO');
    console.log('🧪 Está em trial?', data.isTrial ? 'SIM' : 'NÃO');
    console.log('📅 Status:', data.subscriptionStatus);
    console.log('');
    
    if (data.expiresAt) {
      const expiresDate = new Date(data.expiresAt);
      console.log('⏰ Assinatura expira em:', expiresDate.toLocaleString('pt-BR'));
    }
    
    if (data.trialExpiresAt) {
      const trialExpiresDate = new Date(data.trialExpiresAt);
      console.log('🧪 Trial expira em:', trialExpiresDate.toLocaleString('pt-BR'));
      if (data.daysRemaining !== null && data.daysRemaining !== undefined) {
        console.log('📆 Dias restantes:', data.daysRemaining);
      }
    }
    
    if (data.message) {
      console.log('💬 Mensagem:', data.message);
    }
    
    console.log('');
    console.log('📋 Dados completos:');
    console.log(JSON.stringify(data, null, 2));
    console.log('═══════════════════════════════════════');
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error);
    return null;
  }
}

// Função para obter dados do usuário atual (se logado)
async function obterMeusDados() {
  try {
    // Assumindo que supabase está disponível globalmente
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase não está disponível. Faça login primeiro.');
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
    
    console.log('👤 Seus dados:');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('');
    console.log('💡 Use: testarAssinatura("' + user.id + '", "' + user.email + '")');
    
    return { userId: user.id, email: user.email };
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

// Exemplo de uso:
console.log('✅ Funções carregadas!');
console.log('');
console.log('📝 Como usar:');
console.log('1. testarAssinatura("user-id", "email@exemplo.com")');
console.log('2. obterMeusDados() - para pegar seus dados (se logado)');
console.log('');

