"use client";

import { useEffect } from "react";

const SITE = "https://lilyslab.xyz";
const SCRIPT = "https://webmention.io/js/webmention-render.js";
const STYLES = "https://webmention.io/assets/webmention-render.css";

/**
 * Likes, reposts and replies this page has received, via webmention.io's renderer.
 * The script only scans the page once when it loads, so it's re-added on every
 * post: moving between posts here doesn't reload the page.
 */
export function Webmentions({ path }: { path: string }) {
  // The site serves addresses without a trailing slash, so mentions point there.
  const target = `${SITE}${path.replace(/\/$/, "")}`;

  useEffect(() => {
    if (!document.querySelector(`link[href="${STYLES}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STYLES;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, [target]);

  return <div className="mt-8" data-webmention-target={target} />;
}
