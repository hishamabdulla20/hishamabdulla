'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthState = {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [supabase] = useState(() => getSupabaseBrowserClient())
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    loading: Boolean(supabase),
  }))

  useEffect(() => {
    if (!supabase) return

    let active = true
    let authEventVersion = 0

    // Fetch the current session once on mount.
    const requestVersion = authEventVersion
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (active && requestVersion === authEventVersion) {
        setState({ user: data.user, loading: false })
      }
    })

    // Subscribe to auth state changes (sign in, sign out, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      authEventVersion += 1
      if (active) setState({ user: session?.user ?? null, loading: false })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) await supabase.auth.signOut()
  }, [])

  return { ...state, signOut }
}
