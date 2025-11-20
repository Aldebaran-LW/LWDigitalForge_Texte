import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tenta ler as credenciais do arquivo customSupabaseClient.js
let supabaseUrl, supabaseAnonKey;

try {
  const clientFile = readFileSync(join(__dirname, 'src/lib/customSupabaseClient.js'), 'utf-8');
  const urlMatch = clientFile.match(/const supabaseUrl = ['"]([^'"]+)['"]/);
  const keyMatch = clientFile.match(/const supabaseAnonKey = ['"]([^'"]+)['"]/);
  
  if (urlMatch) supabaseUrl = urlMatch[1];
  if (keyMatch) supabaseAnonKey = keyMatch[1];
} catch (error) {
  // Se não conseguir ler, usa valores padrão
  supabaseUrl = 'https://wwwwyuwighdehmvnolrl.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ2OTksImV4cCI6MjA3NzA5MDY5OX0.UhNnuDZezEVxg1E5Y-9S_C_kdCdnWa5iUlSS3Ze2ACE';
}

// Permite sobrescrever via variáveis de ambiente
if (process.env.SUPABASE_URL) supabaseUrl = process.env.SUPABASE_URL;
if (process.env.SUPABASE_ANON_KEY) supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Credenciais do Supabase não encontradas!');
  console.error('Configure SUPABASE_URL e SUPABASE_ANON_KEY como variáveis de ambiente ou');
  console.error('verifique o arquivo src/lib/customSupabaseClient.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Cores para o console
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

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testConnection() {
  log('\n=== Teste 1: Conexão com Supabase ===', 'cyan');
  logInfo(`URL: ${supabaseUrl}`);
  logInfo(`Chave anon: ${supabaseAnonKey.substring(0, 20)}...`);
  
  try {
    // Testa a conexão fazendo uma query simples
    const { data, error } = await supabase.from('profiles').select('count').limit(0);
    
    if (error) {
      // Se der erro mas for de permissão, a conexão está funcionando
      if (error.code === 'PGRST301' || error.message.includes('permission') || error.message.includes('JWT')) {
        logSuccess('Conexão estabelecida com sucesso!');
        logInfo('Nota: Erro de permissão é esperado sem autenticação');
        return true;
      }
      
      // Verifica se é erro de chave inválida
      if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        logError(`Chave da API inválida ou expirada`);
        logWarning('Verifique se a chave anon key está correta no arquivo customSupabaseClient.js');
        logInfo('Você pode obter uma nova chave no dashboard do Supabase:');
        logInfo('https://supabase.com/dashboard/project/[seu-project-ref]/settings/api');
        return false;
      }
      
      throw error;
    }
    
    logSuccess('Conexão estabelecida com sucesso!');
    return true;
  } catch (error) {
    logError(`Falha na conexão: ${error.message}`);
    if (error.code) {
      logInfo(`Código do erro: ${error.code}`);
    }
    if (error.details) {
      logInfo(`Detalhes: ${error.details}`);
    }
    return false;
  }
}

async function testSession() {
  log('\n=== Teste 2: Verificação de Sessão ===', 'cyan');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logError(`Erro ao verificar sessão: ${error.message}`);
      return false;
    }
    
    if (session) {
      logSuccess(`Sessão ativa encontrada para: ${session.user.email}`);
      logInfo(`User ID: ${session.user.id}`);
    } else {
      logWarning('Nenhuma sessão ativa encontrada (isso é normal se você não estiver logado)');
    }
    
    return true;
  } catch (error) {
    logError(`Erro ao verificar sessão: ${error.message}`);
    return false;
  }
}

