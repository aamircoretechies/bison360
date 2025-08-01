/** @type {import('next').NextConfig} */
const nextConfig = {
  // For local development, basePath is '/'
  // This file will be overwritten during deployment with the appropriate basePath
 /*  images: {}, */
  /* output: 'standalone', */
  eslint: {
    ignoreDuringBuilds: true,
  },
   
  /* basePath: '/bison360',
  assetPrefix: '/bison360/', */
   
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
