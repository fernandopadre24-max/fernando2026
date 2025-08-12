
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArtistsPage() {
  return (
    <div className="flex flex-1 items-start justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Artistas</CardTitle>
          <CardDescription>
            Gerencie seus artistas aqui. Esta funcionalidade está em construção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em breve, você poderá adicionar, editar e visualizar seus artistas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
