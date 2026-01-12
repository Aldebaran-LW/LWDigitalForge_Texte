/**
 * 🤖 Agente: Liberação Automática
 * 
 * Este script verifica automaticamente as tabelas e cria/atualiza liberações
 * baseado nos dados existentes. Pode ser executado como cron job.
 * 
 * Uso:
 *   node scripts/agente-liberacao-automatica.js [--sync-user-product-access]
 * 
 * Modos:
 *   1. Sincronização padrão: Atualiza is_liberado baseado em user_purchases e user_trials
 *   2. Sync user_product_access: Migra dados de user_product_access para user_trials/user_purchases
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
 * Atualiza status de liberação de todos os usuários
 */
async function atualizarStatusLiberacao() {
  logInfo('Atualizando status de liberação de todos os usuários...');
  
  try {
    // Chamar função RPC que atualiza todos os usuários
    const { data, error } = await supabase.rpc('update_all_users_liberado_status');
    
    if (error) {
      // Se a função RPC não existir, tentar atualizar manualmente
      logWarning(`Função RPC não disponível: ${error.message}`);
      logInfo('Atualizando usuários individualmente...');
      
      // Buscar todos os usuários
      const { data: usuarios, error: errorUsers } = await supabase
        .from('profiles')
        .select('id');
      
      if (errorUsers) throw errorUsers;
      
      let atualizados = 0;
      for (const usuario of usuarios || []) {
        const { error: updateError } = await supabase.rpc('update_user_liberado_status', {
          p_user_id: usuario.id
        });
        
        if (!updateError) atualizados++;
      }
      
      logSuccess(`${atualizados} usuários atualizados`);
    } else {
      logSuccess('Status de liberação atualizado para todos os usuários');
    }
  } catch (error) {
    logError(`Erro ao atualizar status: ${error.message}`);
    throw error;
  }
}

/**
 * Verifica e sincroniza dados de user_product_access (se existir)
 */
async function sincronizarUserProductAccess() {
  logInfo('Verificando tabela user_product_access...');
  
  try {
    // Verificar se a tabela existe
    const { data: accessData, error } = await supabase
      .from('user_product_access')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      logWarning('Tabela user_product_access não existe. Pulando sincronização.');
      return { sincronizados: 0, erros: 0 };
    }
    
    if (error) throw error;
    
    // Buscar todos os registros
    const { data: allAccess, error: errorAll } = await supabase
      .from('user_product_access')
      .select('*');
    
    if (errorAll) throw errorAll;
    
    if (!allAccess || allAccess.length === 0) {
      logInfo('Nenhum registro em user_product_access para sincronizar');
      return { sincronizados: 0, erros: 0 };
    }
    
    logInfo(`${allAccess.length} registro(s) encontrado(s) em user_product_access`);
    
    let sincronizados = 0;
    let erros = 0;
    
    for (const access of allAccess) {
      try {
        // Buscar app_id baseado em product_id
        const { data: app, error: appError } = await supabase
          .from('registered_apps')
          .select('id')
          .eq('id', access.product_id)
          .single();
        
        if (appError || !app) {
          logWarning(`App ${access.product_id} não encontrado. Pulando...`);
          erros++;
          continue;
        }
        
        if (access.is_trial && access.status === 'active') {
          // Criar trial
          const expiresAt = access.trial_ends_at || access.expires_at;
          const startedAt = access.trial_started_at || access.created_at;
          
          // Verificar se já existe trial ativo
          const { data: trialExistente } = await supabase
            .from('user_trials')
            .select('id')
            .eq('user_id', access.user_id)
            .eq('app_id', app.id)
            .eq('is_active', true)
            .single();
          
          if (!trialExistente && expiresAt && new Date(expiresAt) > new Date()) {
            const { error: trialError } = await supabase
              .from('user_trials')
              .insert({
                user_id: access.user_id,
                app_id: app.id,
                started_at: startedAt,
                expires_at: expiresAt,
                is_active: true,
              });
            
            if (!trialError) {
              sincronizados++;
              logSuccess(`Trial criado para usuário ${access.user_id.substring(0, 8)}...`);
            } else {
              erros++;
              logWarning(`Erro ao criar trial: ${trialError.message}`);
            }
          }
        } else if (access.access_level === 'full' || access.access_level === 'premium') {
          // Criar compra LIFETIME
          const { data: compraExistente } = await supabase
            .from('user_purchases')
            .select('id')
            .eq('user_id', access.user_id)
            .eq('app_id', app.id)
            .eq('purchase_type', 'LIFETIME')
            .eq('status', 'APPROVED')
            .single();
          
          if (!compraExistente) {
            const { error: compraError } = await supabase
              .from('user_purchases')
              .insert({
                user_id: access.user_id,
                app_id: app.id,
                purchase_type: 'LIFETIME',
                status: 'APPROVED',
                expires_at: '2099-01-01T00:00:00.000Z',
                payment_method: 'MIGRATION',
              });
            
            if (!compraError) {
              sincronizados++;
              logSuccess(`Compra LIFETIME criada para usuário ${access.user_id.substring(0, 8)}...`);
            } else {
              erros++;
              logWarning(`Erro ao criar compra: ${compraError.message}`);
            }
          }
        }
      } catch (err) {
        erros++;
        logError(`Erro ao processar registro ${access.id}: ${err.message}`);
      }
    }
    
    return { sincronizados, erros };
    
  } catch (error) {
    logError(`Erro ao sincronizar user_product_access: ${error.message}`);
    throw error;
  }
}

/**
 * Verifica status atual e relatório
 */
async function gerarRelatorio() {
  logInfo('Gerando relatório...');
  
  try {
    // Contar usuários liberados
    const { data: liberados, error: errorLib } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_liberado', true);
    
    // Contar usuários não liberados
    const { data: naoLiberados, error: errorNaoLib } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_liberado', false);
    
    // Contar compras ativas
    const { data: compras, error: errorCompras } = await supabase
      .from('user_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'APPROVED');
    
    // Contar trials ativos
    const { data: trials, error: errorTrials } = await supabase
      .from('user_trials')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());
    
    log('\n📊 RELATÓRIO:', 'cyan');
    log(`   Usuários liberados: ${liberados?.length || 0}`, 'blue');
    log(`   Usuários não liberados: ${naoLiberados?.length || 0}`, 'blue');
    log(`   Compras ativas: ${compras?.length || 0}`, 'blue');
    log(`   Trials ativos: ${trials?.length || 0}`, 'blue');
    
  } catch (error) {
    logWarning(`Erro ao gerar relatório: ${error.message}`);
  }
}

/**
 * Função principal
 */
async function main() {
  logHeader('AGENTE: LIBERAÇÃO AUTOMÁTICA');
  
  const args = process.argv.slice(2);
  const syncUserProductAccess = args.includes('--sync-user-product-access');
  
  try {
    // 1. Sincronizar user_product_access (se solicitado)
    if (syncUserProductAccess) {
      logInfo('Modo: Sincronização de user_product_access');
      const resultado = await sincronizarUserProductAccess();
      logSuccess(`Sincronização concluída: ${resultado.sincronizados} registros processados, ${resultado.erros} erros`);
    }
    
    // 2. Atualizar status de liberação
    await atualizarStatusLiberacao();
    
    // 3. Gerar relatório
    await gerarRelatorio();
    
    logSuccess('\n✅ Processo de liberação automática concluído!');
    
  } catch (error) {
    logError(`\n❌ Erro: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
