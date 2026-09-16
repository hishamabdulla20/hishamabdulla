import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { getPublicSupabaseConfig, getServiceRoleKey } from './env'

export function createAdminSupabaseClient() {
  const config = getPublicSupabaseConfig()
  const serviceRoleKey = getServiceRoleKey()
  if (!config || !serviceRoleKey) return null

  return createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
