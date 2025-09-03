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

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
