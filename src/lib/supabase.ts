import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  name: string;
  commercial_name?: string;
  celular?: string;
  cpf?: string;
  birthdate?: string;
  bio?: string;
  whatsapp_msg?: string;
  image_url?: any;
  type: 'VISITOR' | 'UFMG' | 'RESIDENT' | 'ADMIN';
  housing_id?: string;
  ufmg_status?: 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';
  housing_status?: 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';
};
