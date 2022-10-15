/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  // async redirects() {
  //   return [{ source: "/login", destination: "/login", permanent: true }];
  // },
};

const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

module.exports = withPWA(nextConfig);
