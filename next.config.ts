import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.75",
    "192.168.1.131",
  ],
  images: {
    formats: [
      "image/avif",
      "image/webp",
    ],

    qualities: [
      100,
      75,
      50,
      25,
      10,
      5,
      80,
    ],
  },
};

export default nextConfig;