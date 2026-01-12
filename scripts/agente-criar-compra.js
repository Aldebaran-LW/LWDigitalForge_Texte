/**
 * 🤖 Agente: Criar Compra/Assinatura para Usuário
 * 
 * Este script automatiza a criação de compras/assinaturas para usuários.
 * 
 * Uso:
 *   node scripts/agente-criar-compra.js <email_do_usuario> <app_id> <tipo> [dias_duracao]
 * 
 * Tipos: LIFETIME, MONTHLY, ANNUAL
 * 
 * Exemplo:
 *   node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 LIFETIME
 *   node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 MONTHLY
 *   node scripts/agente-criar-compra.js usuario@email.com "JornadaPro" ANNUAL
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
    .select('id, name, is_active')
    .eq('id', appIdOrName)
    .single();

  if (!errorById && byId) {
    return byId;
  }

  // Se não encontrou, tenta como nome
  const { data: byName, error: errorByName } = await supabase
    .from('registered_apps')
    .select('id, name, is_active')
    .ilike('name', `%${appIdOrName}%`)
    .single();

  if (errorByName || !byName) {
    throw new Error(`App com ID ou nome "${appIdOrName}" não encontrado`);
  }

  return byName;
}

/**
 * Valida tipo de compra
 */
function validarTipoCompra(tipo) {
  const tiposValidos = ['LIFETIME', 'MONTHLY', 'ANNUAL'];
  const tipoUpper = tipo.toUpperCase();
  
  if (!tiposValidos.includes(tipoUpper)) {
    throw new Error(`Tipo inválido: ${tipo}. Tipos válidos: ${tiposValidos.join(', ')}`);
  }

  return tipoUpper;
}

/**
 * Calcula data de expiração baseado no tipo
 */
function calcularDataExpiracao(tipo, diasDuracao = null) {
  if (tipo === 'LIFETIME') {
    return '2099-01-01T00:00:00.000Z'; // Data distante no futuro
  }

  const agora = new Date();
  let expiresAt = new Date();

  if (diasDuracao) {
    expiresAt.setDate(expiresAt.getDate() + diasDuracao);
  } else {
    // Valores padrão
    if (tipo === 'MONTHLY') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (tipo === 'ANNUAL') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
  }

  return expiresAt.toISOString();
}

/**
 * Cria compra/assinatura para o usuário
 */
async function criarCompra(userId, appId, tipo, expiresAt) {
  const purchaseData = {
    user_id: userId,
    app_id: appId,
    purchase_type: tipo,
    status: 'APPROVED',
    expires_at: tipo === 'LIFETIME' ? expiresAt : expiresAt,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('user_purchases')
    .insert(purchaseData)
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
  logHeader('AGENTE: CRIAR COMPRA/ASSINATURA PARA USUÁRIO');

  // Validar argumentos
  const args = process.argv.slice(2);
  if (args.length < 3) {
    logError('Uso incorreto!');
    logInfo('Uso: node scripts/agente-criar-compra.js <email_usuario> <app_id_ou_nome> <tipo> [dias_duracao]');
    logInfo('\nTipos válidos:');
    logInfo('  LIFETIME  - Compra vitalícia (não expira)');
    logInfo('  MONTHLY   - Assinatura mensal');
    logInfo('  ANNUAL    - Assinatura anual');
    logInfo('\nExemplos:');
    logInfo('  node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 LIFETIME');
    logInfo('  node scripts/agente-criar-compra.js usuario@email.com "JornadaPro" MONTHLY');
    logInfo('  node scripts/agente-criar-compra.js usuario@email.com 123e4567-e89b-12d3-a456-426614174000 ANNUAL 365');
    process.exit(1);
  }

  const [emailUsuario, appIdOrName, tipoStr, diasDuracaoStr] = args;
  const diasDuracao = diasDuracaoStr ? parseInt(diasDuracaoStr, 10) : null;

  try {
    // 1. Validar tipo
    const tipo = validarTipoCompra(tipoStr);
    logInfo(`Tipo de compra: ${tipo}`);

    // 2. Buscar usuário
    logInfo(`Buscando usuário: ${emailUsuario}...`);
    const usuario = await buscarUsuarioPorEmail(emailUsuario);
    logSuccess(`Usuário encontrado: ${usuario.full_name || usuario.email} (ID: ${usuario.id.substring(0, 8)}...)`);

    // 3. Buscar app
    logInfo(`Buscando app: ${appIdOrName}...`);
    const app = await buscarApp(appIdOrName);
    logSuccess(`App encontrado: ${app.name} (ID: ${app.id.substring(0, 8)}...)`);

    if (!app.is_active) {
      logWarning(`App ${app.name} não está ativo!`);
    }

    // 4. Calcular data de expiração
    const expiresAt = calcularDataExpiracao(tipo, diasDuracao);
    const expiresAtDate = new Date(expiresAt);
    
    if (tipo === 'LIFETIME') {
      logInfo('Compra vitalícia - não expira');
    } else {
      logInfo(`Data de expiração: ${expiresAtDate.toLocaleString('pt-BR')}`);
      if (diasDuracao) {
        logInfo(`Duração personalizada: ${diasDuracao} dias`);
      }
    }

    // 5. Criar compra
    logInfo('Criando compra/assinatura...');
    const compra = await criarCompra(usuario.id, app.id, tipo, expiresAt);
    
    logSuccess('Compra/assinatura criada com sucesso!');
    log('\n📋 Detalhes da Compra:', 'cyan');
    log(`   ID: ${compra.id}`, 'blue');
    log(`   Usuário: ${usuario.full_name || usuario.email}`, 'blue');
    log(`   App: ${app.name}`, 'blue');
    log(`   Tipo: ${compra.purchase_type}`, 'blue');
    log(`   Status: ${compra.status}`, 'blue');
    if (tipo !== 'LIFETIME') {
      log(`   Expiração: ${expiresAtDate.toLocaleString('pt-BR')}`, 'blue');
    } else {
      log(`   Expiração: Vitalício (não expira)`, 'blue');
    }

    log('\n✅ Compra criada! O usuário já está liberado automaticamente.', 'green');
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
