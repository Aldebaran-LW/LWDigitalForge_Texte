/**
 * Script simples de diagnóstico do Supabase (CLI/local).
 *
 * Uso:
 *   node test-supabase.js
 *
 * Requer:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 *
 * Observação:
 * - Como o projeto usa RLS, algumas queries sem autenticação podem retornar vazio/erro,
 *   mas a conexão e o endpoint serão validados.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis ausentes: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('🔎 Testando Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Anon key presente:', Boolean(supabaseAnonKey));

  // Ping simples: tentativa de leitura (pode falhar por RLS, mas valida endpoint/SDK)
  const { error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    console.log('⚠️  Query retornou erro (pode ser RLS/sem auth):', error.message);
    console.log('   code:', error.code);
    process.exit(0);
  }

  console.log('✅ Query OK (profiles acessível).');
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err?.message || err);
  process.exit(1);
});

