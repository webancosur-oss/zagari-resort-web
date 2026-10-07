import type { NextConfig } from "next";

// Mismas directivas que la meta "robots" de app/layout.tsx: cabecera y HTML
// no deben contradecirse. La cabecera cubre también lo que no es HTML
// (imágenes, PDF, llms.txt), donde no hay <meta>.
const X_ROBOTS_TAG = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_TAG }],
      },
    ];
  },
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