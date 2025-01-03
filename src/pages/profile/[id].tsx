import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            housing (
              id,
              name,
              address
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-10">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-10">
        <div className="rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">
            {error || 'Perfil não encontrado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.name}
            </h1>
            {profile.commercial_name && (
              <p className="text-muted-foreground">
                {profile.commercial_name}
              </p>
            )}
          </div>
          {user?.id === profile.id && (
            <Button variant="outline" asChild>
              <a href={`/profile/edit`}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {/* Foto do perfil */}
          <div className="flex justify-center">
            {profile.image_url ? (
              <img
                src={typeof profile.image_url === 'string' ? profile.image_url : profile.image_url.url}
                alt={profile.name}
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                <Icons.user className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Informações básicas */}
          <div className="space-y-4 rounded-lg border p-4">
            <h2 className="font-semibold">Informações Básicas</h2>
            <dl className="space-y-2">
              {profile.bio && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Bio</dt>
                  <dd className="mt-1">{profile.bio}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1">{profile.email}</dd>
              </div>
              {profile.celular && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Celular</dt>
                  <dd className="mt-1">{profile.celular}</dd>
                </div>
              )}
              {profile.housing?.name && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Residência</dt>
                  <dd className="mt-1">{profile.housing.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tipo de Usuário</dt>
                <dd className="mt-1">
                  {profile.type === 'ADMIN' && 'Administrador'}
                  {profile.type === 'RESIDENT' && 'Residente'}
                  {profile.type === 'UFMG' && 'Membro UFMG'}
                  {profile.type === 'VISITOR' && 'Visitante'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Membro desde</dt>
                <dd className="mt-1">
                  {new Date(profile.created_at!).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </dd>
              </div>
            </dl>
          </div>

          {/* Status de validação */}
          <div className="space-y-4 rounded-lg border p-4">
            <h2 className="font-semibold">Status de Validação</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Vínculo UFMG
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      profile.ufmg_status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700'
                        : profile.ufmg_status === 'PENDING'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {profile.ufmg_status === 'ACTIVE' && 'Validado'}
                    {profile.ufmg_status === 'PENDING' && 'Pendente'}
                    {profile.ufmg_status === 'REJECTED' && 'Rejeitado'}
                    {profile.ufmg_status === 'NONE' && 'Não solicitado'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Vínculo com Residência
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      profile.housing_status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700'
                        : profile.housing_status === 'PENDING'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {profile.housing_status === 'ACTIVE' && 'Validado'}
                    {profile.housing_status === 'PENDING' && 'Pendente'}
                    {profile.housing_status === 'REJECTED' && 'Rejeitado'}
                    {profile.housing_status === 'NONE' && 'Não solicitado'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
