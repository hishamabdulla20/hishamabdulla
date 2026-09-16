import Link from 'next/link'
import type { ReactNode } from 'react'
import { logoutAction } from '../actions'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' },
]

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">HA<span>.</span></Link>
        <nav aria-label="Admin navigation">
          {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{user.email}</span>
          <form action={logoutAction}><button type="submit">Sign out</button></form>
          <a href="/" target="_blank" rel="noreferrer">View portfolio ↗</a>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
