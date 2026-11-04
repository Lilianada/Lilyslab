"use client";

import { usePathname } from "next/navigation";
import { PrevNext } from "@/components/layout/prev-next";
import { PLAYGROUND_TOYS } from "@/lib/playground-toys";

/** Prev/Next between toys. It loops, so there's always another one to try. */
export function ToyPager() {
  const pathname = usePathname();
  const index = PLAYGROUND_TOYS.findIndex((toy) => toy.href === pathname);
  if (index === -1) return null;

  const count = PLAYGROUND_TOYS.length;
  const { href: prevHref, title: prevTitle } = PLAYGROUND_TOYS[(index - 1 + count) % count];
  const { href: nextHref, title: nextTitle } = PLAYGROUND_TOYS[(index + 1) % count];

  return (
    <div className="max-w-2xl w-full mx-auto">
      <PrevNext prev={{ href: prevHref, title: prevTitle }} next={{ href: nextHref, title: nextTitle }} />
    </div>
  );
}
