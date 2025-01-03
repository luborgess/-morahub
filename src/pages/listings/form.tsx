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
import { StorageService } from '@/services/storage.service'; // Import StorageService

export default function ListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, fetchCategories, createListing, updateListing } = useListing();

  const [loading, setLoading] = useState(false);
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
    fetchCategories();
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);

      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Você precisa estar logado para criar um anúncio');
      navigate('/auth');
      return;
    }

    if (!formData.subcategory_id) {
      setError('Selecione uma categoria');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload images if any
      let imageUrls = previewUrls.filter(url => url.startsWith('http') && !url.startsWith('blob:'));
      if (images.length > 0) {
        const { data: uploadedUrls, error: uploadError } = await StorageService.uploadImages(
          images,
          `users/${user.id}`
        );

        if (uploadError) throw uploadError;
        if (uploadedUrls) {
          imageUrls = [...imageUrls, ...uploadedUrls];
        }
      }

      const listingData = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        images: imageUrls,
        user_id: user.id,
      };

      const { error } = id
        ? await updateListing(id, listingData)
        : await createListing(listingData);

      if (error) throw error;
      navigate('/listings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Anúncio' : 'Criar Anúncio'}
        </h1>
        <p className="text-muted-foreground">
          Preencha os dados do seu anúncio
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.subcategory_id}
              onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => (
                  <div key={category.id}>
                    <SelectItem disabled value={category.id} className="font-bold">
                      {category.name}
                    </SelectItem>
                    {category.subcategories?.map((subcategory: any) => (
                      <SelectItem key={subcategory.id} value={subcategory.id} className="pl-4">
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Disponibilidade</Label>
          <Input
            id="availability"
            placeholder="Ex: Disponível para entrega em..."
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Imagens</Label>
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
                  className="absolute right-1 top-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <Icons.image className="mx-auto h-8 w-8 text-muted-foreground" />
                <span className="mt-2 block text-sm text-muted-foreground">
                  Adicionar Imagem
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/listings')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Icons.save className="mr-2 h-4 w-4" />
                {id ? 'Salvar Alterações' : 'Criar Anúncio'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
