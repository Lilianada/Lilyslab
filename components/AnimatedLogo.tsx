import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const IMAGES = ["/12.png", "/13.png"];
const IMAGE_SIZE = 80; // 5rem in px (tailwind w-20/h-20)
const PAUSE_DURATION = 2000; // ms each image is fully visible
const TRANSITION_DURATION = 1200; // ms for blur-down

/**
 * AnimatedLogo cycles through images with a vertical blur-down reveal effect.
 */
export default function AnimatedLogo() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [next, setNext] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isTransitioning) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
      }, PAUSE_DURATION);
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setNext((prev) => (prev + 1) % IMAGES.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isTransitioning, current]);

  // For accessibility: alt text can be improved
  return (
    <div
      className="w-20 h-20 mb-6 object-contain relative overflow-hidden"
      style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
    >
      {/* Next image underneath */}
      {/* Next image underneath */}
      <Image
        src={IMAGES[next]}
        alt="Animated Logo Next"
        fill
        style={{
          objectFit: "contain",
          zIndex: 1,
          pointerEvents: "none",
          transition: 'none',
        }}
        className="select-none pointer-events-none"
        draggable={false}
        priority
      />
      {/* Current image on top, animating out with blur+fade */}
      <Image
        src={IMAGES[current]}
        alt="Animated Logo Current"
        fill
        style={{
          objectFit: "contain",
          zIndex: 2,
          pointerEvents: "none",
          transition: `filter ${TRANSITION_DURATION}ms linear, opacity ${TRANSITION_DURATION}ms linear`,
          opacity: isTransitioning ? 0 : 1,
          maskImage: isTransitioning
            ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)"
            : "none",
          WebkitMaskImage: isTransitioning
            ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)"
            : "none",
        }}
        className="select-none pointer-events-none"
        draggable={false}
        priority
      />
    </div>
  );
}
