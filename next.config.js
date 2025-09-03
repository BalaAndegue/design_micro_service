/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true ,
    domains: ['images.pexels.com', 'i.pinimg.com', 'customworld.onrender.com'],

  },
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
