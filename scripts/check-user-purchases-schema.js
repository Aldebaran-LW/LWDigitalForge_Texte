/**
 * Script de Verificação: Estrutura completa da tabela user_purchases
 * 
 * Este script verifica todas as colunas necessárias na tabela user_purchases
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

// Colunas esperadas conforme a migration inicial
const expectedColumns = [
  'id',
  'user_id',
  'app_id',
  'purchase_type',
  'amount_paid',
  'payment_method',
  'payment_id',
  'status',
  'expires_at',
  'created_at',
  'updated_at'
];

async function checkAllColumns() {
  log('\n' + '='.repeat(60), 'blue');
  log('🔍 VERIFICANDO TODAS AS COLUNAS DE user_purchases', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  const missingColumns = [];
  const existingColumns = [];

  for (const column of expectedColumns) {
    try {
      // Tentar fazer uma query com essa coluna específica
      const { error } = await supabase
        .from('user_purchases')
        .select(column)
        .limit(0); // Não retornar dados, só verificar se a coluna existe

      if (error) {
        if (error.message.includes(column) || error.message.includes('column')) {
          log(`❌ Coluna ${column}: NÃO EXISTE`, 'red');
          missingColumns.push(column);
        } else {
          log(`⚠️  Coluna ${column}: Erro desconhecido - ${error.message}`, 'yellow');
        }
      } else {
        log(`✅ Coluna ${column}: EXISTE`, 'green');
        existingColumns.push(column);
      }
    } catch (error) {
      log(`❌ Coluna ${column}: Erro - ${error.message}`, 'red');
      missingColumns.push(column);
    }
  }

  log('\n' + '='.repeat(60), 'blue');
  log('📊 RESUMO', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Colunas existentes: ${existingColumns.length}/${expectedColumns.length}`, 'green');
  log(`❌ Colunas faltando: ${missingColumns.length}`, missingColumns.length > 0 ? 'red' : 'green');

  if (missingColumns.length > 0) {
    log('\n📝 COLUNAS FALTANDO:', 'yellow');
    missingColumns.forEach(col => log(`   - ${col}`, 'yellow'));
    log('\n🔧 AÇÃO NECESSÁRIA:', 'cyan');
    log('   Aplique a migration completa para adicionar todas as colunas faltantes', 'cyan');
  } else {
    log('\n✅ Todas as colunas existem!', 'green');
  }

  return { missingColumns, existingColumns };
}

checkAllColumns().then(({ missingColumns }) => {
  process.exit(missingColumns.length > 0 ? 1 : 0);
});

