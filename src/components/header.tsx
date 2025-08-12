
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';

const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Início';
    if (pathname.startsWith('/events')) return 'Eventos';
    if (pathname.startsWith('/artists')) return 'Artistas';
    if (pathname.startsWith('/contractors')) return 'Contratantes';
    if (pathname.startsWith('/banks')) return 'Bancos';
    if (pathname.startsWith('/finance')) return 'Financeiro';
    if (pathname.startsWith('/reports')) return 'Relatórios';
    if (pathname.startsWith('/settings')) return 'Configurações';
    if (pathname.startsWith('/users')) return 'Usuários';
    return 'Controle Financeiro';
};


export function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold sm:text-xl">
            {pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">Controle Financeiro</p>
      </div>
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sair</span>
      </Button>
    </header>
  );
}
