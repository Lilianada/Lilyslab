/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React strict mode to avoid double-rendering in development
  reactStrictMode: false,
  
  experimental: {
    // Disable CSS optimization to prevent caching issues
    optimizeCss: false,
  },
  
  // Configure image optimization
  images: {
    // Disable image caching
    minimumCacheTTL: 0,
    // Define responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Customize webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable webpack caching in development
      config.cache = false;
      
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
