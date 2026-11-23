/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ["swiper", "swiper/react"],
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        // hostname: ["scottypumpkin.com", "usfranc.com"],
        // port: "",
        // pathname: "/**",
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactCompiler: true,
  // Allow HMR (Fast Refresh) to work through Nginx reverse proxy
  allowedDevOrigins: ["preview.bitss.one", "*.bitss.one"],
};

export default nextConfig;
