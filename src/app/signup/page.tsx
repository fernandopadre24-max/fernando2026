
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

const signupSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter pelo menos 3 caracteres.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const success = register(data.username, data.password);
      if (success) {
        toast({ title: 'Cadastro realizado!', description: 'Você já pode fazer o login.' });
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: 'Este nome de usuário já existe. Tente outro.',
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
              <CardTitle className="text-2xl">Criar uma Nova Conta</CardTitle>
              <CardDescription>
                Escolha um nome de usuário e uma senha para começar.
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
                <Input id="password" type="password" {...form.register('password')} disabled={isLoading} />
                 {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Conta'}
              </Button>
               <p className="text-sm text-center text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Faça o login
                    </Link>
                </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
