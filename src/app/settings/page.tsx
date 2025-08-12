
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
import { useAuth } from '@/contexts/auth-context';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const defaultSettings: ThemeSettings = {
    theme: 'light',
    fontHeadline: 'Poppins',
    fontBody: 'PT Sans',
    primaryColor: '222.2 47.4% 11.2%',
    fontSize: 'base',
    colorTheme: 'slate',
    pageBackgroundColor: '0 0% 98%',
};

const fontOptions: { value: FontOption, label: string }[] = [
    { value: 'Poppins', label: 'Poppins' },
    { value: 'PT Sans', label: 'PT Sans' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'Playfair Display', label: 'Playfair Display' },
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

const backgroundColorOptions = [
    { value: '0 0% 98%', label: 'Branco Neve', theme: 'light'},
    { value: '60 90% 95%', label: 'Creme', theme: 'light'},
    { value: '210 40% 98%', label: 'Azul Claro', theme: 'light'},
    { value: '330 80% 96%', label: 'Rosa Claro', theme: 'light' },
    { value: '120 60% 96%', label: 'Verde Claro', theme: 'light' },
    { value: '222.2 84% 4.9%', label: 'Quase Preto', theme: 'dark'},
    { value: '240 4% 12%', label: 'Cinza Escuro', theme: 'dark'},
    { value: '200 15% 20%', label: 'Azul Escuro', theme: 'dark'},
    { value: '260 20% 15%', label: 'Violeta Escuro', theme: 'dark' },
    { value: '30 30% 12%', label: 'Marrom Escuro', theme: 'dark' },
]


export default function SettingsPage() {
    const { settings, setSettings } = useTheme();
    const [localSettings, setLocalSettings] = useState<ThemeSettings>(settings);
    const { toast } = useToast();
    const { user, deleteCurrentUser } = useAuth();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setLocalSettings(settings);
        }
    }, [settings, user]);

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

    const handleDeleteAccount = async () => {
        try {
            await deleteCurrentUser();
            toast({
                title: "Conta Excluída",
                description: "Sua conta e todos os seus dados foram excluídos com sucesso.",
            });
            // The auth context will handle the redirect.
        } catch (error: any) {
             toast({
                title: "Erro ao Excluir Conta",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }


    if (!user) {
        return <p>Carregando...</p>;
    }

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
                            onValueChange={(value: 'light' | 'dark') => {
                                const newBgColor = value === 'light' ? defaultSettings.pageBackgroundColor : '222.2 84% 4.9%';
                                setLocalSettings({ ...localSettings, theme: value, pageBackgroundColor: newBgColor })
                            }}
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
                        <Label className="text-lg font-semibold">Tema dos Componentes</Label>
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
                        <Label className="text-lg font-semibold">Cor de Fundo da Tela</Label>
                        <div className="flex flex-wrap gap-2">
                            {backgroundColorOptions.filter(c => c.theme === localSettings.theme).map(color => (
                                <button
                                    key={color.value}
                                    onClick={() => setLocalSettings({ ...localSettings, pageBackgroundColor: color.value })}
                                    className={`h-10 w-10 rounded-full border-2 ${localSettings.pageBackgroundColor === color.value ? 'border-primary' : 'border-transparent'}`}
                                    style={{ backgroundColor: `hsl(${color.value})` }}
                                    aria-label={`Select color ${color.label}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Cor de Destaque dos Componentes</Label>
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

            <Card>
                <CardHeader>
                    <CardTitle>Excluir Conta</CardTitle>
                    <CardDescription>
                        Esta ação é permanente e removerá todos os seus dados.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Excluir Minha Conta</Button>
                </CardContent>
            </Card>

             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                        e removerá todos os seus dados de nossos servidores.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Sim, excluir minha conta
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
