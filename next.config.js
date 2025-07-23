/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/configurator',
        destination: '/products',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
