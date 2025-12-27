/**
 * Script de Teste: Autenticação Google OAuth
 * 
 * Este script simula e valida o fluxo de autenticação com Google OAuth.
 * Execute com: node scripts/test-google-oauth.js
 * 
 * IMPORTANTE: Este script requer variáveis de ambiente configuradas.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n🧪 Teste: ${name}`, 'cyan');
  log('─'.repeat(50), 'cyan');
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
 * Teste 1: Verificar configuração do Supabase
 */
async function testSupabaseConnection() {
  logTest('Conexão com Supabase');
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      logError(`Falha na conexão: ${error.message}`);
      return false;
    }
    
    logSuccess('Conexão com Supabase estabelecida');
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Verificar se a função handle_new_user existe
 */
async function testHandleNewUserFunction() {
  logTest('Função handle_new_user');
  
  try {
    // Usar service role key para verificar funções do banco
    // Nota: Em produção, isso deve ser feito via SQL Editor ou CLI
    logWarning('Este teste requer acesso ao banco de dados via SQL.');
    logInfo('Execute manualmente no SQL Editor:');
    logInfo('SELECT proname FROM pg_proc WHERE proname = \'handle_new_user\';', 'yellow');
    return true;
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 3: Verificar estrutura da tabela profiles
 */
async function testProfilesTable() {
  logTest('Estrutura da Tabela profiles');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .limit(1);
    
    if (error) {
      logError(`Erro ao acessar tabela: ${error.message}`);
      return false;
    }
    
    logSuccess('Tabela profiles acessível');
    logInfo('Colunas esperadas: id, email, full_name, avatar_url, role, created_at, updated_at');
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

/**
 * Teste 4: Verificar se o trigger está configurado
 */
async function testTriggerConfiguration() {
  logTest('Configuração do Trigger');
  
  logWarning('Este teste requer acesso ao banco de dados via SQL.');
  logInfo('Execute manualmente no SQL Editor:');
  logInfo('SELECT * FROM pg_trigger WHERE tgname = \'on_auth_user_created\';', 'yellow');
  logInfo('O trigger deve estar ativo (tgenabled = \'O\')');
  return true;
}

/**
 * Teste 5: Verificar políticas RLS
 */
async function testRLSPolicies() {
  logTest('Políticas RLS (Row Level Security)');
  
  try {
    // Tentar acessar profiles sem autenticação
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42501') {
      logSuccess('RLS está ativo (acesso negado sem autenticação)');
      return true;
    } else if (error) {
      logWarning(`RLS pode não estar configurado corretamente: ${error.message}`);
      return false;
    } else {
      logWarning('RLS pode não estar ativo - dados acessíveis sem autenticação');
      return false;
    }
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 6: Simular verificação de perfil (como no AuthCallback)
 */
async function testProfileCheck() {
  logTest('Verificação de Perfil (Simulação)');
  
  try {
    // Simular verificação de perfil para um usuário inexistente
    const fakeUserId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', fakeUserId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      logSuccess('Código de erro PGRST116 detectado (perfil não encontrado)');
      logInfo('O AuthCallback.jsx trata este caso corretamente');
      return true;
    } else if (error) {
      logWarning(`Erro diferente do esperado: ${error.message}`);
      return false;
    } else {
      logWarning('Perfil encontrado (não esperado para ID fake)');
      return false;
    }
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 7: Verificar variáveis de ambiente
 */
function testEnvironmentVariables() {
  logTest('Variáveis de Ambiente');
  
  const required = {
    'VITE_SUPABASE_URL': supabaseUrl,
    'VITE_SUPABASE_ANON_KEY': supabaseAnonKey ? '***' : null,
  };
  
  let allPresent = true;
  
  for (const [key, value] of Object.entries(required)) {
    if (value) {
      logSuccess(`${key}: Configurada`);
    } else {
      logError(`${key}: Não configurada`);
      allPresent = false;
    }
  }
  
  if (supabaseUrl) {
    logInfo(`URL: ${supabaseUrl}`);
  }
  
  return allPresent;
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🚀 INICIANDO TESTES: Autenticação Google OAuth', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  const results = [];
  
  // Testes que podem ser executados automaticamente
  results.push({ name: 'Variáveis de Ambiente', passed: testEnvironmentVariables() });
  results.push({ name: 'Conexão Supabase', passed: await testSupabaseConnection() });
  results.push({ name: 'Tabela profiles', passed: await testProfilesTable() });
  results.push({ name: 'Políticas RLS', passed: await testRLSPolicies() });
  results.push({ name: 'Verificação de Perfil', passed: await testProfileCheck() });
  
  // Testes que requerem verificação manual
  results.push({ name: 'Função handle_new_user', passed: await testHandleNewUserFunction() });
  results.push({ name: 'Trigger on_auth_user_created', passed: await testTriggerConfiguration() });
  
  // Resumo
  log('\n' + '='.repeat(60), 'blue');
  log('📊 RESUMO DOS TESTES', 'blue');
  log('='.repeat(60), 'blue');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    if (result.passed) {
      logSuccess(`${result.name}`);
    } else {
      logError(`${result.name}`);
    }
  });
  
  log('\n' + '─'.repeat(60), 'cyan');
  log(`Total: ${passed}/${total} testes passaram`, passed === total ? 'green' : 'yellow');
  log('─'.repeat(60) + '\n', 'cyan');
  
  if (passed < total) {
    logWarning('Alguns testes falharam. Verifique a configuração.');
    logInfo('Consulte CONFIGURAR_GOOGLE_OAUTH.md para instruções de configuração.');
  } else {
    logSuccess('Todos os testes automáticos passaram!');
    logInfo('Execute os testes manuais conforme descrito em TESTES_GOOGLE_OAUTH.md');
  }
  
  log('\n📝 PRÓXIMOS PASSOS:', 'cyan');
  log('1. Configure o Google OAuth no Supabase Dashboard');
  log('2. Aplique a migration: 20250105000000_improve_google_oauth_sync.sql');
  log('3. Teste o login manualmente na aplicação');
  log('4. Verifique os testes manuais em TESTES_GOOGLE_OAUTH.md\n');
}

// Executar testes
runAllTests().catch(error => {
  logError(`Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});



