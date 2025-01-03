import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { useListing } from '@/hooks/useListing';
import { useAuth } from '@/hooks/useAuth';
import { ListingService } from '@/services/listing.service';
import { StorageService } from '@/services/storage.service';

export default function ListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, fetchCategories, createListing, updateListing } = useListing();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'SALE',
    condition: 'NOVO',
    subcategory_id: '',
    availability: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        await fetchCategories();
        if (id) {
          const { data, error } = await ListingService.getListingById(id);
          if (error) throw error;
          if (data) {
            setFormData({
              title: data.title,
              description: data.description || '',
              price: data.price?.toString() || '',
              type: data.type,
              condition: data.condition || 'NOVO',
              subcategory_id: data.subcategory_id,
              availability: data.availability || '',
            });
            if (data.images) {
              setPreviewUrls(data.images);
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [id, fetchCategories]);

  const loadListing = async () => {
    try {
      const { data, error } = await ListingService.getListingById(id);
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          price: data.price?.toString() || '',
          type: data.type,
          condition: data.condition || 'NOVO',
          subcategory_id: data.subcategory_id,
          availability: data.availability || '',
        });
        if (data.images) {
          setPreviewUrls(data.images);
        }
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Upload images
      let imageUrls: string[] = [];
      
      // Se estiver editando, mantém as URLs existentes que não são URLs de preview (blob:)
      if (id) {
        imageUrls = previewUrls.filter(url => !url.startsWith('blob:'));
      }

      // Upload new images
      if (images.length > 0) {
        const uploadedUrls = await Promise.all(
          images.map((file) => StorageService.uploadImage(file))
        );
        const newUrls = uploadedUrls
          .map((r) => r.data?.url || '')
          .filter(Boolean);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const listingData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        images: imageUrls,
      };

      if (id) {
        const { error } = await updateListing(id, listingData);
        if (error) throw error;
      } else {
        const { error } = await createListing(listingData);
        if (error) throw error;
      }

      navigate('/listings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container flex items-center justify-center py-10">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Editar Anúncio' : 'Criar Anúncio'}
          </h1>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para {id ? 'editar seu' : 'criar um novo'} anúncio
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-destructive/50 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Venda</SelectItem>
                  <SelectItem value="RENT">Aluguel</SelectItem>
                  <SelectItem value="DONATION">Doação</SelectItem>
                  <SelectItem value="EXCHANGE">Troca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="condition">Condição</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOVO">Novo</SelectItem>
                  <SelectItem value="SEMINOVO">Seminovo</SelectItem>
                  <SelectItem value="USADO">Usado</SelectItem>
                  <SelectItem value="DEFEITO">Com Defeito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Categoria</Label>
              <Select
                value={formData.subcategory_id}
                onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
                required
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.categories?.name} - {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilidade</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="Ex: Disponível para entrega"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                      setImages(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <Icons.x className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="relative aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Icons.image className="mx-auto h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 block text-sm text-muted-foreground">
                      Adicionar Imagem
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/listings')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Salvar Alterações' : 'Criar Anúncio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
