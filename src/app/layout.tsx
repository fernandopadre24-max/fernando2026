
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';


export const metadata: Metadata = {
  title: 'Controle Financeiro',
  description: 'Seu gerenciador financeiro completo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <ThemeProvider>
            <AuthProvider>
              <AppShell>
                {children}
              </AppShell>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
