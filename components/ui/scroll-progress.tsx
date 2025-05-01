'use client';

import React, { useEffect, useState } from 'react';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  zIndex?: number;
  glow?: boolean;
  glowColor?: string;
  glowIntensity?: string;
}

export function ScrollProgress({
  color = 'bg-primary',
  height = 2,
  zIndex = 50,
  glow = true,
  glowColor = 'rgba(var(--primary), 0.7)',
  glowIntensity = '10px'
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far the user has scrolled
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY;
      
      // Convert to percentage (0-100)
      const percentage = (currentProgress / totalHeight) * 100;
      
      // Update state
      setScrollProgress(percentage);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{ height: `${height}px`, zIndex }}
    >
      <div 
        className={`h-full ${color} transition-all duration-150 ease-out`}
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: glow ? `0 0 ${glowIntensity} ${glowColor}` : 'none',
        }}
      />
    </div>
  );
}
