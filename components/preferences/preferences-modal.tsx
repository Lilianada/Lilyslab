'use client';

import { useState } from 'react';
import { X, User, Palette, Type, Monitor, Sun, Moon } from 'lucide-react';
import { usePreferences } from '@/contexts/preferences-context';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
];

const colorPalettes = [
  {
    value: 'default',
    label: 'Default',
    colors: {
      background: '#000000',
      surface: '#171717',
      text: '#ffffff',
      accent: '#3b82f6'
    }
  },
  {
    value: 'midnight-lavender',
    label: 'Midnight Lavender',
    colors: {
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#e2e8f0',
      accent: '#8b5cf6'
    }
  },
  {
    value: 'forest-terminal',
    label: 'Forest Terminal',
    colors: {
      background: '#0a0f0a',
      surface: '#1a2520',
      text: '#a7f3d0',
      accent: '#10b981'
    }
  },
  {
    value: 'ember-noir',
    label: 'Ember Noir',
    colors: {
      background: '#1a0f0f',
      surface: '#2d1b1b',
      text: '#fecaca',
      accent: '#ef4444'
    }
  }
];

const fonts = [
  { value: 'sans', label: 'Sans Serif (Geist Sans)' },
  { value: 'mono', label: 'Monospace (Geist Mono)' },
  { value: 'serif', label: 'Serif (Times)' },
];

const UserProfileSection = () => {
  return (
    <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <User className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-zinc-200">Guest User</div>
          <div className="text-xs text-zinc-500">Not signed in</div>
        </div>
      </div>
    </div>
  );
};

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { 
    theme, 
    setTheme, 
    colorPalette, 
    setColorPalette, 
    fontFamily, 
    setFontFamily 
  } = usePreferences();
  
  const [activeSection, setActiveSection] = useState<'appearance' | 'typography' | 'account'>('appearance');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-start p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/50 rounded-lg shadow-2xl w-80 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <h2 className="text-lg font-semibold text-zinc-100">Preferences</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-zinc-800/50">
          {[
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'typography', label: 'Typography', icon: Type },
            { id: 'account', label: 'Account', icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm transition-colors ${
                activeSection === id
                  ? 'bg-zinc-800/50 text-zinc-100 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/25'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium text-zinc-200 mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-md border transition-colors ${
                        theme === value
                          ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette Selection */}
              <div>
                <h3 className="text-sm font-medium text-zinc-200 mb-3">Color Palette</h3>
                <div className="space-y-2">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.value}
                      onClick={() => setColorPalette(palette.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-md border transition-colors ${
                        colorPalette === palette.value
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        {Object.values(palette.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-zinc-700"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${
                        colorPalette === palette.value ? 'text-blue-400' : 'text-zinc-300'
                      }`}>
                        {palette.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'typography' && (
            <div className="space-y-6">
              {/* Font Family Selection */}
              <div>
                <h3 className="text-sm font-medium text-zinc-200 mb-3">Font Family</h3>
                <div className="space-y-2">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value as any)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        fontFamily === font.value
                          ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-sm">{font.label}</div>
                      <div className={`text-xs text-zinc-500 mt-1 ${
                        font.value === 'sans' ? 'font-sans' : 
                        font.value === 'mono' ? 'font-mono' : 
                        'font-serif'
                      }`}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-6">
              <UserProfileSection />
              
              <div className="pt-4 border-t border-zinc-800">
                <div className="text-xs text-zinc-500 space-y-1">
                  <div>Preferences are saved locally</div>
                  <div>Sign in to sync across devices</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
