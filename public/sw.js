// Service Worker for Lily's Lab - Optimized for Cache Management
const CACHE_NAME = 'lilyslab-cache-v2';
const STATIC_CACHE = 'lilyslab-static-v2';
const DYNAMIC_CACHE = 'lilyslab-dynamic-v2';
const AUDIO_CACHE = 'lilyslab-audio-v2';

// Cache size limits (in MB)
const MAX_STATIC_CACHE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DYNAMIC_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_AUDIO_CACHE_SIZE = 100 * 1024 * 1024; // 100MB

// Essential static assets to cache
const staticAssets = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/images/logo.png',
  '/images/icon-512x512.png'
];

// Cache size management utility
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  let totalSize = 0;
  const sizePromises = keys.map(async (request) => {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      return { request, size: blob.size };
    }
    return { request, size: 0 };
  });
  
  const sizes = await Promise.all(sizePromises);
  sizes.sort((a, b) => b.size - a.size); // Sort by size descending
  
  for (const { request, size } of sizes) {
    totalSize += size;
    if (totalSize > maxSize) {
      await cache.delete(request);
      console.log(`SW: Removed ${request.url} from cache to manage size`);
    }
  }
}

// Install event - cache essential assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching essential static files');
        return cache.addAll(staticAssets).catch(error => {
          console.warn(`Failed to cache some static resources: ${error}`);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and manage cache sizes
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, AUDIO_CACHE];
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Manage cache sizes
      manageCacheSize(STATIC_CACHE, MAX_STATIC_CACHE_SIZE),
      manageCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE),
      manageCacheSize(AUDIO_CACHE, MAX_AUDIO_CACHE_SIZE)
    ]).then(() => self.clients.claim())
  );
});

// Fetch event - selective caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests (let them go to network)
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Skip external resources
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle different types of requests with different strategies
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(event.request));
  } else if (isAudioFile(url)) {
    event.respondWith(handleAudioFile(event.request));
  } else if (isImageFile(url)) {
    event.respondWith(handleImageFile(event.request));
  } else {
    event.respondWith(handleDynamicContent(event.request));
  }
});

// Check if request is for a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.json', '.ico', '.png', '.jpg', '.svg'];
  const pathname = url.pathname;
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname === '/' || 
         pathname.includes('/favicon') ||
         pathname.includes('/manifest');
}

// Check if request is for an audio file
function isAudioFile(url) {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  return audioExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/audio/');
}

// Check if request is for an image file
function isImageFile(url) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/images/');
}

// Handle static assets - cache first with size management
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Only cache if it's not too large (less than 5MB for static assets)
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 5 * 1024 * 1024) {
        cache.put(request, networkResponse.clone());
        await manageCacheSize(STATIC_CACHE, MAX_STATIC_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: Error handling static asset:', error);
    return new Response('Static asset unavailable', { status: 503 });
  }
}

// Handle audio files - network first with selective caching
async function handleAudioFile(request) {
  try {
    // Always try network first for audio files
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Only cache small audio files (less than 10MB) and not the large cowboy song
      const contentLength = networkResponse.headers.get('content-length');
      const url = new URL(request.url);
      
      if (!url.pathname.includes('wherehaveallthecowboysgone.mp3') &&
          (!contentLength || parseInt(contentLength) < 10 * 1024 * 1024)) {
        const cache = await caches.open(AUDIO_CACHE);
        cache.put(request, networkResponse.clone());
        await manageCacheSize(AUDIO_CACHE, MAX_AUDIO_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache as fallback
    const cache = await caches.open(AUDIO_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('SW: Audio file unavailable:', error);
    return new Response('Audio unavailable', { status: 503 });
  }
}

// Handle image files - cache first with compression
async function handleImageFile(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Only cache images smaller than 2MB
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 2 * 1024 * 1024) {
        cache.put(request, networkResponse.clone());
        await manageCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: Error handling image:', error);
    return new Response('Image unavailable', { status: 503 });
  }
}

// Handle dynamic content - network first, limited caching
async function handleDynamicContent(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Only cache text-based content and small responses
      const contentType = networkResponse.headers.get('content-type');
      const contentLength = networkResponse.headers.get('content-length');
      
      if (contentType && 
          (contentType.includes('text/') || contentType.includes('application/json')) &&
          (!contentLength || parseInt(contentLength) < 1024 * 1024)) { // Less than 1MB
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        await manageCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache as fallback
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('SW: Content unavailable:', error);
    return new Response('Content unavailable', { status: 503 });
  }
}

// Handle service worker updates and cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    }));
  }
});

// Clear all caches utility
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(name => caches.delete(name))
  );
  console.log('SW: All caches cleared');
}

// Get total cache size utility
async function getCacheSize() {
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
}

// Periodic cache cleanup (runs every hour when SW is active)
setInterval(async () => {
  await manageCacheSize(STATIC_CACHE, MAX_STATIC_CACHE_SIZE);
  await manageCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
  await manageCacheSize(AUDIO_CACHE, MAX_AUDIO_CACHE_SIZE);
  console.log('SW: Periodic cache cleanup completed');
}, 60 * 60 * 1000); // 1 hour
