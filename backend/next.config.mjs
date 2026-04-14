/** @type {import('next').NextConfig} */
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
    ],
  },
//  async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/dashboard',
//         permanent: false, 
//       },
//     ]
//   },
};

export default nextConfig;
