import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { ListingCard } from '@/components/ui/listing/ListingCard';
import { useFavorite } from '@/hooks/useFavorite';

export default function FavoritesPage() {
  const { favorites, loading, error } = useFavorite();

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-10">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">
            Erro ao carregar favoritos. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Favoritos</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'item' : 'itens'} salvos
          </p>
        </div>
        <Link to="/listings">
          <Button variant="outline">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Voltar para Anúncios
          </Button>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
          <Icons.heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum favorito encontrado
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Você ainda não salvou nenhum anúncio como favorito.
          </p>
          <Link to="/listings">
            <Button className="mt-4">
              <Icons.search className="mr-2 h-4 w-4" />
              Explorar Anúncios
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((favorite) => (
            <ListingCard
              key={favorite.id}
              listing={favorite.listing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
