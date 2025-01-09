import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'firebasestorage.googleapis.com'], // Agrega aquí el dominio de Cloudinary
  },
};

export default nextConfig;
