import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwwwyuwighdehmvnolrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ2OTksImV4cCI6MjA3NzA5MDY5OX0.UhNnuDZezEVxg1E5Y-9S_C_kdCdnWa5iUlSS3Ze2ACE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);