/**
 * Script de Verificação: Coluna expires_at em user_purchases
 * 
 * Este script verifica se a coluna expires_at existe na tabela user_purchases
 * antes de aplicar qualquer migration.
 * 
 * Execute com: node scripts/check-expires-at-column.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cores para output
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

async function checkColumn() {
  log('\n' + '='.repeat(60), 'blue');
  log('🔍 VERIFICANDO COLUNA expires_at', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  try {
    // Tentar fazer uma query que inclui expires_at
    // Se a coluna não existir, vai dar erro
    const { data, error } = await supabase
      .from('user_purchases')
      .select('id, expires_at')
      .limit(1);

    if (error) {
      if (error.message.includes('expires_at') || error.message.includes('column')) {
        log('❌ COLUNA expires_at NÃO EXISTE no banco de dados', 'red');
        log(`   Erro: ${error.message}`, 'red');
        log('\n📝 AÇÃO NECESSÁRIA:', 'yellow');
        log('   Aplique a migration: 20250109000000_ensure_expires_at_column.sql', 'yellow');
        log('   Esta migration é SEGURA e usa "IF NOT EXISTS"', 'yellow');
        return false;
      } else {
        log('⚠️  Erro ao verificar coluna:', 'yellow');
        log(`   ${error.message}`, 'yellow');
        return null; // Erro desconhecido
      }
    }

    // Se chegou aqui, a coluna existe!
    log('✅ COLUNA expires_at EXISTE no banco de dados', 'green');
    log('\n💡 O problema pode ser:', 'cyan');
    log('   1. Cache do Supabase desatualizado', 'cyan');
    log('   2. Tente recarregar a página (Ctrl+F5)', 'cyan');
    log('   3. Ou aguarde alguns minutos para o cache atualizar', 'cyan');
    
    // Tentar verificar se conseguimos ler o valor
    if (data && data.length > 0) {
      log('\n📊 Exemplo de dados encontrados:', 'blue');
      log(`   ID: ${data[0].id}`, 'blue');
      log(`   expires_at: ${data[0].expires_at || 'NULL'}`, 'blue');
    }
    
    return true;
  } catch (error) {
    log('❌ Erro inesperado:', 'red');
    log(`   ${error.message}`, 'red');
    return null;
  }
}

// Executar verificação
checkColumn().then(result => {
  if (result === false) {
    log('\n🔧 PRÓXIMOS PASSOS:', 'cyan');
    log('   1. Acesse o Supabase Dashboard', 'cyan');
    log('   2. Vá em SQL Editor', 'cyan');
    log('   3. Execute a migration: supabase/migrations/20250109000000_ensure_expires_at_column.sql', 'cyan');
    log('   4. A migration é segura (usa IF NOT EXISTS)', 'cyan');
    process.exit(1);
  } else if (result === true) {
    log('\n✅ Tudo OK! A coluna existe.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Não foi possível determinar o status da coluna.', 'yellow');
    process.exit(2);
  }
});

