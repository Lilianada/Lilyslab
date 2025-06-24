"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const Terminal: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load content on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Auto-save every 15 seconds (including empty content to preserve deletions)
  useEffect(() => {
    const interval = setInterval(() => {
      saveNotes();
    }, 3000);

    return () => clearInterval(interval);
  }, [content]);

  const loadNotes = async () => {
    try {
      // First check localStorage
      const savedNotes = localStorage.getItem('terminal_notes');
      
      if (savedNotes) {
        // Use localStorage content if it exists
        setContent(savedNotes);
        // Set last saved time from localStorage if available
        const lastSavedTime = localStorage.getItem('terminal_notes_timestamp');
        if (lastSavedTime) {
          setLastSaved(new Date(lastSavedTime));
        }
      } else {
        // If no localStorage, fetch initial content from API (your original notes)
        const response = await fetch('/api/notes/terminal');
        if (response.ok) {
          const data = await response.json();
          const initialContent = data.content || '';
          setContent(initialContent);
          // Save to localStorage for future sessions
          if (initialContent) {
            localStorage.setItem('terminal_notes', initialContent);
            const now = new Date();
            localStorage.setItem('terminal_notes_timestamp', now.toISOString());
            setLastSaved(now);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const saveNotes = () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      localStorage.setItem('terminal_notes', content);
      const now = new Date();
      localStorage.setItem('terminal_notes_timestamp', now.toISOString());
      setLastSaved(now);
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save with Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveNotes();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-muted">

      {/* Text Area */}
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing your notes or drafts here...

Your notes are stored locally in your browser and persist between sessions.
Auto-saves every 15 seconds or save manually with Ctrl/Cmd + S."
          autoFocus
          spellCheck={false}
          className={cn(
            "w-full h-full resize-none border-none outline-none bg-transparent",
            "text-foreground placeholder:text-muted-foreground",
            "font-mono text-sm leading-relaxed",
            "scrollbar-hide overflow-auto"
          )}
          style={{
            minHeight: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;
