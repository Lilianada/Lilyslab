// Enhanced Service Worker Registration with Cache Monitoring
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('SW registered: ', registration);
      
      // Set up cache monitoring
      setupCacheMonitoring();
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is available, notify user to refresh
            if (window.confirm('New version available! Click OK to refresh.')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
    
    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// Cache monitoring functions
function setupCacheMonitoring() {
  // Monitor cache size periodically
  setInterval(checkCacheSize, 5 * 60 * 1000); // Every 5 minutes
  
  // Initial check
  setTimeout(checkCacheSize, 5000); // After 5 seconds
}

async function checkCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    // Log if cache is getting large
    const totalMB = totalSize / (1024 * 1024);
    if (totalMB > 200) {
      console.warn(`Cache size is large: ${totalMB.toFixed(2)}MB`);
      
      // Show user notification if extremely large
      if (totalMB > 500) {
        console.error(`Cache size is excessive: ${totalMB.toFixed(2)}MB`);
        
        // Store warning in localStorage for display
        try {
          localStorage.setItem('cacheWarning', JSON.stringify({
            size: totalMB,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error('Failed to store cache warning', e);
        }
      }
    }
    
    // Store current size for monitoring
    try {
      localStorage.setItem('lastCacheSize', totalSize.toString());
    } catch (e) {
      console.error('Failed to store cache size', e);
    }
    
  } catch (error) {
    console.error('Error checking cache size:', error);
  }
}

// Expose cache management functions globally
window.cacheManager = {
  getCacheSize: async () => {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  },
  
  clearAllCaches: async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
    
    console.log('All caches cleared');
  },
  
  clearCache: async (cacheName) => {
    await caches.delete(cacheName);
    console.log(`Cache "${cacheName}" cleared`);
  }
};
