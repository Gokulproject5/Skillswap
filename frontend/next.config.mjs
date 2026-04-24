/** @type {import('next').NextConfig} */

const proxyUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
    ],
  },
async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${proxyUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
