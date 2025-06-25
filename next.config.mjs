/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.svg'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/app-dissection',
        destination: '/playground/app-dissection',
        permanent: true,
      },
      {
        source: '/case-studies/leaflet',
        destination: 'https://codedbabe.notion.site/Leaflet-App-Case-Study-19ef441cd2fd80689b50c8ed3360b150?pvs=74',
        permanent: true,
      },
      {
        source: '/case-studies/plannr',
        destination: 'https://codedbabe.notion.site/Plannr-App-Product-Strategy-Requirements-Doc-PSRD-185f441cd2fd80a9b4ede8d73cd5570c',
        permanent: true,
      },
      {
        source: '/case-studies/upmonie',
        destination: 'https://codedbabe.notion.site/Upmonie-AI-Powered-Fintech-Startup-192f441cd2fd8049b9f8d575efc08cf6?pvs=74',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/',
        permanent: true,
      },
      {
        source: '/fun-stuff',
        destination: '/playground',
        permanent: true,
      },
      {
        source: '/fun-stuff/app-dissection',
        destination: '/playground/app-dissection',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
