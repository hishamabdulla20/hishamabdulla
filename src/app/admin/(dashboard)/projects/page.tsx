import { ActionForm } from '@/components/admin/ActionForm'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { deleteProjectAction, saveProjectAction } from '../../actions'

type ProjectRow = {
  id?: string
  number?: string
  name?: string
  type?: string
  description?: string
  technologies?: string[]
  live_url?: string | null
  github_url?: string | null
  case_study_url?: string | null
  image_url?: string | null
  status?: string
  featured?: boolean
  published?: boolean
  sort_order?: number
}

function ProjectForm({ project = {} }: { project?: ProjectRow }) {
  return (
    <ActionForm action={saveProjectAction} submitLabel={project.id ? 'Update project' : 'Create project'}>
      {project.id && <input type="hidden" name="id" value={project.id} />}
      <label>Number<input name="number" defaultValue={project.number ?? ''} maxLength={10} required /></label>
      <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={project.sort_order ?? 0} /></label>
      <label>Name<input name="name" defaultValue={project.name ?? ''} maxLength={120} required /></label>
      <label>Type<input name="type" defaultValue={project.type ?? ''} maxLength={120} required /></label>
      <label className="admin-field--full">Description<textarea name="description" defaultValue={project.description ?? ''} maxLength={2000} required /></label>
      <label className="admin-field--full">Technologies (comma separated)<input name="technologies" defaultValue={project.technologies?.join(', ') ?? ''} /></label>
      <label>Live URL<input name="liveUrl" type="url" defaultValue={project.live_url ?? ''} /></label>
      <label>GitHub URL<input name="githubUrl" type="url" defaultValue={project.github_url ?? ''} /></label>
      <label>Case-study URL<input name="caseStudyUrl" type="url" defaultValue={project.case_study_url ?? ''} /></label>
      <label>Image URL<input name="imageUrl" type="url" defaultValue={project.image_url ?? ''} /></label>
      <label>Status<input name="status" defaultValue={project.status ?? 'Project'} maxLength={100} required /></label>
      <label className="admin-check"><input name="featured" type="checkbox" defaultChecked={project.featured ?? false} /> Featured</label>
      <label className="admin-check"><input name="published" type="checkbox" defaultChecked={project.published ?? false} /> Published</label>
    </ActionForm>
  )
}

export default async function AdminProjectsPage() {
  const admin = createAdminSupabaseClient()
  const { data: projects = [] } = admin
    ? await admin.from('projects').select('*').order('sort_order')
    : { data: [] }

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Content</p><h1>Projects</h1><p>Create drafts, reorder work, and publish only when it is ready.</p></header>
      <section className="admin-card" aria-labelledby="new-project"><h2 id="new-project">New project</h2><ProjectForm /></section>
      <section className="admin-section" aria-labelledby="existing-projects">
        <h2 id="existing-projects">Existing projects</h2>
        {projects?.length ? projects.map((project) => (
          <details className="admin-card" key={project.id}>
            <summary>{project.name}<span>{project.published ? 'Published' : 'Draft'}</span></summary>
            <ProjectForm project={project} />
            <form className="admin-delete-form" action={deleteProjectAction}>
              <input type="hidden" name="id" value={project.id} />
              <button className="admin-danger" type="submit">Delete project</button>
            </form>
          </details>
        )) : <p className="admin-empty">No projects yet.</p>}
      </section>
    </>
  )
}
