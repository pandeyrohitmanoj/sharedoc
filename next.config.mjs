/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches:  {
            fullUrl: true,
        }
    },
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: '/**',
        },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3000mb',
    },
  },
  
};

export default nextConfig;
