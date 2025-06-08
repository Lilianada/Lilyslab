# Cache Management System

## Overview

This documentation describes the comprehensive cache management system implemented to prevent cache bloat and maintain optimal site performance. The system was created in response to cache storage growing to over 900MB, and implements intelligent caching strategies with monitoring and management tools.

## Problem Background

- **Initial Issue**: Website cache storage climbed to 900MB+ due to aggressive service worker caching
- **Root Cause**: Service worker was caching everything including large audio files (3.6MB+ files)
- **Impact**: Poor performance, excessive storage usage, no cleanup mechanisms

## Solution Components

### 1. Intelligent Service Worker (`/public/sw.js`)

**Previous Behavior:**
- Single cache with no size limits
- Cached all requests indiscriminately
- No cleanup or management policies

**New Behavior:**
- **Separate Caches**: `lilyslab-static-v2`, `lilyslab-dynamic-v2`, `lilyslab-audio-v2`
- **Size Limits**: Static (10MB), Dynamic (50MB), Audio (100MB)
- **Smart Caching Strategies**:
  - Cache-first for static assets (CSS, JS, fonts)
  - Network-first for audio files
  - Selective caching for images and API responses
- **Automatic Cleanup**: Removes oldest/largest items when limits exceeded
- **Exclusions**: Large audio files like `wherehaveallthecowboysgone.mp3`

```javascript
// Example cache management
async function manageCacheSize(cacheName, maxSizeBytes) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  // Calculate current size and remove excess items
  // Implementation prioritizes keeping smaller, newer items
}
```

### 2. Cache Management Library (`/lib/cache-manager.ts`)

**Core Functions:**
- `getCacheStats()`: Returns detailed cache usage statistics
- `clearAllCaches()`: Safely clears all cache storage
- `formatBytes()`: Human-readable size formatting
- `monitorCacheSize()`: Periodic monitoring with alerts

**Global API:**
```javascript
// Available in browser console
window.cacheManager.getCacheStats()
window.cacheManager.clearAllCaches()
```

### 3. User Interface Components

#### Cache Monitor (`/components/cache-monitor.tsx`)
- Real-time cache statistics display
- Breakdown by cache type (static, dynamic, audio)
- Management controls (clear individual/all caches)
- Performance recommendations
- Visual indicators for cache health

#### Cache Warning Banner (`/components/cache-warning-banner.tsx`)
- Appears when cache exceeds 500MB
- Site-wide alert with clear action
- Dismissible with localStorage persistence
- Automatic re-checking

### 4. Enhanced Service Worker Registration (`/public/sw-register.js`)

**Features:**
- Periodic cache size monitoring (every 5 minutes)
- Automatic cleanup triggers
- Error handling and fallbacks
- Global API registration

### 5. Audio Context Optimization (`/lib/audio/audio-context.tsx`)

**localStorage Improvements:**
- 1MB size limit for cached audio tracks
- 1-hour cache expiration with timestamps
- Corrupted cache detection and cleanup
- Error handling for storage failures

```typescript
// Example localStorage cache with limits
const cacheData = {
  timestamp: Date.now(),
  data: audioTrackData,
  size: JSON.stringify(audioTrackData).length
};

if (cacheData.size <= MAX_CACHE_SIZE) {
  localStorage.setItem(key, JSON.stringify(cacheData));
}
```

## Integration Points

### Control Room Dashboard
The cache management system is fully integrated into the audio control room:

1. **Dashboard Card**: New "Cache Management" card alongside Upload, Manage, and Settings
2. **Full Interface**: Complete cache monitoring and management interface
3. **Navigation**: Seamless integration with existing dashboard navigation

### Site-wide Integration
- **Layout Integration**: Cache warning banner appears in main layout
- **Global Monitoring**: Continuous cache size monitoring across all pages
- **Automatic Alerts**: Users notified when cache grows too large

## Monitoring and Alerts

### Automatic Monitoring
- **Frequency**: Cache size checked every 5 minutes
- **Thresholds**: 
  - Warning at 500MB
  - Critical recommendations at various levels
