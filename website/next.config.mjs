/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Jung217', // Fixes GitHub pages subpath routing for assets
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
