// This file is no longer needed as we'll use the metadata API in the layout.tsx file
// Keeping this file as a reference for the RSS feed links

/*
RSS feed links to add to layout.tsx metadata:

{
  alternates: {
    types: {
      'application/rss+xml': '/api/rss',
      'application/atom+xml': '/api/rss?format=atom',
      'application/json': '/api/rss?format=json',
    },
  },
}
*/

export {}; // Empty export to avoid TypeScript errors
