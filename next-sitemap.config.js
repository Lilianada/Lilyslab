/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lilyslab.xyz',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/server-sitemap.xml',
    '/admin/*',
    '/playground/coming-soon',
    '/digital-garden/coming-soon',
    '/workshop/shop'
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://lilyslab.xyz/server-sitemap.xml',
    ],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api', '/admin'] },
    ],
  },
};
