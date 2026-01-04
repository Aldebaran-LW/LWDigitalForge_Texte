/**
 * Script de Teste: Criação de Trial
 * 
 * Este script testa a criação de um trial na tabela user_trials
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

async function testTrialTable() {
  log('\n' + '='.repeat(60), 'blue');
  log('🔍 TESTANDO TABELA user_trials', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  // 1. Verificar estrutura da tabela
  log('1. Verificando estrutura da tabela...', 'cyan');
  const expectedColumns = ['id', 'user_id', 'app_id', 'started_at', 'expires_at', 'is_active', 'created_at'];
  
  for (const column of expectedColumns) {
    try {
      const { error } = await supabase
        .from('user_trials')
        .select(column)
        .limit(0);

      if (error) {
        log(`   ❌ Coluna ${column}: ${error.message}`, 'red');
      } else {
        log(`   ✅ Coluna ${column}: OK`, 'green');
      }
    } catch (error) {
      log(`   ❌ Coluna ${column}: ${error.message}`, 'red');
    }
  }

  // 2. Verificar se há produtos disponíveis
  log('\n2. Verificando produtos disponíveis...', 'cyan');
  const { data: products, error: productsError } = await supabase
    .from('registered_apps')
    .select('id, name, trial_period_days')
    .limit(5);

  if (productsError) {
    log(`   ❌ Erro ao buscar produtos: ${productsError.message}`, 'red');
    return;
  }

  if (!products || products.length === 0) {
    log('   ⚠️  Nenhum produto encontrado', 'yellow');
    return;
  }

  log(`   ✅ ${products.length} produto(s) encontrado(s):`, 'green');
  products.forEach(p => {
    log(`      - ${p.name} (ID: ${p.id.substring(0, 8)}...)`, 'blue');
  });

  // 3. Verificar políticas RLS
  log('\n3. Verificando políticas RLS...', 'cyan');
  const { data: rlsTest, error: rlsError } = await supabase
    .from('user_trials')
    .select('*')
    .limit(1);

  if (rlsError) {
    if (rlsError.code === '42501' || rlsError.message.includes('permission')) {
      log('   ✅ RLS está ativo (esperado sem autenticação)', 'green');
    } else {
      log(`   ⚠️  Erro RLS: ${rlsError.message}`, 'yellow');
    }
  } else {
    log('   ⚠️  RLS pode não estar totalmente restritivo', 'yellow');
  }

  log('\n' + '='.repeat(60), 'blue');
  log('📝 PRÓXIMOS PASSOS:', 'cyan');
  log('   1. Verifique o console do navegador para ver o erro exato', 'cyan');
  log('   2. Certifique-se de estar logado', 'cyan');
  log('   3. Verifique se o produto tem trial_period_days configurado', 'cyan');
  log('='.repeat(60) + '\n', 'blue');
}

testTrialTable().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

