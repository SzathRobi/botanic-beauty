/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  //   TODO: check if needed
  //   experimental: {
  //     taint: true,
  //   },
};

export default nextConfig;
