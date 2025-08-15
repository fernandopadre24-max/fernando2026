
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BankAccount } from '@/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Banknote } from 'lucide-react';

interface AccountBalancesProps {
    accounts: BankAccount[];
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function AccountBalances({ accounts }: AccountBalancesProps) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Saldos em Contas</CardTitle>
                <CardDescription>
                    Resumo dos saldos em suas contas bancárias.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {accounts.length > 0 ? (
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <Link href="/banks" key={account.id}>
                                <div className="flex items-center hover:bg-muted/50 p-2 rounded-md transition-colors">
                                    <Avatar className="h-9 w-9 mr-4 rounded-md">
                                        <AvatarImage src={account.imageUrl} className="rounded-md" />
                                        <AvatarFallback className="rounded-md">
                                            <Banknote className="h-4 w-4 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">{account.bankName}</p>
                                        <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                                    </div>
                                    <div className={`text-right font-medium ${account.balance >= 0 ? '' : 'text-red-600'}`}>
                                        {formatCurrency(account.balance)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma conta bancária cadastrada.</p>
                )}
            </CardContent>
        </Card>
    )
}
