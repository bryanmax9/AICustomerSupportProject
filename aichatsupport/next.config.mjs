/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React's Strict Mode
  swcMinify: true, // Enable the SWC compiler for minification
  pageExtensions: ["js", "jsx"], // Only look for pages with .js or .jsx extensions in the app directory
  experimental: {
    appDir: true, // This tells Next.js to use the new app directory (if you're using the app directory structure)
  },
};

export default nextConfig;
