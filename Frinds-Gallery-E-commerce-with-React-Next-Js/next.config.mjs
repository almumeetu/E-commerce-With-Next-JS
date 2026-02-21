/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Required for standalone output to work properly on Hostinger
  trailingSlash: true,
  // Ensure reactStrictMode is enabled
  reactStrictMode: true,
  // Image optimization settings
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Ensure proper asset handling for deployment
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
