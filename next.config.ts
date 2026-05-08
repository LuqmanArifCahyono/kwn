import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Mengabaikan error TypeScript saat proses build di Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mengabaikan peringatan ESLint saat proses build di Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;