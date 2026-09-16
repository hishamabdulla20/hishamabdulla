type PublicSupabaseConfig = {
  url: string
  anonKey: string
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return url && anonKey ? { url, anonKey } : null
}

export function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getPublicSupabaseConfig() && getServiceRoleKey())
}
