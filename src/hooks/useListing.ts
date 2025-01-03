import { create } from 'zustand';
import { ListingService, type Listing, type ListingFilter } from '../services/listing.service';

interface ListingState {
  listings: Listing[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: any;
  filters: ListingFilter;
  categories: any[];
  housing: any[];
  
  // Ações
  fetchListings: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchHousing: () => Promise<void>;
  setFilters: (filters: ListingFilter) => void;
  createListing: (data: Partial<Listing>) => Promise<{ data: Listing | null; error: any }>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<{ data: Listing | null; error: any }>;
  deleteListing: (id: string) => Promise<{ data: Listing | null; error: any }>;
}

export const useListing = create<ListingState>((set, get) => ({
  listings: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {},
  categories: [],
  housing: [],

  fetchListings: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      const { data, count, error } = await ListingService.getListings(get().filters, page);
      if (error) throw error;
      set({ 
        listings: data || [], 
        totalCount: count || 0,
        currentPage: page,
      });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await ListingService.getCategories();
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      set({ error });
    }
  },

  fetchHousing: async () => {
    try {
      const { data, error } = await ListingService.getHousing();
      if (error) throw error;
      set({ housing: data || [] });
    } catch (error) {
      set({ error });
    }
  },

  setFilters: (filters: ListingFilter) => {
    set({ filters });
    get().fetchListings(1); // Reset para primeira página ao mudar filtros
  },

  createListing: async (data: Partial<Listing>) => {
    try {
      set({ loading: true, error: null });
      const result = await ListingService.createListing(data);
      if (result.error) throw result.error;
      // Atualizar lista após criar
      await get().fetchListings(get().currentPage);
      return result;
    } catch (error) {
      set({ error });
      return { data: null, error };
    } finally {
      set({ loading: false });
    }
  },

  updateListing: async (id: string, data: Partial<Listing>) => {
    try {
      set({ loading: true, error: null });
      const result = await ListingService.updateListing(id, data);
      if (result.error) throw result.error;
      // Atualizar lista após editar
      await get().fetchListings(get().currentPage);
      return result;
    } catch (error) {
      set({ error });
      return { data: null, error };
    } finally {
      set({ loading: false });
    }
  },

  deleteListing: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const result = await ListingService.deleteListing(id);
      if (result.error) throw result.error;
      // Atualizar lista após deletar
      await get().fetchListings(get().currentPage);
      return result;
    } catch (error) {
      set({ error });
      return { data: null, error };
    } finally {
      set({ loading: false });
    }
  },
}));
