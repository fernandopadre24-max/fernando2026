
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { Calendar, Mic, UserSquare, LogOut, Landmark, DollarSign, Tag, PieChart, Cog, Loader } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
    { path: '/finance', icon: DollarSign, name: 'Financeiro' },
    { path: '/banks', icon: Landmark, name: 'Bancos' },
    { path: '/', icon: Calendar, name: 'Eventos' },
    { path: '/artists', icon: Mic, name: 'Artistas' },
    { path: '/contractors', icon: UserSquare, name: 'Contratantes' },
    { path: '/finance/categories', icon: Tag, name: 'Categorias' },
    { path: '/settings', icon: Cog, name: 'Configurações' },
    { path: '/reports', icon: PieChart, name: 'Relatórios' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, getUserData, isLoading } = useAuth();

  const [customIcons, setCustomIcons] = React.useState<{ [key: string]: string }>({});
  const [appName, setAppName] = React.useState('Controle Financeiro');
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const updateTheme = React.useCallback(() => {
      if (user) {
        const savedTheme = getUserData('app-theme');
        if (savedTheme) {
            const { icons, appName: savedAppName } = savedTheme;
            if (icons) {
                setCustomIcons(icons);
            } else {
                 setCustomIcons({});
            }
            if (savedAppName) {
              setAppName(savedAppName);
            } else {
              setAppName('Controle Financeiro');
            }
        } else {
            setCustomIcons({});
            setAppName('Controle Financeiro');
        }
      }
  }, [user, getUserData]);

  React.useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  React.useEffect(() => {
    if (user) {
      updateTheme();
    }
    const handleThemeUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'theme-updated' && user) {
        updateTheme();
      }
    };

    window.addEventListener('message', handleThemeUpdate);
    return () => {
      window.removeEventListener('message', handleThemeUpdate);
    };
  }, [user, updateTheme]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && (pathname === '/login' || pathname === '/signup')) {
    return <>{children}</>;
  }
  
  if (!user) {
      return null;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarHeader>
             <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-primary font-headline">
                    {appName}
                </h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                    <SidebarMenuItem key={item.path}>
                        <Link href={item.path}>
                            <SidebarMenuButton isActive={isActive(item.path)} tooltip={item.name}>
                                {customIcons[item.path] ? (
                                     <div className="w-5 h-5 flex items-center justify-center">
                                        <Image src={customIcons[item.path]} alt={`Ícone de ${item.name}`} width={20} height={20} className="rounded-full object-cover"/>
                                    </div>
                                ) : (
                                    <IconComponent />
                                )}
                                {item.name}
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                );
            })}
          </SidebarMenu>
          <SidebarFooter>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-sm text-primary/80">Upgrade to Pro</p>
                    <p className="text-xs text-primary/60">Get more features and support.</p>
                    <Button size="sm" className="w-full">Upgrade</Button>
                </div>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Sair" onClick={logout}>
                            <LogOut />
                            Sair
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className={cn('flex flex-col')}>
         <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
