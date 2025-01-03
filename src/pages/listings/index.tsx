import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { ListingService } from '@/services/listing.service';
import { ListingCard } from '@/components/ui/listing/ListingCard';
import { useToast } from '@/components/ui/use-toast';

export default function ListingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await ListingService.getListings();
      if (error) throw error;
      setListings(data || []);
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar anúncios',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/listings/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      setLoading(true);
      const { error } = await ListingService.deleteListing(id);
      if (error) throw error;
      
      toast({
        title: 'Anúncio excluído',
        description: 'O anúncio foi excluído com sucesso.',
      });
      
      loadListings();
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir anúncio',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Anúncios</h1>
        {user && (
          <Button onClick={() => navigate('/listings/new')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Criar Anúncio
          </Button>
        )}
      </div>

      {/* Lista de anúncios */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Icons.image className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-semibold">Nenhum anúncio encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Não encontramos nenhum anúncio com os filtros selecionados.
          </p>
          {user && (
            <Button className="mt-4" onClick={() => navigate('/listings/new')}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Criar Anúncio
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showActions={user?.id === listing.user_id}
              onEdit={() => handleEdit(listing.id)}
              onDelete={() => handleDelete(listing.id)}
              onClick={() => navigate(`/listings/${listing.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
