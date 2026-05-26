// lib/build-info.ts

export const BUILD_INFO = {
  lastUpdated: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
  source: 'vercel',
};