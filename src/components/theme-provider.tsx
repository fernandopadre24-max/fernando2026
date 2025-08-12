
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeSettings, FontSize, ColorTheme } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const defaultSettings: ThemeSettings = {
    theme: 'light',
    fontHeadline: 'Poppins',
    fontBody: 'PT Sans',
    primaryColor: '222.2 47.4% 11.2%',
    fontSize: 'base',
    colorTheme: 'slate',
    pageBackgroundColor: '0 0% 98%',
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
    const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
    
    useEffect(() => {
        const savedSettings = loadData('themeSettings', defaultSettings);
        setSettings({ ...defaultSettings, ...savedSettings });
    },[])

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);

        // Remove old theme classes
        root.classList.remove('theme-slate', 'theme-zinc', 'theme-stone');
        // Add new theme class
        if (settings.colorTheme) {
            root.classList.add(`theme-${settings.colorTheme}`);
        }

        root.style.setProperty('--primary', settings.primaryColor);
        root.style.setProperty('--page-background', settings.pageBackgroundColor);


        const body = window.document.body;
        body.style.setProperty('--font-headline', `'${settings.fontHeadline}', sans-serif`);
        body.style.setProperty('--font-body', `'${settings.fontBody}', sans-serif`);
        
        // Apply font size
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
