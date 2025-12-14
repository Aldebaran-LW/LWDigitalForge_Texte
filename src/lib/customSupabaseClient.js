import { createClient } from '@supabase/supabase-js';

// Carrega as credenciais das variáveis de ambiente (se disponíveis)
// Fallback para valores hardcoded para manter compatibilidade com main operacional
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA';

// Usa variáveis de ambiente se disponíveis, senão usa valores padrão do main
// Isso garante que o main continue funcionando mesmo sem .env configurado

export const supabase = createClient(supabaseUrl, supabaseAnonKey);