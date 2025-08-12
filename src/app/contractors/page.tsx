
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContractorsPage() {
  return (
    <div className="flex flex-1 items-start justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contratantes</CardTitle>
          <CardDescription>
            Gerencie seus contratantes aqui. Esta funcionalidade está em construção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em breve, você poderá adicionar, editar e visualizar seus contratantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
