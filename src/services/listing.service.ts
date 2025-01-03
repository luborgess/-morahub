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
        .from('subcategories')
        .select(`
          id,
          name,
          categories (
            id,
            name
          )
        `)
        .order('name');

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
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Usuário não autenticado');

      // Garantir que as imagens sejam salvas no formato correto
      const images = data.images?.map(img => {
        if (typeof img === 'string') {
          return { url: img };
        }
        return img;
      });

      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          ...data,
          images,
          user_id: user.data.user.id,
          status: 'ACTIVE',
          visualizacoes: 0,
        })
        .select('*')
        .single();

      return { data: listing, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Obter anúncio por ID
  static async getListingById(id: string) {
    try {
      console.log('Fetching listing details for id:', id);
      
      const { data: listing, error } = await supabase
        .from('listings')
        .select(`
          *,
          users!inner (
            id,
            name,
            commercial_name,
            image_url,
            whatsapp_msg,
            celular
          ),
          subcategories!inner (
            id,
            name,
            categories (
              id,
              name,
              type
            )
          )
        `)
        .eq('id', id)
        .single();

      console.log('Listing details result:', { listing, error });

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
          users:public_user_profiles!listings_user_id_fkey (
            id,
            name,
            commercial_name,
            image_url,
            whatsapp_msg,
            celular
          ),
          subcategories!inner (
            id,
            name,
            categories (
              id,
              name,
              type
            )
          )
        `, { count: 'exact' })
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

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

      // Paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      console.log('Listings query result:', { data, error, count });
      
      return { data, error, count };
    } catch (error) {
      return { data: null, error, count: 0 };
    }
  }

  // Atualizar anúncio
  static async updateListing(id: string, data: Partial<Listing>) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Usuário não autenticado');

      const { data: listing, error } = await supabase
        .from('listings')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.data.user.id) // Garante que apenas o dono pode editar
        .select('*')
        .single();

      if (!listing && !error) {
        return { 
          data: null, 
          error: new Error('Anúncio não encontrado ou sem permissão para editar') 
        };
      }

      return { data: listing, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Excluir anúncio (soft delete)
  static async deleteListing(id: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .rpc('soft_delete_listing', {
          listing_id: id
        });

      if (!data && !error) {
        return { error: new Error('Anúncio não encontrado ou sem permissão') };
      }

      return { error };
    } catch (error) {
      return { error };
    }
  }
}
