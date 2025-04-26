/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com', // TODO: Set your production URL
  generateRobotsTxt: true,
  // Add more options as needed
  // Exclude admin or draft routes if necessary
  // See: https://github.com/iamvishnusankar/next-sitemap#configuration-options
};
