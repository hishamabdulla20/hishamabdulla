import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/'

  // Prevent open-redirect attacks: only allow relative paths on the same origin.
  let redirectTo: string
  try {
    const target = new URL(rawNext, origin)
    redirectTo = target.origin === origin ? target.pathname + target.search : '/'
  } catch {
    redirectTo = '/'
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL(redirectTo, origin))
      }
      console.error('[portfolio:auth-callback] Code exchange failed:', error.message)
    }
  }

  // On failure, redirect to the sign-in page with a generic error indicator.
  const signinUrl = new URL('/signin', origin)
  signinUrl.searchParams.set('error', 'callback')
  return NextResponse.redirect(signinUrl)
}

