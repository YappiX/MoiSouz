import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'profsouz24.ru',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: '89.111.174.94',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    config.module.rules.push({
      test: /\.node/,
      use: {
        loader: 'raw-loader',
      },
    });

    return config;
  },
  transpilePackages: ['mui-tel-input'],
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    turbo: {
      loaders: {
        '*.svg': ['@svgr/webpack'],
      },
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
