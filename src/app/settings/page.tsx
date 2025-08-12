
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ThemeSettings, FontOption, FontSize, ColorTheme } from '@/types';
import { useToast } from '@/hooks/use-toast';

const defaultSettings: ThemeSettings = {
    theme: 'light',
    fontHeadline: 'Poppins',
    fontBody: 'PT Sans',
    primaryColor: '222.2 47.4% 11.2%',
    fontSize: 'base',
    colorTheme: 'slate',
};

const fontOptions: { value: FontOption, label: string }[] = [
    { value: 'Poppins', label: 'Poppins' },
    { value: 'PT Sans', label: 'PT Sans' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' }
];

const primaryColorOptions = [
    { value: '222.2 47.4% 11.2%', label: 'Slate' },
    { value: '240 5.9% 10%', label: 'Zinc' },
    { value: '0 0% 9%', label: 'Stone' },
    { value: '346.8 77.2% 49.8%', label: 'Rose' },
    { value: '24.6 95% 53.1%', label: 'Orange' },
    { value: '142.1 76.2% 36.3%', label: 'Green' },
    { value: '217.2 91.2% 59.8%', label: 'Blue' },
    { value: '262 52% 50%', label: 'Violet' },
];


export default function SettingsPage() {
    const { settings, setSettings } = useTheme();
    const [localSettings, setLocalSettings] = useState<ThemeSettings>(settings);
    const { toast } = useToast();

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSaveChanges = () => {
        setSettings(localSettings);
        toast({
            title: "Configurações Salvas",
            description: "A aparência do aplicativo foi atualizada.",
        });
    };

    const handleCancel = () => {
        setLocalSettings(settings);
    };

    const handleRestoreDefaults = () => {
        setLocalSettings(defaultSettings);
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            
            <Card>
                <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>
                        Personalize a aparência do seu aplicativo. As alterações serão aplicadas após salvar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Modo de Cor</Label>
                        <RadioGroup
                            value={localSettings.theme}
                            onValueChange={(value: 'light' | 'dark') => setLocalSettings({ ...localSettings, theme: value })}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">Claro</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">Escuro</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Tema</Label>
                        <RadioGroup
                            value={localSettings.colorTheme}
                            onValueChange={(value: ColorTheme) => setLocalSettings({ ...localSettings, colorTheme: value })}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="slate" id="slate" />
                                <Label htmlFor="slate">Padrão</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="zinc" id="zinc" />
                                <Label htmlFor="zinc">Zinco</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="stone" id="stone" />
                                <Label htmlFor="stone">Pedra</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold" htmlFor="font-headline-select">Fonte dos Títulos</Label>
                            <Select
                                value={localSettings.fontHeadline}
                                onValueChange={(value: FontOption) => setLocalSettings({ ...localSettings, fontHeadline: value })}
                            >
                                <SelectTrigger id="font-headline-select" className="w-full">
                                    <SelectValue placeholder="Selecione uma fonte" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontOptions.map(font => (
                                        <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold" htmlFor="font-body-select">Fonte do Corpo</Label>
                            <Select
                                value={localSettings.fontBody}
                                onValueChange={(value: FontOption) => setLocalSettings({ ...localSettings, fontBody: value })}
                            >
                                <SelectTrigger id="font-body-select" className="w-full">
                                    <SelectValue placeholder="Selecione uma fonte" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontOptions.map(font => (
                                        <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Tamanho da Fonte</Label>
                        <RadioGroup
                            value={localSettings.fontSize}
                            onValueChange={(value: FontSize) => setLocalSettings({ ...localSettings, fontSize: value })}
                            className="flex items-center space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sm" id="sm" />
                                <Label htmlFor="sm">Pequeno</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="base" id="base" />
                                <Label htmlFor="base">Normal</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lg" id="lg" />
                                <Label htmlFor="lg">Grande</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Cor de Destaque</Label>
                        <div className="flex flex-wrap gap-2">
                            {primaryColorOptions.map(color => (
                                <button
                                    key={color.value}
                                    onClick={() => setLocalSettings({ ...localSettings, primaryColor: color.value })}
                                    className={`h-10 w-10 rounded-full border-2 ${localSettings.primaryColor === color.value ? 'border-primary' : 'border-transparent'}`}
                                    style={{ backgroundColor: `hsl(${color.value})` }}
                                    aria-label={`Select color ${color.label}`}
                                />
                            ))}
                        </div>
                    </div>
                     <div className="pt-4 flex justify-between">
                        <Button onClick={handleRestoreDefaults} variant="outline">
                            Restaurar Padrão
                        </Button>
                        <div className="flex gap-2">
                             <Button onClick={handleCancel} variant="ghost">
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveChanges}>
                                Salvar e Aplicar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
