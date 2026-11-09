import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/resume', destination: '/resume/Nadeem_Ashraf_FDE_Master.pdf', permanent: false }];
  },
};
export default config;
