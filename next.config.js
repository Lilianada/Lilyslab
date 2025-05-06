/** @type {import('next').NextConfig} */
console.log('Using next.config.js');
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://*.googleapis.com https://*.gstatic.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              connect-src 'self' https:;
              media-src 'self' https://firebasestorage.googleapis.com data: blob:;
              frame-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://*.google.com https://accounts.google.com;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  
  // Configure allowed image domains
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'firebasestorage.googleapis.com',  // Firebase Storage images
    ],
  },
};

module.exports = nextConfig;