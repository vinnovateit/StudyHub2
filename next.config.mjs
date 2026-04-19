/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose", "mongodb", "@mongodb-js/saslprep"],
};

export default nextConfig;
