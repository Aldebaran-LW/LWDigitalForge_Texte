/**
 * 🤖 Agente: Criar Trial para Usuário
 * 
 * Este script automatiza a criação de trials para usuários.
 * 
 * Uso:
 *   node scripts/agente-criar-trial.js <email_do_usuario> <app_id> [dias_trial]
 * 
 * Exemplo:
 *   node scripts/agente-criar-trial.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 14
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

// Para operações administrativas, é recomendado usar SERVICE_ROLE_KEY
// Configure SUPABASE_SERVICE_ROLE_KEY no .env para usar
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createClient(supabaseUrl, supabaseAnonKey);

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

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`🤖 ${message}`, 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
}

/**
 * Busca usuário por email
 */
async function buscarUsuarioPorEmail(email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error(`Usuário com email ${email} não encontrado`);
    }
    throw error;
  }

  return data;
}

/**
 * Busca app por ID ou nome
 */
async function buscarApp(appIdOrName) {
  // Primeiro tenta como ID (UUID)
  const { data: byId, error: errorById } = await supabase
    .from('registered_apps')
    .select('id, name, trial_period_days, is_active')
    .eq('id', appIdOrName)
    .single();

  if (!errorById && byId) {
    return byId;
  }

  // Se não encontrou, tenta como nome
  const { data: byName, error: errorByName } = await supabase
    .from('registered_apps')
    .select('id, name, trial_period_days, is_active')
    .ilike('name', `%${appIdOrName}%`)
    .single();

  if (errorByName || !byName) {
    throw new Error(`App com ID ou nome "${appIdOrName}" não encontrado`);
  }

  return byName;
}

/**
 * Verifica se usuário já tem trial ativo para o app
 */
async function verificarTrialExistente(userId, appId) {
  const { data, error } = await supabase
    .from('user_trials')
    .select('id, is_active, expires_at')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
}

/**
 * Cria trial para o usuário
 */
async function criarTrial(userId, appId, diasTrial) {
  const agora = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + diasTrial);

  const trialData = {
    user_id: userId,
    app_id: appId,
    started_at: agora.toISOString(),
    expires_at: expiresAt.toISOString(),
    is_active: true,
  };

  const { data, error } = await supabase
    .from('user_trials')
    .insert(trialData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Função principal
 */
async function main() {
  logHeader('AGENTE: CRIAR TRIAL PARA USUÁRIO');

  // Validar argumentos
  const args = process.argv.slice(2);
  if (args.length < 2) {
    logError('Uso incorreto!');
    logInfo('Uso: node scripts/agente-criar-trial.js <email_usuario> <app_id_ou_nome> [dias_trial]');
    logInfo('\nExemplos:');
    logInfo('  node scripts/agente-criar-trial.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000');
    logInfo('  node scripts/agente-criar-trial.js usuario@email.com "JornadaPro" 14');
    logInfo('  node scripts/agente-criar-trial.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 30');
    process.exit(1);
  }

  const [emailUsuario, appIdOrName, diasTrialStr] = args;
  const diasTrial = diasTrialStr ? parseInt(diasTrialStr, 10) : null;

  try {
    // 1. Buscar usuário
    logInfo(`Buscando usuário: ${emailUsuario}...`);
    const usuario = await buscarUsuarioPorEmail(emailUsuario);
    logSuccess(`Usuário encontrado: ${usuario.full_name || usuario.email} (ID: ${usuario.id.substring(0, 8)}...)`);

    // 2. Buscar app
    logInfo(`Buscando app: ${appIdOrName}...`);
    const app = await buscarApp(appIdOrName);
    logSuccess(`App encontrado: ${app.name} (ID: ${app.id.substring(0, 8)}...)`);

    if (!app.is_active) {
      logWarning(`App ${app.name} não está ativo!`);
    }

    // 3. Determinar dias do trial
    const diasTrialFinal = diasTrial || app.trial_period_days || 7;
    if (!diasTrial && !app.trial_period_days) {
      logWarning(`Nenhum período de trial configurado. Usando padrão: 7 dias`);
    } else if (diasTrial) {
      logInfo(`Usando ${diasTrial} dias (especificado no comando)`);
    } else {
      logInfo(`Usando ${app.trial_period_days} dias (configurado no app)`);
    }

    // 4. Verificar trial existente
    logInfo('Verificando trials existentes...');
    const trialExistente = await verificarTrialExistente(usuario.id, app.id);
    if (trialExistente) {
      const expiresAtDate = new Date(trialExistente.expires_at);
      logWarning(`Usuário já possui trial ativo que expira em ${expiresAtDate.toLocaleDateString('pt-BR')}`);
      logWarning('Deseja criar um novo trial mesmo assim? (S/N)');
      // Por enquanto, apenas avisa e continua
      // Para interação, você pode usar readline
    }

    // 5. Criar trial
    logInfo('Criando trial...');
    const trial = await criarTrial(usuario.id, app.id, diasTrialFinal);
    
    const expiresAtDate = new Date(trial.expires_at);
    logSuccess('Trial criado com sucesso!');
    log('\n📋 Detalhes do Trial:', 'cyan');
    log(`   ID: ${trial.id}`, 'blue');
    log(`   Usuário: ${usuario.full_name || usuario.email}`, 'blue');
    log(`   App: ${app.name}`, 'blue');
    log(`   Início: ${new Date(trial.started_at).toLocaleString('pt-BR')}`, 'blue');
    log(`   Expiração: ${expiresAtDate.toLocaleString('pt-BR')}`, 'blue');
    log(`   Duração: ${diasTrialFinal} dias`, 'blue');
    log(`   Status: ${trial.is_active ? 'Ativo' : 'Inativo'}`, 'blue');

    log('\n✅ Trial criado! O usuário já está liberado automaticamente.', 'green');
    logInfo('As colunas is_liberado e data_vencimento foram atualizadas automaticamente pelo trigger.');

  } catch (error) {
    logError(`Erro: ${error.message}`);
    if (error.details) {
      logError(`Detalhes: ${error.details}`);
    }
    if (error.hint) {
      logWarning(`Dica: ${error.hint}`);
    }
    console.error(error);
    process.exit(1);
  }
}

main();
