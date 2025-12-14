import { createClient } from '@supabase/supabase-js';

// Carrega as credenciais das variáveis de ambiente (se disponíveis)
// Fallback para valores hardcoded para manter compatibilidade com main operacional
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83';

// Usa variáveis de ambiente se disponíveis, senão usa valores padrão do main
// Isso garante que o main continue funcionando mesmo sem .env configurado

export const supabase = createClient(supabaseUrl, supabaseAnonKey);