"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Dices } from "lucide-react";
import { cn } from "@/lib/utils";

let cachedPaths: string[] | null = null;

/** Sends the visitor somewhere random in the garden. */
export function WanderButton({ variant = "icon" }: { variant?: "icon" | "link" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isWandering, setIsWandering] = useState(false);

  const wander = async () => {
    if (isWandering) return;
    setIsWandering(true);

    try {
      cachedPaths ??= (await fetch("/api/wander").then((response) => response.json())) as string[];
      const options = cachedPaths.filter((path) => path !== pathname);
      router.push(options[Math.floor(Math.random() * options.length)]);
    } catch (error) {
      console.error("Couldn't find a path to wander down:", error);
    } finally {
      // Long enough for the dice to land.
      window.setTimeout(() => setIsWandering(false), 500);
    }
  };

  if (variant === "link") {
    return (
      <button type="button" onClick={wander} className="text-codeRed hover:italic">
        take a wander
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={wander}
      title="Wander somewhere random"
      aria-label="Wander somewhere random"
      className="h-8 w-8 rounded-md border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors"
    >
      <Dices size={16} className={cn("transition-transform duration-500", isWandering && "rotate-[360deg]")} />
    </button>
  );
}
