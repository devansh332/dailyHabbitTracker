const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});
console.log(process.env.NODE_ENV, "process.env.NODE_ENV ");
/** @type {import('next').NextConfig} */

module.exports = withPWA({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
});
