import { redirect } from 'next/navigation'
import { createAdminSupabaseClient } from './supabase/admin'
import { createServerSupabaseClient } from './supabase/server'

export type AdminUser = {
  id: string
  email: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createServerSupabaseClient()
  const admin = createAdminSupabaseClient()
  if (!supabase || !admin) return null

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: authorization, error: authorizationError } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (authorizationError || !authorization) return null

  return { id: user.id, email: user.email ?? 'Admin' }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')
  return admin
}

export async function authorizeAdminMutation(): Promise<AdminUser> {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Unauthorized')
  return admin
}
