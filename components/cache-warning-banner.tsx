"use client";

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { formatBytes } from '@/lib/cache-manager';

interface CacheWarning {
  size: number;
  timestamp: number;
}

export function CacheWarningBanner() {
  const [warning, setWarning] = useState<CacheWarning | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check for cache warnings periodically
    const checkWarnings = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const warningData = localStorage.getItem('cacheWarning');
        if (warningData) {
          const parsedWarning: CacheWarning = JSON.parse(warningData);
          
          // Only show warnings from the last hour
          const oneHour = 60 * 60 * 1000;
          if (Date.now() - parsedWarning.timestamp < oneHour) {
            setWarning(parsedWarning);
          } else {
            // Remove old warnings
            localStorage.removeItem('cacheWarning');
          }
        }
      } catch (error) {
        console.error('Error checking cache warnings:', error);
        localStorage.removeItem('cacheWarning');
      }
    };

    checkWarnings();
    
    // Check every minute
    const interval = setInterval(checkWarnings, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    try {
      // Use the global cache manager if available
      if (window.cacheManager) {
        await window.cacheManager.clearAllCaches();
      } else {
        // Fallback: clear caches directly
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear the warning
      localStorage.removeItem('cacheWarning');
      setWarning(null);
      
      // Show success message
      alert('Cache cleared successfully! The page will reload.');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache. Please try manually clearing your browser cache.');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Remove the warning but set a flag to not show it again for this session
    sessionStorage.setItem('cacheWarningDismissed', 'true');
  };

  // Don't show if dismissed or no warning
  if (!warning || dismissed || sessionStorage.getItem('cacheWarningDismissed')) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>High Cache Usage Detected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 -mr-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Your browser cache has grown to {formatBytes(warning.size * 1024 * 1024)}, 
          which may slow down your browsing experience and use excessive storage space.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={handleClearCache}
            variant="outline"
            size="sm"
            className="bg-background"
          >
            Clear Cache Now
          </Button>
          <Button 
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Declare global cache manager type
declare global {
  interface Window {
    cacheManager?: {
      getCacheSize: () => Promise<number>;
      clearAllCaches: () => Promise<void>;
      clearCache: (cacheName: string) => Promise<void>;
    };
  }
}
