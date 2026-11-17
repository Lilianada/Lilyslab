"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Lock, LockOpen } from "lucide-react";

const KEY = "hide_locked";
const EVENT = "hide-locked-change";

/** One remembered choice for every page that lists locked items. */
export function useHideLocked() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    try {
      setHide(localStorage.getItem(KEY) === "1");
    } catch {}
    const sync = (e: Event) => setHide((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const toggle = () => {
    const next = !hide;
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  };

  return [hide, toggle] as const;
}

export function HideLockedButton({ hide, onToggle, count }: { hide: boolean; onToggle: () => void; count: number }) {
  if (count === 0) return null;
  const Icon = hide ? LockOpen : Lock;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={hide}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      title={hide ? "Show locked drafts again" : "Hide locked drafts"}
    >
      <Icon size={12} aria-hidden="true" />
      {hide ? `Show locked (${count})` : "Hide locked"}
    </button>
  );
}

/**
 * For server-rendered lists: wrap the list, mark locked rows with `data-locked`,
 * and they're hidden while the toggle is on.
 */
export function LockedFilter({ count, children }: { count: number; children: ReactNode }) {
  const [hide, toggle] = useHideLocked();
  return (
    <>
      <div className="mb-3 flex justify-end">
        <HideLockedButton hide={hide} onToggle={toggle} count={count} />
      </div>
      <div className={hide ? "[&_[data-locked]]:hidden" : undefined}>{children}</div>
    </>
  );
}
