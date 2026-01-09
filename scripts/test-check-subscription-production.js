/**
 * Script de Teste: API check-subscription (Produção)
 * 
 * Este script testa a Edge Function check-subscription diretamente em produção
 * Útil quando não há ambiente local configurado
 * 
 * Execute com: node scripts/test-check-subscription-production.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuração - URL de produção
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

// URL da Edge Function em produção
const EDGE_FUNCTION_URL = `${supabaseUrl}/functions/v1/check-subscription`;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n🧪 Teste: ${name}`, 'cyan');
  log('─'.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Chama a Edge Function check-subscription
 * ⚠️ IMPORTANTE: Agora exige appId (sistema híbrido)
 */
async function callCheckSubscription(userId, email, appId = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432') {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email, appId }),
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, data: null, error: error.message };
  }
}

/**
 * Teste 1: Validação - userId ausente
 */
async function testMissingUserId() {
  logTest('Validação: userId ausente');
  
  const result = await callCheckSubscription(null, 'test@example.com', 'e8ff7872-dedb-405c-bf8a-f7901ac4b432');
  
  if (result.status === 400 && result.data?.error === 'Bad Request') {
    logSuccess('Retornou 400 Bad Request');
    logInfo(`Mensagem: ${result.data.message}`);
    return true;
  } else {
    logError(`Esperado 400, recebido ${result.status}`);
    if (result.data) logInfo(`Resposta: ${JSON.stringify(result.data, null, 2)}`);
    return false;
  }
}

/**
 * Teste 1b: Validação - appId ausente (NOVO)
 */
async function testMissingAppId() {
  logTest('Validação: appId ausente (NOVO - Sistema Híbrido)');
  
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com'
        // appId ausente propositalmente
      }),
    });

    const data = await response.json();
    
    if (response.status === 400 && data?.error === 'Bad Request' && data?.message?.includes('appId')) {
      logSuccess('Retornou 400 Bad Request para appId ausente');
      logInfo(`Mensagem: ${data.message}`);
      return true;
    } else {
      logError(`Esperado 400, recebido ${response.status}`);
      logInfo(`Resposta: ${JSON.stringify(data, null, 2)}`);
      return false;
    }
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Validação - email ausente
 */
async function testMissingEmail() {
  logTest('Validação: email ausente');
  
  const result = await callCheckSubscription('550e8400-e29b-41d4-a716-446655440000', null, 'e8ff7872-dedb-405c-bf8a-f7901ac4b432');
  
  if (result.status === 400 && result.data?.error === 'Bad Request') {
    logSuccess('Retornou 400 Bad Request');
    logInfo(`Mensagem: ${result.data.message}`);
    return true;
  } else {
    logError(`Esperado 400, recebido ${result.status}`);
    return false;
  }
}

/**
 * Teste 3: Validação - email inválido
 */
async function testInvalidEmail() {
  logTest('Validação: email inválido');
  
  const result = await callCheckSubscription('550e8400-e29b-41d4-a716-446655440000', 'email-invalido', 'e8ff7872-dedb-405c-bf8a-f7901ac4b432');
  
  if (result.status === 400 && result.data?.error === 'Bad Request') {
    logSuccess('Retornou 400 Bad Request');
    logInfo(`Mensagem: ${result.data.message}`);
    return true;
  } else {
    logError(`Esperado 400, recebido ${result.status}`);
    return false;
  }
}

/**
 * Teste 4: Usuário não encontrado
 */
async function testUserNotFound() {
  logTest('Usuário não encontrado');
  
  const fakeUserId = '00000000-0000-0000-0000-000000000000';
  const fakeEmail = 'naoexiste@example.com';
  const appId = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
  
  const result = await callCheckSubscription(fakeUserId, fakeEmail, appId);
  
  if (result.status === 200) {
    const data = result.data;
    if (data.hasAccess === false && 
        data.isSubscriber === false && 
        data.isTrial === false &&
        data.subscriptionStatus === 'none' &&
        data.appId === appId) {
      logSuccess('Retornou resposta correta para usuário não encontrado');
      logInfo(`Mensagem: ${data.message}`);
      logInfo(`App verificado: ${data.appName || data.appId}`);
      return true;
    } else {
      logError('Resposta não corresponde ao esperado');
      logInfo(`Resposta: ${JSON.stringify(data, null, 2)}`);
      return false;
    }
  } else {
    logError(`Esperado 200, recebido ${result.status}`);
    if (result.error) logError(`Erro: ${result.error}`);
    if (result.data) logInfo(`Resposta: ${JSON.stringify(result.data, null, 2)}`);
    return false;
  }
}

/**
 * Teste 5: Buscar usuário real para testes
 */
async function getTestUser() {
  logInfo('Buscando usuário de teste...');
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email')
    .limit(1)
    .single();
  
  if (error || !profile) {
    logWarning('Nenhum usuário encontrado. Alguns testes serão pulados.');
    return null;
  }
  
  logSuccess(`Usuário encontrado: ${profile.email}`);
  return profile;
}

