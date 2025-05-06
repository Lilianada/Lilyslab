/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://lh3.googleusercontent.com https://firebasestorage.googleapis.com data: blob:; font-src 'self' data:; connect-src 'self' https://apis.google.com https://identitytoolkit.googleapis.com https://*.firebaseio.com https://*.googleapis.com https://firebasestorage.googleapis.com blob:; media-src 'self' https://firebasestorage.googleapis.com data: blob:; frame-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
  // Enable React strict mode to catch bugs and improve development experience
  reactStrictMode: true,
  
  // Configure image optimization
  images: {
    // Set a reasonable cache TTL for images (in seconds)
    minimumCacheTTL: 60,
    // Define responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow images from external domains
    domains: [
      'lh3.googleusercontent.com', // Google authentication profile pictures
      'firebasestorage.googleapis.com', // Firebase Storage
    ],
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
