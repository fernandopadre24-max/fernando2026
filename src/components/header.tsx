
'use client';

import { Music4 } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { useEffect, useState } from 'react';

export function Header() {
  const [appName, setAppName] = useState('Controle Financeiro');

   useEffect(() => {
    const updateAppName = () => {
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme) {
        const { appName: savedAppName } = JSON.parse(savedTheme);
        setAppName(savedAppName || 'Controle Financeiro');
      } else {
        setAppName('Controle Financeiro');
      }
    };

    updateAppName();

    const handleThemeUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'theme-updated') {
        updateAppName();
      }
    };

    window.addEventListener('message', handleThemeUpdate);
    return () => {
      window.removeEventListener('message', handleThemeUpdate);
    };
  }, []);


  return (
    <header className="py-6 md:py-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-2 px-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
           <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
              {appName}
            </h1>
        </div>
      </div>
    </header>
  );
}
