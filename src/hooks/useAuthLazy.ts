/**
 * Lazy auth initializer — dynamically imported by Navbar to avoid pulling
 * Supabase into the critical client bundle.
 */

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthState = {
  user: User | null
  loading: boolean
}

export function initAuth(
  onStateChange: (state: AuthState) => void,
  onSignOut: (fn: () => Promise<void>) => void,
) {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    onStateChange({ user: null, loading: false })
    return
  }

  let authEventVersion = 0

  supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
    const requestVersion = authEventVersion
    if (requestVersion === 0) {
      onStateChange({ user: data.user, loading: false })
    }
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    authEventVersion += 1
    onStateChange({ user: session?.user ?? null, loading: false })
  })

  onSignOut(async () => {
    const client = getSupabaseBrowserClient()
    if (client) await client.auth.signOut()
  })

  return () => {
    subscription.unsubscribe()
  }
}

