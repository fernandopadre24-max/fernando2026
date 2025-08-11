
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Calendar, Mic, Music4, UserSquare, LogOut, Landmark, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarHeader>
             <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Music4 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-primary font-headline">
                    Controle de Eventos 2026
                </h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton isActive={isActive('/')} tooltip="Eventos">
                  <Calendar />
                  Eventos
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/finance">
                <SidebarMenuButton isActive={isActive('/finance')} tooltip="Financeiro">
                  <DollarSign />
                  Financeiro
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/artists">
                <SidebarMenuButton isActive={isActive('/artists')} tooltip="Artistas">
                  <Mic />
                  Artistas
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/contractors">
                <SidebarMenuButton isActive={isActive('/contractors')} tooltip="Contratantes">
                  <UserSquare />
                  Contratantes
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/banks">
                <SidebarMenuButton isActive={isActive('/banks')} tooltip="Bancos">
                  <Landmark />
                  Bancos
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
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
                        <SidebarMenuButton tooltip="Sair">
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
