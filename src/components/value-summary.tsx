
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event, BankAccount } from '@/types';
import { PiggyBank, Landmark, ArrowRightLeft } from 'lucide-react';

interface ValueSummaryProps {
  events: Event[];
  bankAccounts: BankAccount[];
}

export function ValueSummary({ events, bankAccounts }: ValueSummaryProps) {
  const totalReceived = events
    .filter(event => event.isPaid)
    .reduce((sum, event) => sum + event.value, 0);

  const totalToReceive = events
    .filter(event => event.isDone && !event.isPaid)
    .reduce((sum, event) => sum + event.value, 0);

  const transferredEvents = events
    .filter(event => event.isTransferred && event.transferDate)
    .sort((a, b) => new Date(b.transferDate!).getTime() - new Date(a.transferDate!).getTime());
    
  const totalTransferred = transferredEvents.reduce((sum, event) => sum + event.value, 0);

  const lastTransferredEvent = transferredEvents[0];
  const lastAccountUsed = lastTransferredEvent 
    ? bankAccounts.find(acc => acc.id === lastTransferredEvent.transferredToBankAccountId)
    : null;


  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <>
      <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body text-emerald-800 dark:text-emerald-200">Total Recebido</CardTitle>
          <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline text-emerald-900 dark:text-emerald-100">{formatCurrency(totalReceived)}</div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-body">
            Soma de todos os eventos pagos.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body text-amber-800 dark:text-amber-200">A Receber</CardTitle>
          <Landmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline text-amber-900 dark:text-amber-100">{formatCurrency(totalToReceive)}</div>
           <p className="text-xs text-amber-700 dark:text-amber-300 font-body">
            Soma dos eventos concluídos e pendentes de pagamento.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body text-blue-800 dark:text-blue-200">Total Transferido</CardTitle>
          <ArrowRightLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline text-blue-900 dark:text-blue-100">{formatCurrency(totalTransferred)}</div>
           <p className="text-xs text-blue-700 dark:text-blue-300 font-body truncate">
            {lastAccountUsed 
              ? `Última transferência para: ${lastAccountUsed.bankName} ${lastAccountUsed.accountNumber}`
              : 'Nenhuma transferência realizada ainda.'
            }
          </p>
        </CardContent>
      </Card>
    </>
  );
}
