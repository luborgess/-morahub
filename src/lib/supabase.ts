import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export interface ImageUrl {
  url: string;
  path?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  image_url?: string | ImageUrl;
  celular?: string;
  whatsapp_msg?: string;
  commercial_name?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    name?: string;
    image_url?: string;
  };
  cpf?: string;
  birthdate?: string;
  bio?: string;
  type: 'VISITOR' | 'UFMG' | 'RESIDENT' | 'ADMIN';
  housing_id?: string;
  ufmg_status?: 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';
  housing_status?: 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';
}

export interface ListingImage {
  url: string;
  path?: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
