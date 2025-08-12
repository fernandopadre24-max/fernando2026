
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
  Wallet,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { useAuth } from '@/contexts/auth-context';

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/finance', label: 'Financeiro', icon: Wallet },
  { href: '/banks', label: 'Bancos', icon: Landmark },
  { href: '/events', label: 'Eventos', icon: Calendar },
  { href: '/artists', label: 'Artistas', icon: Users },
  { href: '/contractors', label: 'Contratantes', icon: Banknote },
  { href: '/reports', label: 'Relatórios', icon: LineChart },
];

const settingsMenuItem = { href: '/settings', label: 'Configurações', icon: Settings };
const adminMenuItem = { href: '/users', label: 'Usuários', icon: ShieldCheck, adminOnly: true };


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

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
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             {user.role === 'admin' && (
               <SidebarMenuItem key={adminMenuItem.href}>
                <Link href={adminMenuItem.href}>
                  <SidebarMenuButton
                    isActive={pathname === adminMenuItem.href}
                    icon={<adminMenuItem.icon />}
                  >
                    {adminMenuItem.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
         <SidebarContent className="mt-auto">
             <SidebarMenu>
                 <SidebarMenuItem>
                     <Link href={settingsMenuItem.href}>
                         <SidebarMenuButton
                             isActive={pathname === settingsMenuItem.href}
                             icon={<settingsMenuItem.icon />}
                         >
                             {settingsMenuItem.label}
                         </SidebarMenuButton>
                     </Link>
                 </SidebarMenuItem>
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
