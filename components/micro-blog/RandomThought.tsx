"use client";

/** Jumps to a random post. The page highlights whichever post the URL points at. */
export function RandomThought({ ids }: { ids: string[] }) {
  const pick = () => {
    const others = ids.filter((id) => `#${id}` !== window.location.hash);
    window.location.hash = others[Math.floor(Math.random() * others.length)];
  };

  return (
    <button
      type="button"
      onClick={pick}
      className="hover-wiggle text-xs px-3 py-1.5 rounded-md border border-dashed border-codeRed text-codeRed hover:bg-accent transition-colors"
    >
      Pull a random thought
    </button>
  );
}
