import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://tivtybyhpwylhquufeiz.supabase.co';
const publishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);
export const supabase = supabaseConfigured ? createClient(url, publishableKey) : null;
