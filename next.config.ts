import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable optimization for development
    unoptimized: true,
  },
  experimental:  {
    serverActions:  {
      bodySizeLimit: '10mb',
    },
    // Disable turbopack for better stability with auth
    turbo: {
      resolveAlias: {
        // Ensure consistent React server runtime
        'react-server-dom-webpack/server.edge': 'react-server-dom-webpack/server.edge',
        'react-server-dom-turbopack/server.edge': 'react-server-dom-webpack/server.edge',
      },
    },
  },
};

export default nextConfig;
