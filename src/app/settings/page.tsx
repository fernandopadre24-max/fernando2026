
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ThemeSettings } from '@/types';

const defaultSettings: ThemeSettings = {
    theme: 'light',
    font: 'PT Sans',
    primaryColor: '262 52% 50%' // --primary-hsl
};

export default function SettingsPage() {
    const { settings, setSettings } = useTheme();

    const handleRestoreDefaults = () => {
        setSettings(defaultSettings);
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            
            <Card>
                <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>
                        Personalize a aparência do seu aplicativo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Tema</Label>
                        <RadioGroup
                            value={settings.theme}
                            onValueChange={(value: 'light' | 'dark') => setSettings({ ...settings, theme: value })}
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
                        <Label className="text-lg font-semibold" htmlFor="font-select">Fonte</Label>
                        <Select
                            value={settings.font}
                            onValueChange={(value: 'Poppins' | 'PT Sans') => setSettings({ ...settings, font: value })}
                        >
                            <SelectTrigger id="font-select" className="w-[280px]">
                                <SelectValue placeholder="Selecione uma fonte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Poppins">Poppins (Títulos)</SelectItem>
                                <SelectItem value="PT Sans">PT Sans (Corpo)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Cor de Destaque</Label>
                        <div className="flex flex-wrap gap-2">
                            {['262 52% 50%', '346.8 77.2% 49.8%', '24.6 95% 53.1%', '142.1 76.2% 36.3%', '217.2 91.2% 59.8%'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSettings({ ...settings, primaryColor: color })}
                                    className={`h-10 w-10 rounded-full border-2 ${settings.primaryColor === color ? 'border-primary' : 'border-transparent'}`}
                                    style={{ backgroundColor: `hsl(${color})` }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                     <div className="pt-4">
                        <Button onClick={handleRestoreDefaults} variant="outline">
                            Restaurar Padrão
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
