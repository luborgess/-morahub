import { supabase } from '../lib/supabase';

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: any;
}

export class FavoriteService {
  static async getFavorites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          listing:listings (
            id,
            title,
            price,
            type,
            condition,
            images,
            visualizacoes,
            users (
              id,
              name,
              commercial_name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async addFavorite(listingId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('favorites')
        .insert([{ 
          listing_id: listingId,
          user_id: user.id,
        }])
        .select('*')
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async removeFavorite(listingId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ 
          listing_id: listingId,
          user_id: user.id,
        });

      return { error };
    } catch (error) {
      return { error };
    }
  }

  static async isFavorite(listingId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: false, error: null };

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .match({ 
          listing_id: listingId,
          user_id: user.id,
        })
        .maybeSingle();

      return { data: !!data, error };
    } catch (error) {
      return { data: false, error };
    }
  }
}
