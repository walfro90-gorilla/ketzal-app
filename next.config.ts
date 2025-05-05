import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'firebasestorage.googleapis.com', 'picsum.photos'], // Agrega aquí el dominio de Cloudinary
  },
  experimental:  {
    serverActions:  {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
