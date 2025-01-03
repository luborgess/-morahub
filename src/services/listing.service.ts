import { supabase } from '../lib/supabase';

export type ListingType = 'SALE' | 'RENT' | 'DONATION' | 'EXCHANGE';
export type ListingStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type ListingCondition = 'NOVO' | 'SEMINOVO' | 'USADO' | 'DEFEITO';

export interface Listing {
  id: string;
  user_id: string;
  subcategory_id: string;
  title: string;
  description?: string;
  price?: number;
  type: ListingType;
  images?: string[];
  availability?: string;
  visualizacoes: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  status: ListingStatus;
  condition?: ListingCondition;
}

export interface ListingFilter {
  housing_id?: string;
  category_id?: string;
  subcategory_id?: string;
  type?: ListingType;
  condition?: ListingCondition;
  min_price?: number;
  max_price?: number;
  search_query?: string;
  status?: ListingStatus;
}

export class ListingService {
  // Obter categorias
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, subcategories(*)');

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Obter moradias
  static async getHousing() {
    try {
      const { data, error } = await supabase
        .from('housing')
        .select('*')
        .order('name');

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Criar anúncio
  static async createListing(data: Partial<Listing>) {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          ...data,
          status: 'ACTIVE',
          visualizacoes: 0,
        })
        .select()
        .single();

      return { data: listing, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Obter anúncio por ID
  static async getListingById(id: string) {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .select(`
          *,
          users (
            id,
            name,
            commercial_name,
            image_url,
            whatsapp_msg,
            celular
          ),
          subcategories (
            id,
            name,
            categories (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!listing) throw new Error('Anúncio não encontrado');

      // Incrementar visualizações
      const { error: updateError } = await supabase
        .from('listings')
        .update({ visualizacoes: (listing.visualizacoes || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating views:', updateError);
      }

      return { data: listing, error: null };
    } catch (error: any) {
      console.error('Error fetching listing:', error);
      return { 
        data: null, 
        error: error.message || 'Erro ao carregar o anúncio' 
      };
    }
  }

  // Listar anúncios com filtros
  static async getListings(filters: ListingFilter = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          users (
            id,
            name,
            commercial_name,
            image_url
          ),
          subcategories (
            id,
            name,
            categories (
              id,
              name,
              type
            )
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (filters.housing_id) {
        query = query.eq('housing_id', filters.housing_id);
      }
      if (filters.category_id) {
        query = query.eq('subcategories.category_id', filters.category_id);
      }
      if (filters.subcategory_id) {
        query = query.eq('subcategory_id', filters.subcategory_id);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.search_query) {
        query = query.ilike('title', `%${filters.search_query}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'ACTIVE');
      }

      // Paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;
      return { data, error, count };
    } catch (error) {
      return { data: null, error, count: 0 };
    }
  }

  // Atualizar anúncio
  static async updateListing(id: string, data: Partial<Listing>) {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      return { data: listing, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Deletar anúncio
  static async deleteListing(id: string) {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .update({ status: 'DELETED', deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data: listing, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}