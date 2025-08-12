
'use client';

import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
           <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 text-primary">
                 <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-bold font-headline">
                    Bem-vindo ao Controle Financeiro
                </h1>
            </div>
        </div>
          <CardTitle>Seu App de Gestão Financeira Pessoal</CardTitle>
          <CardDescription>
            Comece a organizar suas finanças de forma simples e eficiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este é um protótipo em desenvolvimento. Explore as funcionalidades disponíveis no menu lateral para começar.
          </p>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground mx-auto">
                Para navegar, utilize o menu lateral. Se ele não estiver visível, clique no ícone no canto superior esquerdo.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
