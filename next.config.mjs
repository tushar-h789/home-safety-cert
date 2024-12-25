/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/:path*',
            destination: 'https://' + process.env.VERCEL_URL + '/:path*',
          },
        ]
      : [];
  },
};

// Use export default for ES modules
export default nextConfig;
