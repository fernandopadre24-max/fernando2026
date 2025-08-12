
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventsPage() {
  return (
    <div className="flex flex-1 items-start justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            Gerencie seus eventos aqui. Esta funcionalidade está em construção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em breve, você poderá adicionar, editar e visualizar seus eventos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
