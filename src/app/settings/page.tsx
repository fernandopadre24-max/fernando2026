
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { Input } from '../ui/input';

const fonts = [
  { name: 'Poppins', family: 'Poppins, sans-serif' },
  { name: 'PT Sans', family: 'PT Sans, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
];

const colors = [
    { name: 'Padrão', values: { primary: '262 52% 50%', background: '220 20% 96%', accent: '45 95% 55%' } },
    { name: 'Meia-noite', values: { primary: '210 40% 98%', background: '217 33% 17%', accent: '347 77% 66%' } },
    { name: 'Esmeralda', values: { primary: '142 76% 36%', background: '145 63% 94%', accent: '142 71% 45%' } },
    { name: 'Âmbar', values: { primary: '35 92% 55%', background: '39 89% 95%', accent: '35 92% 55%' } },
    { name: 'Rubi', values: { primary: '347 90% 55%', background: '347 100% 96%', accent: '347 83% 60%' } },
    { name: 'Violeta', values: { primary: '262 84% 59%', background: '262 100% 97%', accent: '262 74% 64%' } },
];


export default function SettingsPage() {
  const { toast } = useToast();
  
  const [appName, setAppName] = useState('Controle Financeiro');
  const [headlineFont, setHeadlineFont] = useState('Poppins, sans-serif');
  const [bodyFont, setBodyFont] = useState('PT Sans, sans-serif');
  const [colorScheme, setColorScheme] = useState('Padrão');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      const { appName, fonts, colors, fontSize } = JSON.parse(savedTheme);
      if (appName) setAppName(appName);
      if (fonts) {
        if (fonts.headline) setHeadlineFont(fonts.headline.family);
        if (fonts.body) setBodyFont(fonts.body.family);
      }
      if (colors) {
        const selectedColor = colors.find(c => c.values.primary === colors.primary);
        if (selectedColor) setColorScheme(selectedColor.name);
      }
      if (fontSize) {
        setFontSize(fontSize);
      }
    }
  }, []);

  const handleSave = () => {
    const selectedHeadlineFont = fonts.find(f => f.family === headlineFont);
    const selectedBodyFont = fonts.find(f => f.family === bodyFont);
    const selectedColor = colors.find(c => c.name === colorScheme);

    const theme = {
      appName,
      fonts: {
        headline: { name: selectedHeadlineFont?.name, family: headlineFont },
        body: { name: selectedBodyFont?.name, family: bodyFont },
      },
      colors: selectedColor?.values,
      fontSize,
    };

    localStorage.setItem('app-theme', JSON.stringify(theme));
    applyTheme(theme);

    toast({
      title: 'Tema salvo!',
      description: 'Suas novas configurações de aparência foram salvas.',
    });

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme.appName) {
      document.title = theme.appName;
    }
    if (theme.fonts) {
      if (theme.fonts.body) root.style.setProperty('--font-body', theme.fonts.body.family);
      if (theme.fonts.headline) root.style.setProperty('--font-headline', theme.fonts.headline.family);
    }
    if (theme.colors) {
        if (theme.colors.background) root.style.setProperty('--background-hsl', theme.colors.background);
        if (theme.colors.primary) root.style.setProperty('--primary-hsl', theme.colors.primary);
        if (theme.colors.accent) root.style.setProperty('--accent-hsl', theme.colors.accent);
    }
    if (theme.fontSize) {
      root.style.fontSize = `${theme.fontSize}px`;
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Personalize a aparência do seu aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="appName">Nome do Aplicativo</Label>
            <Input
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Digite o nome do seu aplicativo"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fonte dos Títulos</Label>
              <Select value={headlineFont} onValueChange={setHeadlineFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map(font => (
                    <SelectItem key={font.name} value={font.family}>{font.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fonte do Corpo</Label>
              <Select value={bodyFont} onValueChange={setBodyFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map(font => (
                    <SelectItem key={font.name} value={font.family}>{font.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
              <Label>Esquema de Cores</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {colors.map(color => (
                        <div key={color.name} onClick={() => setColorScheme(color.name)} className={`cursor-pointer rounded-md border-2 p-2 ${colorScheme === color.name ? 'border-primary' : 'border-transparent'}`}>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium">{color.name}</span>
                                     {colorScheme === color.name && 
                                        <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${color.values.primary})`}} />
                                     }
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-full h-5 rounded-sm" style={{ background: `hsl(${color.values.background})`}} />
                                    <div className="w-full h-5 rounded-sm" style={{ background: `hsl(${color.values.primary})`}} />
                                    <div className="w-full h-5 rounded-sm" style={{ background: `hsl(${color.values.accent})`}} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
          </div>
           <div className="space-y-2">
            <Label>Tamanho da Fonte ({fontSize}px)</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={20}
              step={1}
            />
          </div>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
