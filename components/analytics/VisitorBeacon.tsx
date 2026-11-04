"use client";

import { useEffect } from "react";

export const FIRST_VISIT_KEY = "garden_first_visit";

/** Remembers on this device that it has been counted, so it's only ever counted once. */
export function markVisitCounted() {
  try {
    localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
  } catch {
    // Storage is blocked, so this device can't be remembered either way.
  }
}

/** Counts this browser's first ever visit. Revisits send nothing. */
export function VisitorBeacon() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || navigator.webdriver) return;

    try {
      // If storage is blocked we couldn't remember the visit, so we don't count it.
      if (localStorage.getItem(FIRST_VISIT_KEY)) return;
    } catch {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer }),
        });
        if (response.ok) markVisitCounted();
      } catch {
        // It'll try again on the next page load.
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
