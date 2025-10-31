import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
