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
} from '@/components/ui/sidebar';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { Calendar, Mic, Music4, UserSquare } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
             <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Music4 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-primary font-headline">
                    EventFlow
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
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className={cn('flex flex-col')}>
         <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
