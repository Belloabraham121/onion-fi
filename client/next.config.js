/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icons.llama.fi",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icons.llamao.fi",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "defillama.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore pino-pretty in client-side builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
