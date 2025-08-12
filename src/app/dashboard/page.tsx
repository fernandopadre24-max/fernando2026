
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bem-vindo, {user.username}!</CardTitle>
          <CardDescription>
            Você está logado com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Este é o seu painel. No futuro, suas funcionalidades aparecerão aqui.</p>
        </CardContent>
        <CardFooter>
            <Button onClick={logout} className="w-full">
                Sair
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
