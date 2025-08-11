import { Music4 } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {
  return (
    <header className="py-6 md:py-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-2 px-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
           <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
              EventFlow
            </h1>
        </div>
      </div>
    </header>
  );
}
