import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/LoginForm'
import { getAdminUser } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect('/admin')

  return (
    <main className="admin-login">
      <section className="admin-login__panel" aria-labelledby="login-title">
        <a href="/" className="admin-back-link">← Back to portfolio</a>
        <p className="admin-eyebrow">Portfolio administration</p>
        <h1 id="login-title">Sign in</h1>
        <p>Use the Supabase Auth account that has been added to the <code>admin_users</code> table.</p>
        {!isSupabaseConfigured() && (
          <p className="admin-notice admin-notice--error">
            Supabase is not configured. Add the variables from <code>.env.example</code> first.
          </p>
        )}
        <LoginForm />
      </section>
    </main>
  )
}
