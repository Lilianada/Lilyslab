'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export function HomeViewCounter() {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch view count
  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/views');
        if (!response.ok) throw new Error('Failed to fetch view count');
        const data = await response.json();
        setViewCount(data.viewCount);
      } catch (error) {
        console.error('Error fetching view count:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to avoid blocking initial render
    const timer = setTimeout(() => {
      fetchViewCount();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format the view count (e.g., 1000 -> 1K)
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  // Safe format to handle null values
  const safeFormatViewCount = (count: number | null): string => {
    return count !== null ? formatViewCount(count) : '0';
  };

  // Position based on screen size
  const positionClass = isMobile
    ? 'fixed bottom-4 right-4' // Bottom right on mobile
    : 'fixed top-4 right-4';   // Top right on desktop

  // Don't render anything if there's an error or we're still loading
  if (error || (isLoading && viewCount === null)) {
    return null;
  }

  return (
    <div 
      className={`${positionClass} flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm`}
      title={`${viewCount} total views`}
    >
      <Eye className="h-2.5 w-2.5 text-muted-foreground" />
      <span className="text-[10px] font-medium text-muted-foreground">
        {safeFormatViewCount(viewCount)}
      </span>
    </div>
  );
}
