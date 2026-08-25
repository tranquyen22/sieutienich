import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pswpljgnxboqvlngjgmy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3BsamdueGJvcXZsbmdqZ215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1Njg1MjksImV4cCI6MjEwMzE0NDUyOX0.xaAZrWMBtjMQHKYp3TF63qj7y7UB-fCLJahxZRaCc7Y';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
