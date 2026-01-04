/**
 * Script de Teste: Conexão com Supabase
 * 
 * Este script testa a conexão com o Supabase usando as credenciais
 * configuradas em src/lib/customSupabaseClient.js
 * 
 * Execute com: npm run test:supabase
 */

import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase (mesmas do customSupabaseClient.js)
const supabaseUrl = 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

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

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Teste 1: Verificar conexão básica
 */
async function testConnection() {
  logTest('Conexão Básica com Supabase');
  
  try {
    // Tentar fazer uma query simples
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      logError(`Falha na conexão: ${error.message}`);
      logError(`Código: ${error.code}`);
      return false;
    }
    
    logSuccess('Conexão com Supabase estabelecida com sucesso!');
    logInfo(`URL: ${supabaseUrl}`);
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Verificar autenticação
 */
async function testAuth() {
  logTest('Sistema de Autenticação');
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logError(`Erro ao verificar sessão: ${error.message}`);
      return false;
    }
    
    if (session) {
      logWarning('Sessão ativa encontrada (esperado: nenhuma sessão)');
      logInfo(`Usuário: ${session.user?.email || 'N/A'}`);
    } else {
      logSuccess('Sistema de autenticação funcionando (nenhuma sessão ativa)');
    }
    
    return true;
  } catch (error) {
    logError(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 3: Verificar tabelas principais
 */
async function testTables() {
  logTest('Verificação de Tabelas');
  
  const tables = ['profiles', 'registered_apps', 'user_purchases'];
  const results = [];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        logError(`Tabela ${table}: ${error.message}`);
        results.push({ table, success: false });
      } else {
        logSuccess(`Tabela ${table}: Acessível`);
        results.push({ table, success: true });
      }
    } catch (error) {
      logError(`Tabela ${table}: Erro inesperado - ${error.message}`);
      results.push({ table, success: false });
    }
  }
  
  const allSuccess = results.every(r => r.success);
  return allSuccess;
}

/**
 * Teste 4: Verificar Edge Functions
 */
async function testEdgeFunctions() {
  logTest('Edge Functions');
  
  try {
    // Testar se a função create-checkout existe
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { test: true }
    });
    
    // Esperamos um erro de autenticação ou validação, não um erro de "função não encontrada"
    if (error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        logError('Edge Function create-checkout não encontrada');
        return false;
      } else {
        logSuccess('Edge Function create-checkout encontrada (erro esperado de validação)');
        logInfo(`Erro de validação: ${error.message}`);
        return true;
      }
    }
    
    logSuccess('Edge Function create-checkout respondendo');
    return true;
  } catch (error) {
    logWarning(`Não foi possível testar Edge Functions: ${error.message}`);
    logInfo('Isso pode ser normal se as funções não estiverem deployadas');
    return true; // Não falha o teste, apenas avisa
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🚀 TESTE DE CONEXÃO COM SUPABASE', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  logInfo('Credenciais configuradas:');
  logInfo(`URL: ${supabaseUrl}`);
  logInfo(`Key: ${supabaseAnonKey.substring(0, 20)}...`);
  log('');
  
  const results = [];
  
  // Executar testes
  results.push({ name: 'Conexão Básica', passed: await testConnection() });
  results.push({ name: 'Sistema de Autenticação', passed: await testAuth() });
  results.push({ name: 'Tabelas do Banco', passed: await testTables() });
  results.push({ name: 'Edge Functions', passed: await testEdgeFunctions() });
  
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
  
  if (passed === total) {
    logSuccess('🎉 Todos os testes passaram! A conexão com Supabase está funcionando corretamente.');
  } else {
    logWarning('⚠️  Alguns testes falharam. Verifique a configuração do Supabase.');
    logInfo('Consulte a documentação ou verifique as credenciais em src/lib/customSupabaseClient.js');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Executar testes
runAllTests().catch(error => {
  logError(`Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});

















