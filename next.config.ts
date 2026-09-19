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
}

export default nextConfig
