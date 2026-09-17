'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthState = {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setState({ user: null, loading: false })
      return
    }

    // Fetch the current session once on mount.
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setState({ user: data.user, loading: false })
    })

    // Subscribe to auth state changes (sign in, sign out, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) await supabase.auth.signOut()
  }, [])

  return { ...state, signOut }
}
