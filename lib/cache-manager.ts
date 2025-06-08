// Cache Management Utility
// Provides tools to monitor and manage browser cache storage

export interface CacheInfo {
  name: string;
  size: number;
  entries: number;
}

export interface CacheStats {
  totalSize: number;
  totalEntries: number;
  caches: CacheInfo[];
  formattedSize: string;
  storageQuota?: number;
  storageUsage?: number;
}

/**
 * Get detailed information about all caches
 */
export async function getCacheStats(): Promise<CacheStats> {
  try {
    const cacheNames = await caches.keys();
    const cacheInfos: CacheInfo[] = [];
    let totalSize = 0;
    let totalEntries = 0;

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      let cacheSize = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          cacheSize += blob.size;
        }
      }

      cacheInfos.push({
        name,
        size: cacheSize,
        entries: keys.length,
      });

      totalSize += cacheSize;
      totalEntries += keys.length;
    }

    // Get storage quota information if available
    let storageQuota: number | undefined;
    let storageUsage: number | undefined;

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      storageQuota = estimate.quota;
      storageUsage = estimate.usage;
    }

    return {
      totalSize,
      totalEntries,
      caches: cacheInfos,
      formattedSize: formatBytes(totalSize),
      storageQuota,
      storageUsage,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalSize: 0,
      totalEntries: 0,
      caches: [],
      formattedSize: '0 B',
    };
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  try {
    // Clear service worker caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));

    // Clear browser cache by sending message to service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }

    console.log('All caches cleared successfully');
  } catch (error) {
    console.error('Error clearing caches:', error);
    throw error;
  }
}

/**
 * Clear a specific cache
 */
export async function clearCache(cacheName: string): Promise<void> {
  try {
    await caches.delete(cacheName);
    console.log(`Cache "${cacheName}" cleared successfully`);
  } catch (error) {
    console.error(`Error clearing cache "${cacheName}":`, error);
    throw error;
  }
}

/**
 * Get localStorage usage information
 */
export function getLocalStorageInfo(): { size: number; entries: number; formattedSize: string } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { size: 0, entries: 0, formattedSize: '0 B' };
  }

  let totalSize = 0;
  const entries = Object.keys(localStorage).length;

  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      if (value) {
        // Approximate size calculation (UTF-16 encoding)
        totalSize += (key.length + value.length) * 2;
      }
    }
  }

  return {
    size: totalSize,
    entries,
    formattedSize: formatBytes(totalSize),
  };
}

/**
 * Clear audio-related localStorage entries
 */
export function clearAudioLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const audioKeys = [
    'currentAudioTrack',
    'cachedAudioTracks',
    'musicPlayerPlayCount',
    'music_player_paused',
    'music_player_color',
    'audioPlayerSettings',
    'lastPlayedTrack',
  ];

  audioKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key: ${key}`, error);
    }
  });

  // Also remove any keys that contain 'audio' or 'music'
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.toLowerCase().includes('audio') || key.toLowerCase().includes('music')) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove localStorage key: ${key}`, error);
      }
    }
  });

  console.log('Audio-related localStorage entries cleared');
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Monitor cache size changes
 */
export class CacheMonitor {
  private interval: NodeJS.Timeout | null = null;
  private listeners: ((stats: CacheStats) => void)[] = [];

  start(intervalMs: number = 30000): void {
    if (this.interval) return; // Already running

    this.interval = setInterval(async () => {
      const stats = await getCacheStats();
      this.listeners.forEach(listener => listener(stats));
    }, intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  addListener(listener: (stats: CacheStats) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (stats: CacheStats) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}

/**
 * Detect if cache is growing excessively
 */
export function detectExcessiveCacheGrowth(stats: CacheStats): boolean {
  const MAX_REASONABLE_CACHE_SIZE = 200 * 1024 * 1024; // 200MB
  return stats.totalSize > MAX_REASONABLE_CACHE_SIZE;
}

/**
 * Get cache recommendations based on current usage
 */
export function getCacheRecommendations(stats: CacheStats): string[] {
  const recommendations: string[] = [];

  if (stats.totalSize > 500 * 1024 * 1024) { // > 500MB
    recommendations.push('Cache size is very large (>500MB). Consider clearing caches.');
  } else if (stats.totalSize > 200 * 1024 * 1024) { // > 200MB
    recommendations.push('Cache size is large (>200MB). Monitor growth.');
  }

  // Check for individual large caches
  stats.caches.forEach(cache => {
    if (cache.size > 100 * 1024 * 1024) { // > 100MB
      recommendations.push(`Cache "${cache.name}" is large (${formatBytes(cache.size)})`);
    }
  });

  if (stats.totalEntries > 1000) {
    recommendations.push('High number of cached entries. Consider periodic cleanup.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Cache usage looks healthy!');
  }

  return recommendations;
}
