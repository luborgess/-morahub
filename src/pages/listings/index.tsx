import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { ListingCard } from '@/components/ui/listing/ListingCard';
import { ListingFilters } from '@/components/ui/listing/ListingFilters';
import { useListing } from '@/hooks/useListing';
import { useAuth } from '@/hooks/useAuth';

export default function ListingsPage() {
  const { user } = useAuth();
  const {
    listings,
    totalCount,
    currentPage,
    loading,
    error,
    fetchListings,
  } = useListing();

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anúncios</h1>
          <p className="text-muted-foreground">
            {totalCount} anúncios encontrados
          </p>
        </div>
        {user && (
          <Link to="/listings/new">
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              Criar Anúncio
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <ListingFilters />
          </div>
        </div>

        <div className="lg:col-span-3">
          {error ? (
            <div className="rounded-lg border border-destructive/50 p-4">
              <p className="text-sm text-destructive">
                Erro ao carregar anúncios. Tente novamente.
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Icons.empty className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum anúncio encontrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tente ajustar os filtros ou criar um novo anúncio.
              </p>
              {user && (
                <Link to="/listings/new">
                  <Button className="mt-4">
                    <Icons.plus className="mr-2 h-4 w-4" />
                    Criar Anúncio
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  showActions={user?.id === listing.user_id}
                />
              ))}
            </div>
          )}

          {totalCount > listings.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchListings(currentPage + 1)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Icons.more className="mr-2 h-4 w-4" />
                    Carregar Mais
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
