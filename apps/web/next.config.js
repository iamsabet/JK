/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output only for Docker builds (avoids Windows symlink issues locally)
  ...(process.env.NEXT_STANDALONE === 'true' || process.env.DOCKER === 'true' ? { output: 'standalone' } : {}),
  experimental: {
    // optimizePackageImports for shadcn later
  },
}

module.exports = nextConfig
