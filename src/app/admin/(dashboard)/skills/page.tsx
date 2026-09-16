import { ActionForm } from '@/components/admin/ActionForm'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { deleteSkillGroupAction, saveSkillGroupAction } from '../../actions'

type SkillRow = {
  id?: string
  category?: string
  number?: string
  skills?: string[]
  is_placeholder?: boolean
  published?: boolean
  sort_order?: number
}

function SkillForm({ group = {} }: { group?: SkillRow }) {
  return (
    <ActionForm action={saveSkillGroupAction} submitLabel={group.id ? 'Update group' : 'Create group'}>
      {group.id && <input type="hidden" name="id" value={group.id} />}
      <label>Category<input name="category" defaultValue={group.category ?? ''} maxLength={100} required /></label>
      <label>Number<input name="number" defaultValue={group.number ?? ''} maxLength={10} required /></label>
      <label className="admin-field--full">Skills (comma separated)<input name="skills" defaultValue={group.skills?.join(', ') ?? ''} required /></label>
      <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={group.sort_order ?? 0} /></label>
      <label className="admin-check"><input name="isPlaceholder" type="checkbox" defaultChecked={group.is_placeholder ?? false} /> Placeholder style</label>
      <label className="admin-check"><input name="published" type="checkbox" defaultChecked={group.published ?? true} /> Published</label>
    </ActionForm>
  )
}

export default async function AdminSkillsPage() {
  const admin = createAdminSupabaseClient()
  const { data: groups = [] } = admin
    ? await admin.from('skill_groups').select('*').order('sort_order')
    : { data: [] }

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Content</p><h1>Skills</h1><p>Group related technologies and control their public order.</p></header>
      <section className="admin-card" aria-labelledby="new-skill-group"><h2 id="new-skill-group">New skill group</h2><SkillForm /></section>
      <section className="admin-section" aria-labelledby="existing-skills">
        <h2 id="existing-skills">Existing groups</h2>
        {groups?.length ? groups.map((group) => (
          <details className="admin-card" key={group.id}>
            <summary>{group.category}<span>{group.published ? 'Published' : 'Draft'}</span></summary>
            <SkillForm group={group} />
            <form className="admin-delete-form" action={deleteSkillGroupAction}>
              <input type="hidden" name="id" value={group.id} />
              <button className="admin-danger" type="submit">Delete group</button>
            </form>
          </details>
        )) : <p className="admin-empty">No skill groups yet.</p>}
      </section>
    </>
  )
}
