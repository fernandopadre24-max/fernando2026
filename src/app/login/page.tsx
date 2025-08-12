
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Nome de usuário é obrigatório.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const loggedIn = login(data.username, data.password);
      if (loggedIn) {
        toast({ title: 'Login bem-sucedido!', description: 'Bem-vindo de volta.' });
        router.push('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha no login',
          description: 'Nome de usuário ou senha incorretos.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 text-primary">
                 <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold font-headline">
                    Controle Financeiro
                </h1>
            </div>
        </div>
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Acessar sua Conta</CardTitle>
              <CardDescription>
                Digite seu nome de usuário e senha para entrar.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu-usuario"
                  {...form.register('username')}
                  disabled={isLoading}
                />
                 {form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" {...form.register('password')} disabled={isLoading}/>
                 {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
               <p className="text-sm text-center text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Cadastre-se aqui
                    </Link>
                </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
