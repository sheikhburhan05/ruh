/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
