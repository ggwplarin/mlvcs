/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      layoutRaw: true,
    },
    outputStandalone: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
    layoutRaw: true,
  },
}

module.exports = nextConfig