/**
 * Teste 6: Verificar estrutura de resposta (Atualizado para Sistema Híbrido)
 */
async function testResponseStructure(userId, email) {
  logTest('Estrutura da Resposta (Sistema Híbrido)');
  
  const appId = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
  const result = await callCheckSubscription(userId, email, appId);
  
  if (result.status === 200 && result.data) {
    const data = result.data;
    // Novos campos obrigatórios para sistema híbrido
    const requiredFields = ['hasAccess', 'isSubscriber', 'isTrial', 'subscriptionStatus', 'appId', 'appName'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length === 0) {
      logSuccess('Todos os campos obrigatórios estão presentes');
      logInfo(`hasAccess: ${data.hasAccess}`);
      logInfo(`isSubscriber: ${data.isSubscriber}`);
      logInfo(`isTrial: ${data.isTrial}`);
      logInfo(`subscriptionStatus: ${data.subscriptionStatus}`);
      logInfo(`appId: ${data.appId}`);
      logInfo(`appName: ${data.appName}`);
      if (data.appSlug) logInfo(`appSlug: ${data.appSlug}`);
      
      if (data.expiresAt) logInfo(`expiresAt: ${data.expiresAt}`);
      if (data.purchaseType) logInfo(`purchaseType: ${data.purchaseType}`);
      if (data.trialExpiresAt) logInfo(`trialExpiresAt: ${data.trialExpiresAt}`);
      if (data.daysRemaining !== undefined) logInfo(`daysRemaining: ${data.daysRemaining}`);
      
      return true;
    } else {
      logError(`Campos faltando: ${missingFields.join(', ')}`);
      return false;
    }
  } else {
    logError(`Erro ao obter resposta: status ${result.status}`);
    if (result.error) logError(`Erro: ${result.error}`);
    if (result.data) logInfo(`Resposta: ${JSON.stringify(result.data, null, 2)}`);
    return false;
  }
}

/**
 * Teste 7: Verificar lógica de acesso (Sistema Híbrido - por App)
 */
async function testAccessLogic(userId, email) {
  logTest('Lógica de Acesso (Sistema Híbrido - por App)');
  
  const appId = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
  const result = await callCheckSubscription(userId, email, appId);
  
  if (result.status === 200 && result.data) {
    const data = result.data;
    const expectedHasAccess = data.isSubscriber || data.isTrial;
    
    if (data.hasAccess === expectedHasAccess) {
      logSuccess('Lógica de acesso está correta (verificando acesso ao app específico)');
      logInfo(`App verificado: ${data.appName} (${data.appId})`);
      logInfo(`hasAccess (${data.hasAccess}) = isSubscriber (${data.isSubscriber}) OU isTrial (${data.isTrial})`);
      if (data.message) logInfo(`Mensagem: ${data.message}`);
      return true;
    } else {
      logError(`Lógica incorreta: hasAccess=${data.hasAccess}, mas deveria ser ${expectedHasAccess}`);
      return false;
    }
  } else {
    logError(`Erro ao obter resposta: status ${result.status}`);
    return false;
  }
}

/**
 * Teste 8: Verificar assinaturas do usuário
 */
async function checkUserSubscriptions(userId) {
  logTest('Verificando Assinaturas do Usuário');
  
  // Buscar assinaturas
  const { data: purchases, error: purchasesError } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'APPROVED')
    .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME']);
  
  if (purchasesError) {
    logWarning(`Erro ao buscar compras: ${purchasesError.message}`);
    return;
  }
  
  logInfo(`Assinaturas encontradas: ${purchases?.length || 0}`);
  
  if (purchases && purchases.length > 0) {
    purchases.forEach(p => {
      logInfo(`  - ${p.purchase_type} (expires_at: ${p.expires_at || 'N/A'})`);
    });
  }
  
  // Buscar trials
  const { data: trials, error: trialsError } = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (trialsError) {
    logWarning(`Erro ao buscar trials: ${trialsError.message}`);
    return;
  }
  
  logInfo(`Trials ativos encontrados: ${trials?.length || 0}`);
  
  if (trials && trials.length > 0) {
    const now = new Date();
    trials.forEach(t => {
      const expiresAt = new Date(t.expires_at);
      const isActive = expiresAt > now;
      logInfo(`  - Trial ${isActive ? 'ATIVO' : 'EXPIRADO'} (expires_at: ${t.expires_at})`);
    });
  }
}

/**
 * Teste 9: Teste de conexão com Edge Function
 */
