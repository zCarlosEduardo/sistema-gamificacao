import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.18.6",
    "http://192.168.18.6",
    "http://192.168.18.6:3000",
  ],
};

export default nextConfig;
