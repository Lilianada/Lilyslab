"use client";

import { usePathname } from "next/navigation";

/** Hides its children on the given pages, e.g. the footer on full-page tools like Write. */
export function HideOn({ paths, children }: { paths: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  if (paths.includes(pathname)) return null;
  return <>{children}</>;
}
