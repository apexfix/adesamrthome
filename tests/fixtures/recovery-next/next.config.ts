import path from 'node:path';

const nextConfig = {
  turbopack: { root: path.resolve(__dirname, '../../..') },
  async rewrites() { return [{ source: '/img/:path*', destination: 'http://localhost:6650/img/:path*' }]; },
};

export default nextConfig;
