/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    BITCOIND_HOST: process.env.BITCOIND_HOST,  //read from .env.local
    BITCOIND_PORT: process.env.BITCOIND_PORT  //read from .env.local
  },
}

module.exports = nextConfig
