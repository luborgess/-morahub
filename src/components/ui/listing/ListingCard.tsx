import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import type { Listing } from '@/services/listing.service';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorite } from '@/hooks/useFavorite';

const TYPE_COLORS = {
  SALE: 'bg-green-100 text-green-800',
  RENT: 'bg-blue-100 text-blue-800',
  DONATION: 'bg-purple-100 text-purple-800',
  EXCHANGE: 'bg-orange-100 text-orange-800',
};

const TYPE_LABELS = {
  SALE: 'Venda',
  RENT: 'Aluguel',
  DONATION: 'Doação',
  EXCHANGE: 'Troca',
};

const CONDITION_LABELS = {
  NOVO: 'Novo',
  SEMINOVO: 'Seminovo',
  USADO: 'Usado',
  DEFEITO: 'Com Defeito',
};

interface ListingCardProps {
  listing: Listing;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  onClick?: () => void;
}

export function ListingCard({ listing, onEdit, onDelete, showActions = false, onClick }: ListingCardProps) {
  const { user } = useAuth();
  const { checkIsFavorite, addFavorite, removeFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsFavorite(listing.id).then(setIsFavorite);
    }
  }, [user, listing.id, checkIsFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne navegação ao clicar no botão
    if (!user) return;

    if (isFavorite) {
      await removeFavorite(listing.id);
    } else {
      await addFavorite(listing.id);
    }
    setIsFavorite(!isFavorite);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary cursor-pointer" onClick={onClick}>
      <CardHeader className="relative">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Icons.image className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <Badge className={`absolute top-2 right-2 ${TYPE_COLORS[listing.type]}`}>
          {TYPE_LABELS[listing.type]}
        </Badge>
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2"
            onClick={handleFavorite}
          >
            {isFavorite ? (
              <Icons.heart className="h-5 w-5 fill-destructive text-destructive" />
            ) : (
              <Icons.heart className="h-5 w-5" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-1.5">
          <Link 
            to={`/listings/${listing.id}`}
            className="text-lg font-semibold leading-none hover:underline"
          >
            {listing.title}
          </Link>
          {listing.price > 0 && (
            <p className="text-xl font-bold text-primary">
              {formatPrice(listing.price)}
            </p>
          )}
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icons.eye className="h-4 w-4" />
            <span>{listing.visualizacoes || 0} visualizações</span>
          </div>
          {listing.condition && (
            <Badge variant="outline">
              {CONDITION_LABELS[listing.condition]}
            </Badge>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-6">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEdit}
            >
              <Icons.edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
