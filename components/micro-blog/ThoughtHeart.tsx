"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { readFromLocalStorage, writeToLocalStorage } from "@/hooks/use-local-storage";

const STORAGE_KEY = "liked_microblogs";

/** A private heart. It's remembered on this device and never counted. */
export function ThoughtHeart({ id }: { id: string }) {
  const [hearted, setHearted] = useState(false);

  useEffect(() => {
    setHearted(readFromLocalStorage<string[]>(STORAGE_KEY, []).includes(id));
  }, [id]);

  const toggle = () => {
    const saved = readFromLocalStorage<string[]>(STORAGE_KEY, []);
    writeToLocalStorage(STORAGE_KEY, hearted ? saved.filter((item) => item !== id) : [...saved, id]);
    setHearted(!hearted);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hearted}
      aria-label="Keep this thought"
      title="Just between us. Nobody's counting."
      className={`p-1 transition-all duration-200 hover:scale-125 active:scale-90 ${
        hearted ? "text-codeRed" : "text-muted-foreground hover:text-codeRed"
      }`}
    >
      <Heart size={13} className={hearted ? "fill-current" : ""} />
    </button>
  );
}
