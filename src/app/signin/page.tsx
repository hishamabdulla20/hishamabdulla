import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignInForm } from '@/components/auth/SignInForm'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import './signin.css'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default async function SignInPage() {
  // If already authenticated, redirect to home.
  const supabase = await createServerSupabaseClient()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/')
  }

  return (
    <main className="signin-page">
      <div className="signin-container">
        <a href="/" className="signin-back-link">
          ← Back to portfolio
        </a>
        <p className="signin-eyebrow technical-label">
          <span>HA</span> — Account
        </p>
        <h1>Sign in</h1>
        <p className="signin-subtitle">
          Continue with one of the options below.
        </p>
        <SignInForm />
      </div>
    </main>
  )
}