- **Persistence**: Alert state stored in localStorage

### Manual Monitoring
- **Control Room**: Dedicated cache management interface
- **Browser Console**: `window.cacheManager` API for developers
- **Real-time Stats**: Live cache usage display

## Cache Strategies by Content Type

| Content Type | Strategy | Cache | Size Limit | Notes |
|--------------|----------|-------|------------|-------|
| CSS/JS | Cache-first | Static | 10MB | Long-term caching |
| Images | Selective | Dynamic | 50MB | Based on size/type |
| Audio | Network-first | Audio | 100MB | Excludes large files |
| API | Network-first | Dynamic | 50MB | Fresh data priority |
| Fonts | Cache-first | Static | 10MB | Performance critical |

## Configuration

### Cache Size Limits
```javascript
const CACHE_LIMITS = {
  'lilyslab-static-v2': 10 * 1024 * 1024,    // 10MB
  'lilyslab-dynamic-v2': 50 * 1024 * 1024,   // 50MB
  'lilyslab-audio-v2': 100 * 1024 * 1024     // 100MB
};
```

### Monitoring Intervals
```javascript
const MONITORING_CONFIG = {
  cacheCheckInterval: 5 * 60 * 1000,  // 5 minutes
  cleanupInterval: 60 * 60 * 1000,    // 1 hour
  warningThreshold: 500 * 1024 * 1024 // 500MB
};
```

## Performance Impact

### Before Implementation
- Cache growth: 900MB+ with no limits
- Performance: Degraded due to excessive storage
- User experience: No visibility or control

### After Implementation
- Cache growth: Controlled within defined limits
- Performance: Improved through intelligent caching
- User experience: Monitoring and control tools available

## Maintenance

### Regular Tasks
1. **Monitor Cache Health**: Check cache statistics weekly
2. **Review Exclusions**: Update large file exclusions as needed
3. **Adjust Limits**: Modify cache size limits based on usage patterns
4. **Update Strategies**: Refine caching strategies for new content types

### Emergency Procedures
1. **Cache Bloat**: Use Control Room cache management to clear excessive cache
2. **Performance Issues**: Check cache statistics and clear if necessary
3. **Storage Errors**: Clear all caches and restart service worker

## Troubleshooting

### Common Issues

**Cache Not Clearing:**
- Check service worker registration
- Verify cache names match current version
- Use browser dev tools to manually clear

**Monitoring Not Working:**
- Check service worker active state
- Verify localStorage permissions
- Review console for JavaScript errors

**Excessive Cache Growth:**
- Review exclusion patterns
- Check for new large files
- Adjust cache size limits if needed

### Debug Commands
```javascript
// Browser console debugging
await window.cacheManager.getCacheStats()
await window.cacheManager.clearAllCaches()

// Check service worker status
navigator.serviceWorker.getRegistrations()
```

## Future Enhancements

### Planned Improvements
1. **Advanced Analytics**: Historical cache usage tracking
2. **Predictive Cleanup**: ML-based cache prediction
3. **User Preferences**: Customizable cache settings
4. **Performance Metrics**: Cache hit/miss ratio tracking

### Technical Debt
1. **Cache Versioning**: Implement more sophisticated versioning
2. **Network Awareness**: Adapt caching based on connection quality
3. **Cross-browser Testing**: Ensure compatibility across all browsers

## Files Modified/Created

### Core Files
- `/public/sw.js` - Complete service worker rewrite
- `/public/sw-register.js` - Enhanced registration with monitoring
- `/lib/cache-manager.ts` - Cache management utilities
- `/lib/audio/audio-context.tsx` - localStorage optimization

### UI Components
- `/components/cache-monitor.tsx` - Cache monitoring interface
- `/components/cache-warning-banner.tsx` - Alert system
- `/components/ctrl-room/upload-audio.tsx` - Control room integration
- `/app/layout.tsx` - Site-wide banner integration

### Documentation
- `/docs/cache-management.md` - This documentation file

This cache management system provides a comprehensive solution to prevent cache bloat while maintaining excellent site performance through intelligent caching strategies and user-friendly monitoring tools.
