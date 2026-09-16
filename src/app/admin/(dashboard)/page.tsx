import Link from 'next/link'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

export default async function AdminOverviewPage() {
  const admin = createAdminSupabaseClient()
  const empty = { count: 0 }
  const [projects, articles, skills, messages] = admin ? await Promise.all([
    admin.from('projects').select('id', { count: 'exact', head: true }),
    admin.from('articles').select('id', { count: 'exact', head: true }),
    admin.from('skill_groups').select('id', { count: 'exact', head: true }),
    admin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]) : [empty, empty, empty, empty]

  const cards = [
    { label: 'Projects', value: projects.count ?? 0, href: '/admin/projects' },
    { label: 'Articles', value: articles.count ?? 0, href: '/admin/articles' },
    { label: 'Skill groups', value: skills.count ?? 0, href: '/admin/skills' },
    { label: 'New messages', value: messages.count ?? 0, href: '/admin/messages' },
  ]

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Dashboard</p><h1>Overview</h1><p>Manage the content shown on your public portfolio.</p></header>
      <section className="admin-stats" aria-label="Content totals">
        {cards.map((card) => (
          <Link href={card.href} className="admin-stat" key={card.label}>
            <strong>{card.value}</strong><span>{card.label}</span>
          </Link>
        ))}
      </section>
    </>
  )
}