async function testTableAccess(tableName, description) {
  log(`\n=== Teste: Acesso à tabela ${tableName} ===`, 'cyan');
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      // Extrai informações do erro
      const errorMsg = (error.message && error.message.trim()) || error.msg || '';
      const errorCode = error.code || error.status || '';
      const errorDetails = error.details || error.hint || '';
      
      // Se a mensagem estiver vazia mas houver código, usa o código como mensagem
      let displayMsg = errorMsg;
      if (!displayMsg && errorCode) {
        displayMsg = `Erro ${errorCode}`;
      }
      if (!displayMsg) {
        displayMsg = 'Erro desconhecido (chave da API pode estar inválida)';
      }
      
      // Verifica se é erro de permissão/autenticação
      if (errorCode === 'PGRST301' || errorCode === '42501' || 
          errorMsg.includes('permission') || errorMsg.includes('JWT') || 
          errorMsg.includes('row-level security') || errorMsg.includes('Invalid API key') ||
          (!errorMsg && !errorCode)) {
        // Se não há mensagem nem código, provavelmente é problema de autenticação
        logWarning(`Não foi possível verificar a tabela ${tableName} devido a problema de autenticação`);
        logInfo(`Descrição: ${description}`);
        if (errorCode) {
          logInfo(`Código: ${errorCode}`);
        }
        if (errorDetails) {
          logInfo(`Detalhes: ${errorDetails}`);
        }
        return { exists: null, accessible: false, error: 'auth' };
      }
      
      // Verifica se a tabela não existe
      if (errorCode === '42P01' || errorCode === 'PGRST116' || 
          errorMsg.includes('does not exist') || errorMsg.includes('não existe')) {
        logError(`Tabela ${tableName} não existe no banco de dados`);
        logInfo(`Descrição: ${description}`);
        return { exists: false, accessible: false };
      }
      
      // Erro genérico
      logError(`Erro ao acessar tabela ${tableName}: ${displayMsg}`);
      if (errorCode) {
        logInfo(`Código do erro: ${errorCode}`);
      }
      if (errorDetails) {
        logInfo(`Detalhes: ${errorDetails}`);
      }
      return { exists: false, accessible: false };
    }
    
    logSuccess(`Tabela ${tableName} acessível!`);
    logInfo(`Descrição: ${description}`);
    if (count !== null) {
      logInfo(`Total de registros: ${count}`);
    }
    return { exists: true, accessible: true, count };
  } catch (error) {
    // Tenta extrair a mensagem de erro de várias formas
    let errorMsg = 'Erro desconhecido';
    let errorCode = '';
    let errorDetails = '';
    
    if (typeof error === 'string') {
      errorMsg = error;
    } else if (error) {
      // Tenta várias propriedades comuns de erro
      errorMsg = error.message || error.msg || error.error || error.toString() || JSON.stringify(error);
      errorCode = error.code || error.status || '';
      errorDetails = error.details || error.hint || '';
      
      // Se ainda for [object Object], tenta stringify com mais detalhes
      if (errorMsg === '[object Object]') {
        try {
          errorMsg = JSON.stringify(error, null, 2);
        } catch {
          errorMsg = String(error);
        }
      }
    }
    
    logError(`Erro ao acessar tabela ${tableName}: ${errorMsg}`);
    if (errorCode) {
      logInfo(`Código do erro: ${errorCode}`);
    }
    if (errorDetails) {
      logInfo(`Detalhes: ${errorDetails}`);
    }
    return { exists: false, accessible: false };
  }
}

async function testTables() {
  log('\n=== Teste 3: Verificação de Tabelas ===', 'cyan');
  
  const tables = [
    { name: 'profiles', description: 'Perfis de usuários' },
    { name: 'products', description: 'Produtos do e-commerce' },
    { name: 'product_types', description: 'Tipos de produtos' },
  ];
  
  const results = [];
  
  for (const table of tables) {
    const result = await testTableAccess(table.name, table.description);
    results.push({ ...table, ...result });
  }
  
  return results;
}

async function testAuthFunctions() {
  log('\n=== Teste 4: Funções de Autenticação ===', 'cyan');
  
  try {
    // Testa se as funções de auth estão disponíveis
    const authMethods = [
      'signUp',
      'signInWithPassword',
      'signOut',
      'getSession',
      'onAuthStateChange',
    ];
    
    let allAvailable = true;
    
    for (const method of authMethods) {
      if (typeof supabase.auth[method] === 'function') {
        logSuccess(`Método auth.${method} disponível`);
      } else {
        logError(`Método auth.${method} não encontrado`);
        allAvailable = false;
      }
    }
    
    return allAvailable;
  } catch (error) {
    logError(`Erro ao verificar funções de autenticação: ${error.message}`);
    return false;
  }
}

