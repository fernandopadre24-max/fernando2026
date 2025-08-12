
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'Controle Financeiro',
  description: 'Seu gerenciador financeiro completo',
};

const applyThemeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('app-theme');
      if (theme) {
        const { fonts, colors, fontSize, appName } = JSON.parse(theme);
        const root = document.documentElement;
        
        if (appName) {
            document.title = appName;
        }

        if (fonts) {
          if (fonts.body) {
            root.style.setProperty('--font-body', fonts.body.family);
          }
          if (fonts.headline) {
            root.style.setProperty('--font-headline', fonts.headline.family);
          }
          
          const fontFamilies = [fonts.body?.family, fonts.headline?.family].filter(Boolean).join(':wght@400;700&family=');
          if (fontFamilies) {
            const link = document.createElement('link');
            link.href = \`https://fonts.googleapis.com/css2?family=\${fontFamilies.replace(/ /g, '+')}:wght@400;500;600;700&display=swap\`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
          }
        }
        
        if (colors) {
          if (colors.background) root.style.setProperty('--background-hsl', colors.background);
          if (colors.primary) root.style.setProperty('--primary-hsl', colors.primary);
          if (colors.accent) root.style.setProperty('--accent-hsl', colors.accent);
        }

        if (fontSize) {
          root.style.fontSize = \`\${fontSize}px\`;
        }
      }
    } catch (e) {
      console.error('Failed to apply theme from localStorage', e);
    }
  })();
`;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="apply-theme-script" strategy="beforeInteractive">
          {applyThemeScript}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
            {children}
            <Toaster />
      </body>
    </html>
  );
}
