import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { Alert, AlertDescription } from '../alert';
import { Icons } from '../icons';
import { toast } from '../use-toast';

export function AuthForm() {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
      } else {
        const name = formData.get('name') as string;
        await signUp(email, password, { 
          name,
          type: 'VISITOR',
          ufmg_status: 'NONE',
          housing_status: 'NONE'
        });
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao MoraHub!",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setFormError(error?.message || 'Ocorreu um erro. Tente novamente.');
      
      // Se for um erro específico do Supabase
      if (error?.message?.includes('Invalid login credentials')) {
        setFormError('Email ou senha incorretos');
      } else if (error?.message?.includes('Email not confirmed')) {
        setFormError('Por favor, confirme seu email antes de fazer login');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo ao MoraHub</CardTitle>
        <CardDescription>
          {isLogin 
            ? "Entre com sua conta para continuar" 
            : "Crie sua conta para começar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" onValueChange={(v) => setIsLogin(v === 'login')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registro</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </TabsContent>

            {formError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {formError}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
