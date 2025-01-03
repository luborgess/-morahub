import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ListingService } from '@/services/listing.service';

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

const TYPE_COLORS = {
  SALE: 'bg-green-100 text-green-800',
  RENT: 'bg-blue-100 text-blue-800',
  DONATION: 'bg-purple-100 text-purple-800',
  EXCHANGE: 'bg-orange-100 text-orange-800',
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const { data, error } = await ListingService.getListingById(id!);
      if (error) throw error;
      setListing(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      setLoading(true);
      const { error } = await ListingService.deleteListing(id!);
      if (error) throw error;
      navigate('/listings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-10">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container py-10">
        <div className="rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">
            {error || 'Anúncio não encontrado'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/listings')}
          >
            Voltar para Anúncios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Galeria de Imagens */}
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {listing.images && listing.images.length > 0 ? (
              <>
                <img
                  src={listing.images[currentImage]}
                  alt={`${listing.title} - Imagem ${currentImage + 1}`}
                  className="h-full w-full object-cover"
                />
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`h-2 w-2 rounded-full ${
                          index === currentImage
                            ? 'bg-primary'
                            : 'bg-primary/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Icons.image className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Informações do Anúncio */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            {listing.price > 0 && (
              <p className="mt-2 text-3xl font-bold text-primary">
                {formatPrice(listing.price)}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className={TYPE_COLORS[listing.type]}>
                {TYPE_LABELS[listing.type]}
              </Badge>
              {listing.condition && (
                <Badge variant="outline">
                  {CONDITION_LABELS[listing.condition]}
                </Badge>
              )}
              <Badge variant="secondary">
                <Icons.eye className="mr-1 h-4 w-4" />
                {listing.visualizacoes || 0} visualizações
              </Badge>
            </div>
          </div>

          {/* Descrição */}
          {listing.description && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Descrição</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {listing.description}
              </p>
            </div>
          )}

          {/* Informações do Vendedor */}
          {listing.users && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    {listing.users.image_url ? (
                      <img
                        src={listing.users.image_url}
                        alt={listing.users.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icons.user className="h-full w-full p-2" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">
                    {listing.users.commercial_name || listing.users.name}
                  </p>
                  {listing.users.whatsapp_msg && (
                    <p className="text-sm text-muted-foreground">
                      {listing.users.whatsapp_msg}
                    </p>
                  )}
                </div>
              </div>
              {listing.users.celular && (
                <Button
                  className="w-full"
                  onClick={() => {
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
          )}

          {/* Ações do Anúncio */}
          {user?.id === listing.user_id && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/listings/edit/${listing.id}`)}
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
          )}
        </div>
      </div>
    </div>
  );
}
