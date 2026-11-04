"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { burstPetals } from "@/components/fun/FunLayer";

const IMAGES = ["/images/12.png", "/images/13.png"];
const IMAGE_SIZE = 80; // tailwind w-20/h-20
const PAUSE_DURATION = 2000; // ms each image is fully visible
const TRANSITION_DURATION = 1200; // ms for blur-down

const frameStyle = {
  objectFit: "contain",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;

/**
 * Cycles through the logo images with a vertical fade-down reveal. It also
 * happens to be full of petals, if you click it.
 */
export default function AnimatedLogo() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const next = (current + 1) % IMAGES.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(
      () => {
        if (isTransitioning) setCurrent((frame) => (frame + 1) % IMAGES.length);
        setIsTransitioning((transitioning) => !transitioning);
      },
      isTransitioning ? TRANSITION_DURATION : PAUSE_DURATION
    );
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const mask = isTransitioning ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)" : "none";

  return (
    <button
      type="button"
      onClick={burstPetals}
      aria-label="Lily's Lab logo. Shake it for petals"
      className="hover-wiggle block relative overflow-hidden cursor-pointer"
      style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
    >
      <Image
        src={IMAGES[next]}
        alt=""
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        style={{ ...frameStyle, zIndex: 1 }}
        className="select-none pointer-events-none"
        draggable={false}
      />
      <Image
        src={IMAGES[current]}
        alt=""
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        style={{
          ...frameStyle,
          zIndex: 2,
          transition: isTransitioning ? `opacity ${TRANSITION_DURATION}ms linear` : "none",
          opacity: isTransitioning ? 0 : 1,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
        className="select-none pointer-events-none"
        draggable={false}
        priority
      />
    </button>
  );
}
