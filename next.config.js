/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode to catch bugs and improve development experience
  reactStrictMode: true,
  
  // Configure image optimization
  images: {
    // Set a reasonable cache TTL for images (in seconds)
    minimumCacheTTL: 60,
    // Define responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Customize webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Allow webpack caching in development for faster rebuilds
      // and better Fast Refresh support
      
      // Optimize resource loading to prevent preload warnings
      if (!isServer) {
        // Modify how preloaded resources are handled
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        };
      }
    }
    return config;
  },
};

module.exports = nextConfig;
