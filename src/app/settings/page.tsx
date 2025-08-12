
'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Paintbrush, Type, Palette, TextQuote, Image as ImageIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

const fonts = [
  { name: 'Poppins', family: 'Poppins, sans-serif' },
  { name: 'PT Sans', family: 'PT Sans, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif' },
];

const modules = [
    { path: '/finance', name: 'Financeiro' },
    { path: '/banks', name: 'Bancos' },
    { path: '/', name: 'Eventos' },
    { path: '/artists', name: 'Artistas' },
    { path: '/contractors', name: 'Contratantes' },
    { path: '/finance/categories', name: 'Categorias' },
    { path: '/settings', name: 'Configurações' },
    { path: '/reports', name: 'Relatórios' },
];

function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}


export default function SettingsPage() {
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    const [headlineFont, setHeadlineFont] = useState('Poppins, sans-serif');
    const [bodyFont, setBodyFont] = useState('PT Sans, sans-serif');
    const [fontSize, setFontSize] = useState(16);
    const [backgroundColor, setBackgroundColor] = useState('220 20% 96%');
    const [primaryColor, setPrimaryColor] = useState('262 52% 50%');
    const [accentColor, setAccentColor] = useState('45 95% 55%');
    const [moduleIcons, setModuleIcons] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setIsClient(true);
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            const { fonts, colors, fontSize: savedFontSize, icons } = JSON.parse(savedTheme);
            if (fonts) {
                setHeadlineFont(fonts.headline?.family || 'Poppins, sans-serif');
                setBodyFont(fonts.body?.family || 'PT Sans, sans-serif');
            }
             if (colors) {
                setBackgroundColor(colors.background || '220 20% 96%');
                setPrimaryColor(colors.primary || '262 52% 50%');
                setAccentColor(colors.accent || '45 95% 55%');
            }
            if (savedFontSize) {
                setFontSize(savedFontSize);
            }
            if (icons) {
                setModuleIcons(icons);
            }
        }
    }, []);

    const applyTheme = () => {
        const root = document.documentElement;
        
        // Font Size
        root.style.fontSize = `${fontSize}px`;

        // Fonts
        root.style.setProperty('--font-headline', headlineFont);
        root.style.setProperty('--font-body', bodyFont);
        const fontFamilies = [bodyFont, headlineFont].filter(Boolean).join(':wght@400;700&family=');
        if (fontFamilies) {
          const linkId = 'dynamic-google-font';
          let link = document.getElementById(linkId) as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
          }
          link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
        }

        // Colors
        root.style.setProperty('--background-hsl', backgroundColor);
        root.style.setProperty('--primary-hsl', primaryColor);
        root.style.setProperty('--accent-hsl', accentColor);
    };

    const handleSave = () => {
        applyTheme();
        // Post a message to update the sidebar icons in real-time
        window.postMessage({ type: 'theme-updated' }, '*');
        const theme = {
            fonts: {
                headline: { family: headlineFont },
                body: { family: bodyFont },
            },
            colors: {
                background: backgroundColor,
                primary: primaryColor,
                accent: accentColor,
            },
            fontSize: fontSize,
            icons: moduleIcons,
        };
        localStorage.setItem('app-theme', JSON.stringify(theme));
        toast({
            title: 'Tema Salvo!',
            description: 'Suas configurações de aparência foram salvas com sucesso.',
        });
    };
    
    const handleReset = () => {
      const defaultSettings = {
        headline: 'Poppins, sans-serif',
        body: 'PT Sans, sans-serif',
        fontSize: 16,
        background: '220 20% 96%',
        primary: '262 52% 50%',
        accent: '45 95% 55%',
      };

      setHeadlineFont(defaultSettings.headline);
      setBodyFont(defaultSettings.body);
      setFontSize(defaultSettings.fontSize);
      setBackgroundColor(defaultSettings.background);
      setPrimaryColor(defaultSettings.primary);
      setAccentColor(defaultSettings.accent);
      setModuleIcons({});
      
      const root = document.documentElement;
      root.style.fontSize = `${defaultSettings.fontSize}px`;
      root.style.setProperty('--font-headline', defaultSettings.headline);
      root.style.setProperty('--font-body', defaultSettings.body);
      root.style.setProperty('--background-hsl', defaultSettings.background);
      root.style.setProperty('--primary-hsl', defaultSettings.primary);
      root.style.setProperty('--accent-hsl', defaultSettings.accent);

      localStorage.removeItem('app-theme');
       window.postMessage({ type: 'theme-updated' }, '*');
      toast({
          title: 'Tema Restaurado',
          description: 'As configurações de aparência foram restauradas para o padrão.',
      });
    }

    const handleIconChange = (modulePath: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setModuleIcons(prev => ({ ...prev, [modulePath]: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };


    if (!isClient) {
        return null;
    }
    
    const colorToHex = (hsl: string) => {
        const [h, s, l] = hsl.replace(/%/g, '').split(' ').map(Number);
        return hslToHex(h,s,l);
    }
    
    const handleColorChange = (setter: Function) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(hexToHsl(e.target.value));
    };

    return (
        <AppShell>
            <main className="container mx-auto px-4 pb-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold font-headline">Configurações de Aparência</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Type /> Tipografia</CardTitle>
                            <CardDescription>Personalize as fontes e o tamanho do texto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headline-font">Fonte dos Títulos</Label>
                                    <Select value={headlineFont} onValueChange={setHeadlineFont}>
                                        <SelectTrigger id="headline-font">
                                            <SelectValue placeholder="Selecione uma fonte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fonts.map(font => (
                                                <SelectItem key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                                                    {font.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="body-font">Fonte do Corpo</Label>
                                    <Select value={bodyFont} onValueChange={setBodyFont}>
                                        <SelectTrigger id="body-font">
                                            <SelectValue placeholder="Selecione uma fonte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fonts.map(font => (
                                                <SelectItem key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                                                    {font.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="font-size">Tamanho da Fonte ({fontSize}px)</Label>
                                <div className="flex items-center gap-4">
                                    <TextQuote className="h-5 w-5" />
                                    <Slider
                                        id="font-size"
                                        min={12}
                                        max={20}
                                        step={1}
                                        value={[fontSize]}
                                        onValueChange={(value) => setFontSize(value[0])}
                                    />
                                     <TextQuote className="h-7 w-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Palette /> Cores do Tema</CardTitle>
                            <CardDescription>Escolha as cores principais da interface.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-2 items-center">
                                    <Label htmlFor="bg-color">Fundo</Label>
                                    <input type="color" value={colorToHex(backgroundColor)} onChange={handleColorChange(setBackgroundColor)} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="bg-color" title="Escolha a cor de fundo" />
                                </div>
                                <div className="flex flex-col space-y-2 items-center">
                                    <Label htmlFor="primary-color">Primária</Label>
                                    <input type="color" value={colorToHex(primaryColor)} onChange={handleColorChange(setPrimaryColor)} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="primary-color" title="Escolha a cor primária" />
                                </div>
                                <div className="flex flex-col space-y-2 items-center">
                                    <Label htmlFor="accent-color">Destaque</Label>
                                    <input type="color" value={colorToHex(accentColor)} onChange={handleColorChange(setAccentColor)} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="accent-color" title="Escolha a cor de destaque" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ImageIcon /> Personalizar Ícones dos Módulos</CardTitle>
                        <CardDescription>Faça upload de imagens para usar como ícones no menu lateral.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {modules.map(module => (
                            <div key={module.path} className="flex flex-col items-center gap-2">
                                <Label htmlFor={`icon-upload-${module.path}`}>{module.name}</Label>
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                     {moduleIcons[module.path] ? (
                                        <Image src={moduleIcons[module.path]} alt={`Ícone de ${module.name}`} width={64} height={64} className="object-cover" />
                                    ) : (
                                        <ImageIcon className="text-muted-foreground" />
                                    )}
                                </div>
                                <input id={`icon-upload-${module.path}`} type="file" accept="image/*" className="text-sm" onChange={(e) => handleIconChange(module.path, e)} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-end gap-2">
                    <Button variant="outline" onClick={handleReset}>Restaurar Padrão</Button>
                    <Button onClick={handleSave}>
                        <Paintbrush className="mr-2 h-4 w-4" />
                        Salvar e Aplicar Tema
                    </Button>
                </div>
            </main>
        </AppShell>
    );
}
