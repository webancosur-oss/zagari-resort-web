import type {
  NextConfig,
} from "next";




const nextConfig: NextConfig = {

   env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },

  allowedDevOrigins: [
    "192.168.1.131"
  ],
  
  poweredByHeader:
    false,

  compress:
    true,

  images: {
    formats: [
      "image/avif",
      "image/webp",
    ],

    minimumCacheTTL:
      60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source:
          "/(.*)",

        headers: [
          {
            key:
              "X-Content-Type-Options",

            value:
              "nosniff",
          },

          {
            key:
              "Referrer-Policy",

            value:
              "strict-origin-when-cross-origin",
          },

          {
            key:
              "Permissions-Policy",

            value:
              "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;