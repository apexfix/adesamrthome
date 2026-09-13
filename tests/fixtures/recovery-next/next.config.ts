import path from 'node:path';

export default {
  turbopack: { root: path.resolve(__dirname, '../../..') },
  async rewrites() { return [{ source: '/img/:path*', destination: 'http://localhost:6650/img/:path*' }]; },
};
