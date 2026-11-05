"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function BookmarkSearch({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const close = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div
      className={`flex h-7 items-center overflow-hidden rounded-full border border-border bg-muted transition-[width] duration-200 motion-reduce:transition-none ${
        isOpen ? "w-44 focus-within:border-primary sm:w-56" : "w-7 hover:bg-accent"
      }`}
    >
      {isOpen ? (
        <>
          <Search size={12} className="ml-2.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") close();
            }}
            // Leave a search that's in use open when clicking elsewhere, so it stays visible.
            onBlur={() => {
              if (!value) setIsOpen(false);
            }}
            placeholder="Search bookmarks"
            aria-label="Search bookmarks"
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 bg-transparent px-2 font-mono text-base outline-none placeholder:text-muted-foreground sm:text-xs [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Clear and close search"
            className="flex h-full w-7 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={12} />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Search bookmarks"
          title="Search bookmarks"
          className="flex h-full w-full items-center justify-center"
        >
          <Search size={12} />
        </button>
      )}
    </div>
  );
}
