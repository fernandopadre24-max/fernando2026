
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeSettings } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const defaultSettings: ThemeSettings = {
    theme: 'light',
    fontHeadline: 'Poppins',
    fontBody: 'PT Sans',
    primaryColor: '262 52% 50%',
    fontSize: 'base'
};

interface ThemeProviderState {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
    settings: defaultSettings,
    setSettings: () => null,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<ThemeSettings>(() => loadData('themeSettings', defaultSettings));

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);

        root.style.setProperty('--primary-hsl', settings.primaryColor);

        const body = window.document.body;
        body.style.setProperty('--font-headline', `'${settings.fontHeadline}', sans-serif`);
        body.style.setProperty('--font-body', `'${settings.fontBody}', sans-serif`);
        

        body.classList.remove('text-sm', 'text-base', 'text-lg');
        body.classList.add(`text-${settings.fontSize}`);


        saveData('themeSettings', settings);
    }, [settings]);

    const value = {
        settings,
        setSettings,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
