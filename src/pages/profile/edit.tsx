import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
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
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth.service';
import { StorageService } from '@/services/storage.service';
import { supabase } from '@/lib/supabase';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [housing, setHousing] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    commercial_name: '',
    celular: '',
    whatsapp_msg: '',
    bio: '',
    housing_id: '',
  });

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const { data, error } = await supabase
          .from('housing')
          .select('*')
          .order('name');
        if (error) throw error;
        setHousing(data || []);
      } catch (err: any) {
        console.error('Error fetching housing:', err);
      }
    };

    if (user) {
      setFormData({
        name: user.name || '',
        commercial_name: user.commercial_name || '',
        celular: user.celular || '',
        whatsapp_msg: user.whatsapp_msg || '',
        bio: user.bio || '',
        housing_id: user.housing_id || '',
      });
      setImagePreview(user.image_url && typeof user.image_url === 'object' ? user.image_url.url : user.image_url);
    }

    fetchHousing();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let image_url = user.image_url;
      if (imageFile) {
        const { data: uploadedUrl, error: uploadError } = await StorageService.uploadImage(imageFile);
        if (uploadError) throw uploadError;
        image_url = { url: uploadedUrl };
      }

      const updates = {
        ...formData,
        image_url,
      };

      const updatedProfile = await AuthService.updateProfile(user.id, updates);
      setUser(updatedProfile);
      navigate(`/profile/${user.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <div className="rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">
            Você precisa estar logado para editar seu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
          <p className="text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-destructive/50 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Foto do perfil */}
          <div className="space-y-4">
            <Label>Foto do Perfil</Label>
            <div className="flex items-center space-x-4">
              {imagePreview || user.image_url ? (
                <img
                  src={imagePreview || (typeof user.image_url === 'string' ? user.image_url : user.image_url.url)}
                  alt={formData.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Icons.user className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  <Icons.image className="mr-2 h-4 w-4" />
                  Alterar Foto
                </Button>
              </div>
            </div>
          </div>

          {/* Informações básicas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercial_name">Nome Comercial</Label>
              <Input
                id="commercial_name"
                value={formData.commercial_name}
                onChange={(e) =>
                  setFormData({ ...formData, commercial_name: e.target.value })
                }
                placeholder="Nome para exibir em seus anúncios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="housing">Residência</Label>
                <Select
                  value={formData.housing_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, housing_id: value })
                  }
                >
                  <SelectTrigger id="housing">
                    <SelectValue placeholder="Selecione uma residência" />
                  </SelectTrigger>
                  <SelectContent>
                    {housing.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_msg">Mensagem padrão do WhatsApp</Label>
              <Textarea
                id="whatsapp_msg"
                value={formData.whatsapp_msg}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_msg: e.target.value })
                }
                placeholder="Mensagem que será enviada quando alguém clicar no botão do WhatsApp"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${user.id}`)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
