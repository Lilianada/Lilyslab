'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'system' | 'dark' | 'light';
type ColorPalette = 'default' | 'midnight-lavender' | 'forest-terminal' | 'ember-noir';
type FontFamily = 'sans' | 'mono' | 'serif';

interface PreferencesContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const colorPalettes = {
  'default': {
    background: '#000000',
    surface: '#171717',
    text: '#ffffff',
    accent: '#3b82f6'
  },
  'midnight-lavender': {
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#e2e8f0',
    accent: '#8b5cf6'
  },
  'forest-terminal': {
    background: '#0a0f0a',
    surface: '#1a2520',
    text: '#a7f3d0',
    accent: '#10b981'
  },
  'ember-noir': {
    background: '#1a0f0f',
    surface: '#2d1b1b',
    text: '#fecaca',
    accent: '#ef4444'
  }
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>('default');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('sans');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('preferences-theme') as Theme;
    const savedPalette = localStorage.getItem('preferences-color-palette') as ColorPalette;
    const savedFont = localStorage.getItem('preferences-font-family') as FontFamily;

    if (savedTheme) setThemeState(savedTheme);
    if (savedPalette) setColorPaletteState(savedPalette);
    if (savedFont) setFontFamilyState(savedFont);
    
    setIsLoaded(true);
  }, []);

  // Apply color palette as CSS variables
  useEffect(() => {
    if (!isLoaded) return;
    
    const colors = colorPalettes[colorPalette];
    const root = document.documentElement;
    
    root.style.setProperty('--preference-bg', colors.background);
    root.style.setProperty('--preference-surface', colors.surface);
    root.style.setProperty('--preference-text', colors.text);
    root.style.setProperty('--preference-accent', colors.accent);
  }, [colorPalette, isLoaded]);

  // Apply font family
  useEffect(() => {
    if (!isLoaded) return;
    
    const root = document.documentElement;
    root.style.setProperty('--preference-font', 
      fontFamily === 'sans' ? 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' :
      fontFamily === 'mono' ? 'var(--font-geist-mono), ui-monospace, monospace' :
      'ui-serif, Georgia, Cambria, serif'
    );
    
    // Apply to body for immediate effect
    document.body.style.fontFamily = 
      fontFamily === 'sans' ? 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' :
      fontFamily === 'mono' ? 'var(--font-geist-mono), ui-monospace, monospace' :
      'ui-serif, Georgia, Cambria, serif';
  }, [fontFamily, isLoaded]);

  // Apply theme (delegate to existing theme system)
  useEffect(() => {
    if (!isLoaded) return;
    
    // Apply theme through data attribute for compatibility with existing theme system
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isLoaded]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('preferences-theme', newTheme);
  };

  const setColorPalette = (newPalette: ColorPalette) => {
    setColorPaletteState(newPalette);
    localStorage.setItem('preferences-color-palette', newPalette);
  };

  const setFontFamily = (newFont: FontFamily) => {
    setFontFamilyState(newFont);
    localStorage.setItem('preferences-font-family', newFont);
  };

  return (
    <PreferencesContext.Provider value={{
      theme,
      setTheme,
      colorPalette,
      setColorPalette,
      fontFamily,
      setFontFamily,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
