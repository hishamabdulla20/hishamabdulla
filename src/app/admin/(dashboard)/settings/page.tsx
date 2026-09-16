import { ActionForm } from '@/components/admin/ActionForm'
import { UploadForm } from '@/components/admin/UploadForm'
import { profile as fallbackProfile } from '@/data/portfolio'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import {
  deleteJourneyAction,
  deleteSocialLinkAction,
  saveJourneyAction,
  saveProfileAction,
  saveSocialLinkAction,
} from '../../actions'

type Detail = { label?: string; value?: string }

function detailValue(details: unknown, label: string): string {
  if (!Array.isArray(details)) return ''
  const item = details.find((candidate): candidate is Detail => {
    return Boolean(candidate && typeof candidate === 'object' && (candidate as Detail).label === label)
  })
  return typeof item?.value === 'string' && item.value !== 'Details to be added' ? item.value : ''
}

type SocialRow = { id?: string; label?: string; url?: string | null; visible?: boolean; sort_order?: number }

function SocialForm({ link = {} }: { link?: SocialRow }) {
  return (
    <ActionForm action={saveSocialLinkAction} submitLabel={link.id ? 'Update link' : 'Create link'}>
      {link.id && <input type="hidden" name="id" value={link.id} />}
      <label>Label<input name="label" defaultValue={link.label ?? ''} maxLength={60} required /></label>
      <label>URL<input name="url" type="url" defaultValue={link.url ?? ''} /></label>
      <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={link.sort_order ?? 0} /></label>
      <label className="admin-check"><input name="visible" type="checkbox" defaultChecked={link.visible ?? true} /> Visible</label>
    </ActionForm>
  )
}

type JourneyRow = {
  id?: string
  period?: string
  title?: string
  description?: string
  kind?: string
  is_placeholder?: boolean
  published?: boolean
  sort_order?: number
}

function JourneyForm({ item = {} }: { item?: JourneyRow }) {
  return (
    <ActionForm action={saveJourneyAction} submitLabel={item.id ? 'Update item' : 'Create item'}>
      {item.id && <input type="hidden" name="id" value={item.id} />}
      <label>Type<select name="kind" defaultValue={item.kind ?? 'experience'}><option value="experience">Experience</option><option value="education">Education</option><option value="focus">Current focus</option></select></label>
      <label>Period / number<input name="period" defaultValue={item.period ?? ''} maxLength={80} required /></label>
      <label>Title<input name="title" defaultValue={item.title ?? ''} maxLength={160} required /></label>
      <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={item.sort_order ?? 0} /></label>
      <label className="admin-field--full">Description<textarea name="description" defaultValue={item.description ?? ''} maxLength={2000} required /></label>
      <label className="admin-check"><input name="isPlaceholder" type="checkbox" defaultChecked={item.is_placeholder ?? false} /> Placeholder style</label>
      <label className="admin-check"><input name="published" type="checkbox" defaultChecked={item.published ?? true} /> Published</label>
    </ActionForm>
  )
}

export default async function AdminSettingsPage() {
  const admin = createAdminSupabaseClient()
  const [profileResult, socialsResult, journeyResult] = admin ? await Promise.all([
    admin.from('profiles').select('*').eq('id', 'main').maybeSingle(),
    admin.from('social_links').select('*').order('sort_order'),
    admin.from('journey_items').select('*').order('sort_order'),
  ]) : [{ data: null }, { data: [] }, { data: [] }]
  const profile = profileResult.data
  const socials = socialsResult.data ?? []
  const journey = journeyResult.data ?? []

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Configuration</p><h1>Settings</h1><p>Update profile details, social links, journey entries, and reusable media.</p></header>

      <section className="admin-card" aria-labelledby="profile-settings">
        <h2 id="profile-settings">Profile</h2>
        <ActionForm action={saveProfileAction} submitLabel="Save profile">
          <label>Full name<input name="name" defaultValue={profile?.name ?? fallbackProfile.name} maxLength={100} required /></label>
          <label>Eyebrow<input name="eyebrow" defaultValue={profile?.eyebrow ?? fallbackProfile.eyebrow} maxLength={100} required /></label>
          <label>First name<input name="firstName" defaultValue={profile?.first_name ?? fallbackProfile.firstName} maxLength={60} required /></label>
          <label>Last name<input name="lastName" defaultValue={profile?.last_name ?? fallbackProfile.lastName} maxLength={60} required /></label>
          <label className="admin-field--full">Roles (comma separated)<input name="roles" defaultValue={(profile?.roles ?? fallbackProfile.roles).join(', ')} required /></label>
          <label className="admin-field--full">Introduction<textarea name="introduction" defaultValue={profile?.introduction ?? fallbackProfile.introduction} maxLength={600} required /></label>
          <label className="admin-field--full">About<textarea name="about" defaultValue={profile?.about ?? fallbackProfile.about} maxLength={2000} required /></label>
          <label>Primary role<input name="role" defaultValue={detailValue(profile?.details, 'Role') || fallbackProfile.details[1].value} /></label>
          <label>Education<input name="education" defaultValue={detailValue(profile?.details, 'Education')} /></label>
          <label>Location<input name="location" defaultValue={detailValue(profile?.details, 'Location')} /></label>
          <label>Availability<input name="availability" defaultValue={detailValue(profile?.details, 'Availability')} /></label>
          <label>Portrait URL<input name="portraitUrl" type="url" defaultValue={profile?.portrait_url ?? ''} /></label>
          <label>Resume URL<input name="resumeUrl" type="url" defaultValue={profile?.resume_url ?? ''} /></label>
        </ActionForm>
      </section>

      <section className="admin-card" aria-labelledby="asset-upload"><h2 id="asset-upload">Asset upload</h2><p>Accepted: JPG, PNG, WebP, AVIF, or PDF up to 5 MB.</p><UploadForm /></section>

      <section className="admin-section" aria-labelledby="social-settings">
        <h2 id="social-settings">Social links</h2>
        <details className="admin-card"><summary>Add social link</summary><SocialForm /></details>
        {socials.map((link) => (
          <details className="admin-card" key={link.id}>
            <summary>{link.label}<span>{link.visible ? 'Visible' : 'Hidden'}</span></summary>
            <SocialForm link={link} />
            <form className="admin-delete-form" action={deleteSocialLinkAction}><input type="hidden" name="id" value={link.id} /><button className="admin-danger" type="submit">Delete link</button></form>
          </details>
        ))}
      </section>

      <section className="admin-section" aria-labelledby="journey-settings">
        <h2 id="journey-settings">Education, experience & focus</h2>
        <details className="admin-card"><summary>Add journey item</summary><JourneyForm /></details>
        {journey.map((item) => (
          <details className="admin-card" key={item.id}>
            <summary>{item.title}<span>{item.kind}</span></summary>
            <JourneyForm item={item} />
            <form className="admin-delete-form" action={deleteJourneyAction}><input type="hidden" name="id" value={item.id} /><button className="admin-danger" type="submit">Delete item</button></form>
          </details>
        ))}
      </section>
    </>
  )
}
