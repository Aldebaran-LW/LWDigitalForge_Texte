/**
 * Script para criar os usuários de clientes solicitados
 * 
 * Uso:
 *   node scripts/criar-usuarios-clientes.js
 * 
 * Requisitos:
 *   - Edge Function create-user deve estar deployada
 *   - Você deve estar autenticado como ADMIN
 *   - Variáveis de ambiente configuradas:
 *     - VITE_SUPABASE_URL
 *     - VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const usuarios = [
  {
    email: 'anapaula@cliente.com',
    password: 'ana1234',
    full_name: 'Ana Paula',
    phone: null,
    role: 'USER'
  },
  {
    email: 'laisfernanda@cliente.com',
    password: 'lais1234',
    full_name: 'Lais Fernanda',
    phone: null,
    role: 'USER'
  }
];

async function criarUsuarios() {
  console.log('🔐 Verificando autenticação...');
  
  // Verificar se está autenticado
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('❌ Erro: Você precisa estar autenticado como ADMIN.');
    console.log('\n📝 Para autenticar:');
    console.log('   1. Acesse o portal admin');
    console.log('   2. Faça login como administrador');
    console.log('   3. Abra o console do navegador');
    console.log('   4. Execute: localStorage.getItem("sb-wwwwyuwighdehmvnolrl-auth-token")');
    console.log('   5. Use esse token para autenticar\n');
    return;
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    console.error('❌ Erro: Você precisa ser ADMIN para criar usuários.');
    return;
  }

  console.log('✅ Autenticado como ADMIN\n');

  // Criar cada usuário
  for (const usuario of usuarios) {
    console.log(`📝 Criando usuário: ${usuario.email}...`);
    
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify(usuario)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ Erro ao criar ${usuario.email}:`, data.error || data.message);
        continue;
      }

      console.log(`✅ Usuário ${usuario.email} criado com sucesso!`);
      console.log(`   ID: ${data.user?.id}`);
      console.log(`   Email: ${data.user?.email}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Erro ao criar ${usuario.email}:`, error.message);
    }
  }

  console.log('✨ Processo concluído!');
}

// Executar
criarUsuarios().catch(console.error);
