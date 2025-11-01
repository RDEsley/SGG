import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xqeghaecjpjcekvoixvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZWdoYWVjanBqY2Vrdm9peHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjM0MjcsImV4cCI6MjA3NzMzOTQyN30.qGLo_Rt7Mh6pVUwHEcYgUud74qDBV52_ihWqohhO1NE';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
