/**
 * Script para aplicar a migração de correção de email admin
 * 
 * Este script aplica a migração que permite que admins vejam emails
 * na tabela profiles.
 * 
 * IMPORTANTE: Este script requer SERVICE_ROLE_KEY (não anon key)
 * Execute apenas se tiver acesso ao service role key do Supabase
 * 
 * Execute com: node scripts/apply-migration-email-admin.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Credenciais do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente');
  console.log('\n📝 Para executar este script:');
  console.log('1. Obtenha o Service Role Key do Supabase Dashboard');
  console.log('2. Execute: SUPABASE_SERVICE_ROLE_KEY=seu_key node scripts/apply-migration-email-admin.js');
  console.log('\n⚠️  ATENÇÃO: Service Role Key tem acesso total ao banco. Mantenha segredo!');
  process.exit(1);
}

// Criar cliente com service role (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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

async function applyMigration() {
  log('\n🚀 Aplicando migração: Fix Admin Email Access', 'cyan');
  log('─'.repeat(60), 'cyan');

  try {
    // Ler o arquivo de migração
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250110000000_fix_admin_email_access.sql');
    log(`\n📄 Lendo arquivo: ${migrationPath}`, 'blue');
    
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    if (!migrationSQL) {
      throw new Error('Arquivo de migração vazio ou não encontrado');
    }

    log('✅ Arquivo de migração lido com sucesso', 'green');
    log(`\n📝 Executando SQL...`, 'blue');

    // Executar o SQL diretamente usando rpc ou query
    // Nota: Supabase JS client não tem método direto para executar SQL arbitrário
    // Vamos usar a abordagem de executar cada comando separadamente
    
    // Dividir o SQL em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    log(`\n🔧 Executando ${commands.length} comandos SQL...`, 'blue');

    // Executar via Supabase REST API usando fetch
    // A forma mais segura é usar o Management API do Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`
      },
      body: JSON.stringify({ sql: migrationSQL })
    }).catch(async () => {
      // Se rpc não existir, tentar executar via SQL direto
      // Usar a API de migrations do Supabase
      log('⚠️  Método RPC não disponível, tentando alternativa...', 'yellow');
      
      // Executar comandos via Supabase Management API
      // Isso requer acesso ao Management API
      throw new Error('Método alternativo necessário. Use o Supabase Dashboard ou CLI.');
    });

    if (response && response.ok) {
      log('\n✅ Migração aplicada com sucesso!', 'green');
      log('\n📋 Verificando se as políticas foram criadas...', 'blue');
      
      // Verificar se as políticas existem
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'profiles');

      if (!policiesError && policies) {
        log(`✅ Encontradas ${policies.length} políticas na tabela profiles`, 'green');
      }

      return true;
    } else {
      const errorText = await response.text();
      throw new Error(`Erro na resposta: ${errorText}`);
    }

  } catch (error) {
    log(`\n❌ Erro ao aplicar migração: ${error.message}`, 'red');
    log('\n💡 Alternativas:', 'yellow');
    log('1. Aplique manualmente via Supabase Dashboard (SQL Editor)', 'blue');
    log('2. Use o Supabase CLI: supabase db push', 'blue');
    log('3. Veja o arquivo: APLICAR_MIGRACAO_EMAIL_ADMIN.md', 'blue');
    return false;
  }
}

// Executar
applyMigration()
  .then(success => {
    if (success) {
      log('\n✨ Processo concluído!', 'green');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    log(`\n💥 Erro fatal: ${error.message}`, 'red');
    process.exit(1);
  });









