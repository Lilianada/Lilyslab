/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://*.googleapis.com https://*.gstatic.com https://webmention.io",
  "style-src 'self' 'unsafe-inline' https://webmention.io",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https: blob:",
  "media-src 'self' https://firebasestorage.googleapis.com https://res.cloudinary.com https://*.cloudinary.com data: blob:",
  "frame-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://*.google.com https://accounts.google.com",
].join('; ') + ';';

// Files in /public keep the same name when they change, so they get a day of
// fresh caching and a week of background revalidation rather than `immutable`.
const publicAssetCache = {
  key: 'Cache-Control',
  value: 'public, max-age=86400, stale-while-revalidate=604800',
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    // The course has no overview page; its tracks are listed on Resources.
    return [
      { source: '/resources/build-your-own-website', destination: '/resources', permanent: false },
      { source: '/playground/color-theory', destination: '/projects', permanent: true },
      { source: '/playground', destination: '/projects', permanent: true },
      { source: '/playground/petal-catch', destination: '/projects', permanent: true },
      { source: '/playground/doodle', destination: '/projects', permanent: true },
      { source: '/playground/calculator', destination: '/projects', permanent: true },
      { source: '/playground/terminal', destination: '/playground/write', permanent: true },
      { source: '/playground/animation-lab', destination: '/playground/burn-cd', permanent: true },
      { source: '/ctrl-room/transcribe', destination: '/playground/transcribe', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      { source: '/images/:path*', headers: [publicAssetCache] },
      { source: '/fonts/:path*', headers: [publicAssetCache] },
      { source: '/audio/:path*', headers: [publicAssetCache] },
      { source: '/archives/wordpress-posts/:path*', headers: [publicAssetCache] },
    ];
  },
  reactStrictMode: true,

  serverExternalPackages: ['sharp'],

  // Content/ holds 70MB of archive photos that are served from /public (see
  // scripts/sync-archive-images.js). Server functions only read the markdown.
  // Build output and caches never belong in a function: Netlify rejects one that's too big.
  outputFileTracingExcludes: {
    '*': ['Content/**/*.{jpg,jpeg,png,gif,webp}', 'public/archives/**', '.netlify/**', '.next/cache/**'],
  },

  images: {
    remotePatterns: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'images.gr-assets.com',
      'i.pinimg.com',
    ].map((hostname) => ({ protocol: 'https', hostname })),
  },
};

module.exports = withBundleAnalyzer(nextConfig);
