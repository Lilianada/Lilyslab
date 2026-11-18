"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

const WIDTH = 320;
const GAP = 8;

/**
 * A footnote marker that previews its note, like Wikipedia's reference popups:
 * hover or focus shows the note, a click jumps to it at the bottom. On touch
 * screens the first tap shows the preview and a second tap jumps.
 */
export function FootnoteRef({ href, children, ...props }: { href: string; children?: ReactNode; [key: string]: unknown }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const [note, setNote] = useState<string | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; above: boolean } | null>(null);

  const show = () => {
    window.clearTimeout(hideTimer.current);
    const target = document.getElementById(href.slice(1));
    const anchor = ref.current;
    if (!target || !anchor) return;
    // The note as it's already rendered at the bottom, minus its "back" arrow.
    const copy = target.cloneNode(true) as HTMLElement;
    copy.querySelectorAll("[data-footnote-backref]").forEach((el) => el.remove());
    setNote(copy.innerHTML);

    const r = anchor.getBoundingClientRect();
    const width = Math.min(WIDTH, window.innerWidth - 32);
    const left = Math.max(16, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 16));
    const above = r.bottom + 200 > window.innerHeight && r.top > 200;
    setPos({ left, top: above ? r.top - GAP : r.bottom + GAP, above });
  };

  const hide = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPos(null), 150);
  };

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const jump = (e: MouseEvent) => {
    e.preventDefault();
    const touch = !window.matchMedia("(hover: hover)").matches;
    if (touch && !pos) {
      show();
      return;
    }
    setPos(null);
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    target.classList.add("footnote-highlight");
    window.setTimeout(() => target.classList.remove("footnote-highlight"), 2000);
    history.pushState(null, "", href);
  };

  return (
    <>
      <a
        ref={ref}
        href={href}
        className="footnote-ref"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={jump}
        {...props}
      >
        {children}
      </a>
      {pos &&
        note &&
        createPortal(
          <div
            role="tooltip"
            onMouseEnter={() => window.clearTimeout(hideTimer.current)}
            onMouseLeave={hide}
            className="footnote-preview fixed z-[70] rounded-md border border-border bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg"
            style={{
              left: pos.left,
              top: pos.top,
              width: Math.min(WIDTH, window.innerWidth - 32),
              transform: pos.above ? "translateY(-100%)" : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: note }}
          />,
          document.body
        )}
    </>
  );
}
