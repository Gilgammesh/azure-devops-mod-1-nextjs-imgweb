/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env['API_BASE_URL']
  },
  images: {
    domains: ["nestimgstore.blob.core.windows.net"]
  }
};

module.exports = nextConfig;