async function testConnection() {
  logTest('Conexão com Edge Function');
  
  logInfo(`Tentando conectar em: ${EDGE_FUNCTION_URL}`);
  logWarning('⚠️  IMPORTANTE: A função precisa estar deployada em produção!');
  
  try {
    const result = await callCheckSubscription('test', 'test@test.com', 'e8ff7872-dedb-405c-bf8a-f7901ac4b432');
    
    if (result.error) {
      if (result.error.includes('ECONNREFUSED') || result.error.includes('fetch failed')) {
        logError('Não foi possível conectar à Edge Function');
        logWarning('Certifique-se de que a função está deployada:');
        logWarning('  npx supabase functions deploy check-subscription');
        return false;
      } else if (result.status === 404) {
        logError('Função não encontrada (404)');
        logWarning('A função precisa ser deployada primeiro!');
        logWarning('Execute: npx supabase functions deploy check-subscription');
        return false;
      } else {
        logError(`Erro de conexão: ${result.error}`);
        return false;
      }
    } else if (result.status === 404) {
      logError('Função não encontrada (404)');
      logWarning('A função precisa ser deployada primeiro!');
      logWarning('Execute: npx supabase functions deploy check-subscription');
      return false;
    } else {
      logSuccess('Conexão estabelecida com sucesso');
      return true;
    }
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
  log('\n' + '='.repeat(60), 'magenta');
  log('🚀 TESTE DA EDGE FUNCTION: check-subscription (PRODUÇÃO)', 'magenta');
  log('='.repeat(60) + '\n', 'magenta');
  
  logWarning('⚠️  Este script testa a função em PRODUÇÃO');
  logWarning('⚠️  Certifique-se de que a função está deployada!\n');
  
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };
  
  // Teste de conexão primeiro
  const connected = await testConnection();
  if (!connected) {
    logError('\n❌ Não foi possível conectar à Edge Function');
    logWarning('\n📝 Para fazer o deploy da função:');
    logWarning('   npx supabase functions deploy check-subscription');
    logWarning('\n📝 Para testar localmente, use:');
    logWarning('   npm run test:check-subscription');
    process.exit(1);
  }
  results.passed++;
  
  // Testes de validação
  if (await testMissingUserId()) results.passed++;
  else results.failed++;
  
  if (await testMissingAppId()) results.passed++;
  else results.failed++;
  
  if (await testMissingEmail()) results.passed++;
  else results.failed++;
  
  if (await testInvalidEmail()) results.passed++;
  else results.failed++;
  
  if (await testUserNotFound()) results.passed++;
  else results.failed++;
  
  // Buscar usuário real para testes
  const testUser = await getTestUser();
  
  if (testUser) {
    if (await testResponseStructure(testUser.id, testUser.email)) results.passed++;
    else results.failed++;
    
    if (await testAccessLogic(testUser.id, testUser.email)) results.passed++;
    else results.failed++;
    
    await checkUserSubscriptions(testUser.id);
    
    // Teste adicional: Verificar campos condicionais
    logTest('Campos Condicionais na Resposta');
    const appId = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
    const result = await callCheckSubscription(testUser.id, testUser.email, appId);
    if (result.status === 200 && result.data) {
      const data = result.data;
      let conditionalFieldsOk = true;
      
      // Se tem assinatura, deve ter expiresAt (exceto LIFETIME)
      if (data.isSubscriber && !data.isTrial && data.expiresAt === undefined) {
        logWarning('Assinatura ativa sem expiresAt (pode ser LIFETIME, ok)');
      }
      
      // Se está em trial, deve ter trialExpiresAt e daysRemaining
      if (data.isTrial) {
        if (!data.trialExpiresAt) {
          logError('Trial ativo sem trialExpiresAt');
          conditionalFieldsOk = false;
        }
        if (data.daysRemaining === undefined || data.daysRemaining === null) {
          logError('Trial ativo sem daysRemaining');
          conditionalFieldsOk = false;
        }
      }
      
      if (conditionalFieldsOk) {
        logSuccess('Campos condicionais estão corretos');
        results.passed++;
      } else {
        results.failed++;
      }
    }
  } else {
    results.skipped += 3;
    logWarning('Testes com usuário real foram pulados (nenhum usuário encontrado)');
  }
  
  // Teste adicional: Verificar CORS
  logTest('Verificação CORS');
  try {
    const corsResult = await fetch(EDGE_FUNCTION_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://lwdigitalforge.com',
        'Access-Control-Request-Method': 'POST',
      },
    });
    
    if (corsResult.status === 200 || corsResult.status === 204) {
      logSuccess('CORS configurado corretamente');
      results.passed++;
    } else {
      logWarning(`CORS pode ter problemas (status: ${corsResult.status})`);
      results.failed++;
    }
  } catch (error) {
    logWarning(`Erro ao testar CORS: ${error.message}`);
    results.skipped++;
  }
  
  // Resumo
  log('\n' + '='.repeat(60), 'magenta');
  log('📊 RESUMO DOS TESTES', 'magenta');
  log('='.repeat(60), 'magenta');
  log(`✅ Passou: ${results.passed}`, 'green');
  log(`❌ Falhou: ${results.failed}`, 'red');
  log(`⏭️  Pulado: ${results.skipped}`, 'yellow');
  log('='.repeat(60) + '\n', 'magenta');
  
  if (results.failed === 0) {
    logSuccess('🎉 Todos os testes passaram!');
    process.exit(0);
  } else {
    logError(`❌ ${results.failed} teste(s) falharam`);
    process.exit(1);
  }
}

// Executar testes
runAllTests().catch(error => {
  logError(`\n❌ Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});

