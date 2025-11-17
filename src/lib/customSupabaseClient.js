
import { createClient } from '@supabase/supabase-js';

// Lê as variáveis de ambiente do Vite (usadas na Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Make sure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
