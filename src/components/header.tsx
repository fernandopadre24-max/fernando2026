import { Music4 } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Music4 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
              EventFlow
            </h1>
            <p className="text-muted-foreground font-body">
              AI-Powered Event Management
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
