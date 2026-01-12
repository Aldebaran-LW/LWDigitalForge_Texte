/**
 * 🤖 Agente: Liberação em Lote (Batch)
 * 
 * Este script permite liberar múltiplos usuários de uma vez através de um arquivo CSV ou JSON.
 * 
 * Uso:
 *   node scripts/agente-liberacao-lote.js <arquivo.csv|json> [tipo_liberacao]
 * 
 * Tipos de liberação:
 *   - trial: Cria trial para cada usuário
 *   - compra: Cria compra/assinatura (requer tipo no arquivo)
 * 
 * Formato CSV:
 *   email,app_id,tipo_liberacao,valor1,valor2
 *   usuario1@email.com,123e4567-e89b-12d3-a456-426614174000,trial,14
 *   usuario2@email.com,123e4567-e89b-12d3-a456-426614174000,compra,LIFETIME,
 * 
 * Formato JSON:
 *   [
 *     {
 *       "email": "usuario1@email.com",
 *       "app_id": "123e4567-e89b-12d3-a456-426614174000",
 *       "tipo_liberacao": "trial",
 *       "dias_trial": 14
 *     },
 *     {
 *       "email": "usuario2@email.com",
 *       "app_id": "123e4567-e89b-12d3-a456-426614174000",
 *       "tipo_liberacao": "compra",
 *       "tipo_compra": "LIFETIME"
 *     }
 *   ]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

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
 * Carrega dados do arquivo CSV
 */
function carregarCSV(caminhoArquivo) {
  const conteudo = readFileSync(caminhoArquivo, 'utf-8');
  const linhas = conteudo.split('\n').filter(l => l.trim());
  const cabecalho = linhas[0].split(',').map(c => c.trim());
  
  const dados = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(',').map(v => v.trim());
    const objeto = {};
    cabecalho.forEach((col, idx) => {
      objeto[col] = valores[idx] || '';
    });
    dados.push(objeto);
  }

  return dados;
}

/**
 * Carrega dados do arquivo JSON
 */
function carregarJSON(caminhoArquivo) {
  const conteudo = readFileSync(caminhoArquivo, 'utf-8');
  return JSON.parse(conteudo);
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

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

/**
 * Busca app por ID ou nome
 */
async function buscarApp(appIdOrName) {
  const { data: byId } = await supabase
    .from('registered_apps')
    .select('id, name, trial_period_days')
    .eq('id', appIdOrName)
    .single();

  if (byId) return byId;

  const { data: byName } = await supabase
    .from('registered_apps')
    .select('id, name, trial_period_days')
    .ilike('name', `%${appIdOrName}%`)
    .single();

  if (!byName) {
    throw new Error(`App "${appIdOrName}" não encontrado`);
  }

  return byName;
}

/**
 * Cria trial
 */
async function criarTrial(userId, appId, diasTrial) {
  const agora = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + diasTrial);

  const { data, error } = await supabase
    .from('user_trials')
    .insert({
      user_id: userId,
      app_id: appId,
      started_at: agora.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cria compra
 */
async function criarCompra(userId, appId, tipo) {
  const expiresAt = tipo === 'LIFETIME' 
    ? '2099-01-01T00:00:00.000Z'
    : new Date(Date.now() + (tipo === 'MONTHLY' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('user_purchases')
    .insert({
      user_id: userId,
      app_id: appId,
      purchase_type: tipo,
      status: 'APPROVED',
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Processa uma linha de liberação
 */
async function processarLiberacao(item, tipoPadrao) {
  const tipoLiberacao = item.tipo_liberacao || tipoPadrao || 'trial';
  const email = item.email;
  const appIdOuNome = item.app_id;

  // Buscar usuário
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario) {
    return { sucesso: false, email, erro: 'Usuário não encontrado' };
  }

  // Buscar app
  const app = await buscarApp(appIdOuNome);

  try {
    if (tipoLiberacao === 'trial') {
      const diasTrial = parseInt(item.dias_trial || item.valor1 || app.trial_period_days || 7, 10);
      await criarTrial(usuario.id, app.id, diasTrial);
      return { sucesso: true, email, tipo: 'trial', app: app.name };
    } else if (tipoLiberacao === 'compra') {
      const tipoCompra = item.tipo_compra || item.valor1 || 'LIFETIME';
      await criarCompra(usuario.id, app.id, tipoCompra);
      return { sucesso: true, email, tipo: 'compra', app: app.name, tipoCompra };
    } else {
      return { sucesso: false, email, erro: `Tipo de liberação inválido: ${tipoLiberacao}` };
    }
  } catch (error) {
    return { sucesso: false, email, erro: error.message };
  }
}

/**
 * Função principal
 */
async function main() {
  logHeader('AGENTE: LIBERAÇÃO EM LOTE');

  const args = process.argv.slice(2);
  if (args.length < 1) {
    logError('Uso incorreto!');
    logInfo('Uso: node scripts/agente-liberacao-lote.js <arquivo.csv|json> [tipo_liberacao]');
    logInfo('\nTipos de liberação: trial, compra');
    logInfo('\nExemplos:');
    logInfo('  node scripts/agente-liberacao-lote.js usuarios.csv trial');
    logInfo('  node scripts/agente-liberacao-lote.js compras.json compra');
    process.exit(1);
  }

  const [caminhoArquivo, tipoPadrao] = args;

  try {
    // Carregar arquivo
    logInfo(`Carregando arquivo: ${caminhoArquivo}...`);
    let dados;
    
    if (caminhoArquivo.endsWith('.json')) {
      dados = carregarJSON(caminhoArquivo);
    } else if (caminhoArquivo.endsWith('.csv')) {
      dados = carregarCSV(caminhoArquivo);
    } else {
      throw new Error('Formato de arquivo não suportado. Use .csv ou .json');
    }

    logSuccess(`${dados.length} registro(s) encontrado(s)`);

    // Processar cada item
    const resultados = {
      sucesso: [],
      falha: [],
    };

    logInfo('\nProcessando liberações...\n');

    for (let i = 0; i < dados.length; i++) {
      const item = dados[i];
      logInfo(`[${i + 1}/${dados.length}] Processando: ${item.email}...`);
      
      const resultado = await processarLiberacao(item, tipoPadrao);
      
      if (resultado.sucesso) {
        resultados.sucesso.push(resultado);
        logSuccess(`  ✅ ${resultado.email} - ${resultado.tipo} criado para ${resultado.app}`);
      } else {
        resultados.falha.push(resultado);
        logError(`  ❌ ${resultado.email} - ${resultado.erro}`);
      }

      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Resumo
    logHeader('RESUMO');
    logSuccess(`Liberações bem-sucedidas: ${resultados.sucesso.length}`);
    if (resultados.falha.length > 0) {
      logError(`Liberações com falha: ${resultados.falha.length}`);
      log('\nFalhas:', 'red');
      resultados.falha.forEach(f => {
        log(`  - ${f.email}: ${f.erro}`, 'red');
      });
    }

  } catch (error) {
    logError(`Erro: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
