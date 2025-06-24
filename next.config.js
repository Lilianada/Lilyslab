/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

console.log('Using next.config.js');
const nextConfig = {
  // Disable ESLint during builds for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds (optional)
  typescript: {
    ignoreBuildErrors: false, // Set to true if you want to ignore TS errors too
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://*.googleapis.com https://*.gstatic.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com https://*.gstatic.com",
              "connect-src 'self' https: blob:",
              "media-src 'self' https://firebasestorage.googleapis.com https://res.cloudinary.com https://*.cloudinary.com data: blob:",
              "frame-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://*.google.com https://accounts.google.com"
            ].join('; ') + ';',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  
  // Performance optimizations
  experimental: {
    // Enable modern bundling optimizations
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
  },
  
  // Better tree shaking for server components
  serverExternalPackages: ['sharp'],
  
  // Configure webpack for better optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split chunks more aggressively for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunks
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 30,
            },
            markdown: {
              test: /[\\/]node_modules[\\/](react-markdown|remark|rehype|gray-matter)[\\/]/,
              name: 'markdown-libs',
              chunks: 'all',
              priority: 20,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 2,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Configure allowed image domains
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'firebasestorage.googleapis.com',  // Firebase Storage images
       'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'images.gr-assets.com',
      'i.pinimg.com',
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);