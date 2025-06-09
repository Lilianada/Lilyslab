'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { PreferencesModal } from './preferences-modal';

export function PreferencesButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800/80 border border-zinc-700/50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105 group"
        aria-label="Open preferences"
      >
        <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
      </button>
      
      <PreferencesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
