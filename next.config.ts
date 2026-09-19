import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    useTypeScriptCli: false,
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },
  async rewrites() {
    return [
      { source: '/thoughts/:slug', destination: '/writing/:slug' },
      { source: '/opinions/:slug', destination: '/writing/:slug' },
    ]
  },
}

export default nextConfig