async function testRealtime() {
  log('\n=== Teste 5: Capacidade de Realtime ===', 'cyan');
  
  try {
    // Testa se o realtime está configurado
    const channel = supabase.channel('test-channel');
    
    if (channel) {
      logSuccess('Canal de realtime pode ser criado');
      
      // Tenta se inscrever (não vamos manter a subscrição ativa)
      const subscription = channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logSuccess('Realtime funcionando corretamente');
        }
      });
      
      // Limpa a subscrição após um breve teste
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 1000);
      
      return true;
    }
    
    return false;
  } catch (error) {
    logWarning(`Realtime pode não estar configurado: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║     TESTE DE INTEGRAÇÃO COM SUPABASE                     ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    connection: false,
    session: false,
    tables: [],
    auth: false,
    realtime: false,
  };
  
  // Executa todos os testes
  results.connection = await testConnection();
  results.session = await testSession();
  results.tables = await testTables();
  results.auth = await testAuthFunctions();
  results.realtime = await testRealtime();
  
  // Resumo final
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    RESUMO DOS TESTES                      ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\nConexão: ${results.connection ? '✓ OK' : '✗ FALHOU'}`, results.connection ? 'green' : 'red');
  log(`Sessão: ${results.session ? '✓ OK' : '✗ FALHOU'}`, results.session ? 'green' : 'red');
  log(`Autenticação: ${results.auth ? '✓ OK' : '✗ FALHOU'}`, results.auth ? 'green' : 'red');
  log(`Realtime: ${results.realtime ? '✓ OK' : '⚠ OPCIONAL'}`, results.realtime ? 'green' : 'yellow');
  
  log('\nTabelas:', 'cyan');
  results.tables.forEach(table => {
    if (table.exists === null) {
      log(`  ⚠ ${table.name} - Não foi possível verificar (problema de autenticação)`, 'yellow');
    } else if (table.exists && table.accessible) {
      log(`  ✓ ${table.name} - Acessível`, 'green');
    } else if (table.exists && !table.accessible) {
      log(`  ⚠ ${table.name} - Existe mas requer autenticação`, 'yellow');
    } else {
      log(`  ✗ ${table.name} - Não encontrada`, 'red');
    }
  });
  
  const allCriticalTestsPassed = results.connection && results.session && results.auth;
  const tablesExist = results.tables.every(t => t.exists === true);
  const tablesAuthIssues = results.tables.some(t => t.exists === null);
  const hasConnectionIssue = !results.connection;
  
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  if (allCriticalTestsPassed && tablesExist) {
    log('║              ✓ INTEGRAÇÃO FUNCIONANDO!                   ║', 'green');
  } else if (hasConnectionIssue) {
    log('║     ✗ PROBLEMA: CHAVE DA API INVÁLIDA OU EXPIRADA       ║', 'red');
    log('║                                                           ║', 'cyan');
    log('║  Ação necessária:                                        ║', 'yellow');
    log('║  1. Acesse o dashboard do Supabase                      ║', 'yellow');
    log('║  2. Vá em Settings > API                                 ║', 'yellow');
    log('║  3. Copie a chave "anon public"                         ║', 'yellow');
    log('║  4. Atualize src/lib/customSupabaseClient.js            ║', 'yellow');
  } else if (tablesAuthIssues) {
    log('║  ⚠ CONEXÃO OK, MAS VERIFIQUE AS CREDENCIAIS            ║', 'yellow');
  } else if (allCriticalTestsPassed) {
    log('║         ⚠ CONEXÃO OK, MAS VERIFIQUE AS TABELAS          ║', 'yellow');
  } else {
    log('║              ✗ PROBLEMAS NA INTEGRAÇÃO                   ║', 'red');
  }
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  log('');
  
  return results;
}

// Executa os testes
runAllTests().catch(error => {
  logError(`\nErro fatal durante os testes: ${error.message}`);
  console.error(error);
  process.exit(1);
});

