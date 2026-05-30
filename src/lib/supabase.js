import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase non configurato. Aggiungi VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env'
    );
  }
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export { getSupabase };
