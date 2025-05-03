'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * @param query CSS media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client-side render
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Define a callback function to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the listener to the media query
    media.addEventListener('change', listener);
    
    // Clean up function to remove the listener
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Re-run if the query changes
  
  return matches;
}
