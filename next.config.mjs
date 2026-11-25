/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["swiper", "swiper/react"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  reactCompiler: true,

  allowedDevOrigins: ["preview.bitss.one", "*.bitss.one"],
};

export default nextConfig;
