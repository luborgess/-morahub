import { useCallback, useEffect, useState } from 'react';
import { Favorite, FavoriteService } from '@/services/favorite.service';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export function useFavorite() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await FavoriteService.getFavorites();
      if (error) throw error;
      setFavorites(data || []);
    } catch (err: any) {
      setError(err);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addFavorite = useCallback(async (listingId: string) => {
    try {
      const { error } = await FavoriteService.addFavorite(listingId);
      if (error) throw error;
      toast.success('Adicionado aos favoritos');
      fetchFavorites();
    } catch (err: any) {
      toast.error('Erro ao adicionar aos favoritos');
    }
  }, [fetchFavorites]);

  const removeFavorite = useCallback(async (listingId: string) => {
    try {
      const { error } = await FavoriteService.removeFavorite(listingId);
      if (error) throw error;
      toast.success('Removido dos favoritos');
      fetchFavorites();
    } catch (err: any) {
      toast.error('Erro ao remover dos favoritos');
    }
  }, [fetchFavorites]);

  const checkIsFavorite = useCallback(async (listingId: string) => {
    try {
      const { data } = await FavoriteService.isFavorite(listingId);
      return data;
    } catch (err) {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    checkIsFavorite,
    fetchFavorites
  };
}
