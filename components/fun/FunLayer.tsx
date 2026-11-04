"use client";

import { useEffect } from "react";

const SECRET_CODES = [
  ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"],
  ["l", "i", "l", "y"],
];
const LONGEST_CODE = Math.max(...SECRET_CODES.map((code) => code.length));

export function burstPetals() {
  window.dispatchEvent(new Event("garden:petals"));
}

/**
 * The garden's secrets. Listens for the secret codes and for burstPetals(); the
 * animation itself is only downloaded the first time it plays.
 */
export function FunLayer() {
  useEffect(() => {
    let recentKeys: string[] = [];

    const shower = () => {
      import("@/lib/petal-shower").then(({ startPetalShower }) => startPetalShower());
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      recentKeys = [...recentKeys, event.key.toLowerCase()].slice(-LONGEST_CODE);
      const typed = recentKeys.join(" ");
      if (SECRET_CODES.some((code) => typed.endsWith(code.join(" ")))) {
        recentKeys = [];
        shower();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("garden:petals", shower);
    console.log(
      "%c✳︎ you found the back of the garden ✳︎\n%cpsst: type \"lily\" anywhere on the page.",
      "color:#E8ADB1;font-size:14px;font-weight:bold",
      "color:#A2CBAF"
    );

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("garden:petals", shower);
    };
  }, []);

  return null;
}
