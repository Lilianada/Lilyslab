const createMDX = require('@next/mdx');

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

const withMDX = createMDX({});
module.exports = withMDX(nextConfig);
