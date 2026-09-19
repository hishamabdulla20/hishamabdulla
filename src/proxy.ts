import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return NextResponse.next({ request })

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  const hasAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-'))

  // Fast path for unauthenticated admin route visits
  if (isAdminRoute && !isLoginPage && !hasAuthCookie) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  // Fast path for public routes without session cookies
  if (!isAdminRoute && !hasAuthCookie) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // Refresh the session so server components always have a fresh token.
  const { data: { user } } = await supabase.auth.getUser()

  // Guard admin routes — only users in the admin_users table may access /admin.
  // The full admin_users check happens in requireAdmin(), but blocking
  // unauthenticated visitors at the middleware layer avoids loading the admin layout.
  if (isAdminRoute) {
    if (!user && !isLoginPage) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  // Public pages do not read the server session. Keep token validation on the
  // protected admin boundary instead of delaying every portfolio navigation.
  matcher: ['/admin/:path*'],
}
