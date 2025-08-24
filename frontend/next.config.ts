import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BE_API_URL: process.env.NEXT_PUBLIC_BE_API_URL
  }
  /* config options here */
};

export default nextConfig;
