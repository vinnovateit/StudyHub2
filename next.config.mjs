/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "mongoose",
      "mongodb",
      "@mongodb-js/saslprep",
    ],
  },
};

export default nextConfig;
