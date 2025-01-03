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

  console.log('ListingCard data:', listing);

  return (
    <Card 
      className="h-full flex flex-col hover:border-primary cursor-pointer" 
      onClick={() => onClick ? onClick() : window.location.href = `/listings/${listing.id}`}
    >
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
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{listing.title}</h3>
            {listing.price > 0 && (
              <p className="text-lg font-bold text-primary">
                {formatPrice(listing.price)}
              </p>
            )}
          </div>

          {listing.users && (
            <div className="flex items-center space-x-2">
              {listing.users.image_url ? (
                <img
                  src={listing.users.image_url}
                  alt={listing.users.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Icons.user className="h-4 w-4" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">
                  {listing.users.commercial_name || listing.users.name}
                </p>
                {listing.users.whatsapp_msg && (
                  <p className="text-xs text-muted-foreground">
                    {listing.users.whatsapp_msg}
                  </p>
                )}
              </div>
            </div>
          )}

          {listing.users?.celular && (
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                const msg = encodeURIComponent(
                  `Olá! Vi seu anúncio "${listing.title}" no MoraHub e gostaria de mais informações.`
                );
                window.open(
                  `https://wa.me/55${listing.users.celular}?text=${msg}`,
                  '_blank'
                );
              }}
            >
              <Icons.whatsapp className="mr-2 h-4 w-4" />
              Contatar via WhatsApp
            </Button>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Icons.edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            <Icons.trash className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
