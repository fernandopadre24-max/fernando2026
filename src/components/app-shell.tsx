
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  Calendar,
  Users,
  Banknote,
  Landmark,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './header';

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/events', label: 'Eventos', icon: Calendar },
  { href: '/artists', label: 'Artistas', icon: Users },
  { href: '/contractors', label: 'Contratantes', icon: Banknote },
  { href: '/banks', label: 'Bancos', icon: Landmark },
  { href: '/reports', label: 'Relatórios', icon: LineChart },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg">Controle Financeiro</span>
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
      </Sidebar>
      <main className="flex-1 flex flex-col">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
