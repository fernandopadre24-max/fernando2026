
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Calendar,
  Users,
  Banknote,
  Landmark,
  LineChart,
  Settings,
  LogOut,
  Loader,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from './header';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/events', label: 'Eventos', icon: Calendar },
  { href: '/artists', label: 'Artistas', icon: Users },
  { href: '/contractors', label: 'Contratantes', icon: Banknote },
  { href: '/banks', label: 'Bancos', icon: Landmark },
  { href: '/reports', label: 'Relatórios', icon: LineChart },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [appName, setAppName] = useState('Controle Financeiro');

  useEffect(() => {
    if (!isLoading && !user) {
      if (pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  useEffect(() => {
    try {
      const theme = localStorage.getItem('app-theme');
      if (theme) {
        const { appName: savedAppName } = JSON.parse(theme);
        if (savedAppName) {
          setAppName(savedAppName);
        }
      }
    } catch (e) {
      console.error('Failed to load app name from localStorage', e);
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && (pathname === '/login' || pathname === '/signup')) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  if (!user) {
     return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg">{appName}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
              <LogOut />
              <span>Sair</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
