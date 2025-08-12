
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex flex-1 items-start justify-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
          <CardDescription>
            Visualize seus relatórios financeiros aqui. Esta funcionalidade está em construção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em breve, você poderá gerar e visualizar relatórios detalhados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
