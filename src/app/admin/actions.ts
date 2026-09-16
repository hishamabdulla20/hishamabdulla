'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authorizeAdminMutation } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  commaSeparated,
  isEmail,
  isSlug,
  isUuid,
  optionalUrl,
  required,
  safeError,
  text,
} from '@/lib/validation'
import type { ActionResult } from '@/types/portfolio'

const idleError = (message: string, fieldErrors?: Record<string, string>): ActionResult => ({
  status: 'error',
  message,
  fieldErrors,
})

function database() {
  const admin = createAdminSupabaseClient()
  if (!admin) throw new Error('Supabase server configuration is missing')
  return admin
}

function order(value: FormDataEntryValue | null): number {
  const parsed = Number.parseInt(text(value, 8), 10)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, 1_000_000)) : 0
}

function invalidUrl(formData: FormData, key: string, parsed: string | null): boolean {
  return Boolean(text(formData.get(key), 2_048) && !parsed)
}

function refresh(path: string) {
  revalidatePath('/')
  revalidatePath(path)
}

export async function loginAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = text(formData.get('email'), 254).toLowerCase()
  const password = text(formData.get('password'), 1_024)
  if (!isEmail(email) || password.length < 8) {
    return idleError('Enter a valid admin email and password.')
  }

  const supabase = await createServerSupabaseClient()
  if (!supabase || !createAdminSupabaseClient()) {
    return idleError('Admin authentication is not configured yet.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) return idleError('Email or password is incorrect.')

  const { data: authorization, error: authorizationError } = await database()
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (authorizationError || !authorization) {
    await supabase.auth.signOut()
    return idleError('This account does not have administrator access.')
  }

  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  if (supabase) await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function saveProjectAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const id = text(formData.get('id'), 40)
    const values = {
      number: text(formData.get('number'), 10),
      name: text(formData.get('name'), 120),
      type: text(formData.get('type'), 120),
      description: text(formData.get('description'), 2_000),
      technologies: commaSeparated(formData.get('technologies')),
      live_url: optionalUrl(formData.get('liveUrl')),
      github_url: optionalUrl(formData.get('githubUrl')),
      case_study_url: optionalUrl(formData.get('caseStudyUrl')),
      image_url: optionalUrl(formData.get('imageUrl')),
      status: text(formData.get('status'), 100),
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
      sort_order: order(formData.get('sortOrder')),
    }
    const errors: Record<string, string> = {}
    if (!required(values.number, 10)) errors.number = 'Required.'
    if (!required(values.name, 120)) errors.name = 'Required.'
    if (!required(values.type, 120)) errors.type = 'Required.'
    if (!required(values.description, 2_000)) errors.description = 'Required.'
    if (!required(values.status, 100)) errors.status = 'Required.'
    if (invalidUrl(formData, 'liveUrl', values.live_url)) errors.liveUrl = 'Enter a valid http(s) URL.'
    if (invalidUrl(formData, 'githubUrl', values.github_url)) errors.githubUrl = 'Enter a valid http(s) URL.'
    if (invalidUrl(formData, 'caseStudyUrl', values.case_study_url)) errors.caseStudyUrl = 'Enter a valid http(s) URL.'
    if (invalidUrl(formData, 'imageUrl', values.image_url)) errors.imageUrl = 'Enter a valid http(s) URL.'
    if (Object.keys(errors).length) return idleError('Please review the highlighted fields.', errors)

    const query = id && isUuid(id)
      ? database().from('projects').update(values).eq('id', id)
      : database().from('projects').insert(values)
    const { error } = await query
    if (error) throw error
    refresh('/admin/projects')
    return { status: 'success', message: id ? 'Project updated.' : 'Project created.' }
  } catch (error) {
    safeError('save-project', error)
    return idleError('Unable to save the project. Please try again.')
  }
}

export async function deleteProjectAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('projects').delete().eq('id', id)
  if (error) safeError('delete-project', error)
  refresh('/admin/projects')
}

export async function saveArticleAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const id = text(formData.get('id'), 40)
    const published = formData.get('published') === 'on'
    const publishedDate = text(formData.get('publishedAt'), 30)
    const values = {
      title: text(formData.get('title'), 180),
      slug: text(formData.get('slug'), 160).toLowerCase(),
      category: text(formData.get('category'), 100),
      description: text(formData.get('description'), 600),
      content: text(formData.get('content'), 100_000),
      tags: commaSeparated(formData.get('tags')),
      cover_image_url: optionalUrl(formData.get('coverImageUrl')),
      published,
      published_at: published ? (publishedDate ? new Date(`${publishedDate}T00:00:00Z`).toISOString() : new Date().toISOString()) : null,
      sort_order: order(formData.get('sortOrder')),
    }
    const errors: Record<string, string> = {}
    if (!required(values.title, 180)) errors.title = 'Required.'
    if (!isSlug(values.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens.'
    if (!required(values.category, 100)) errors.category = 'Required.'
    if (!required(values.description, 600)) errors.description = 'Required.'
    if (invalidUrl(formData, 'coverImageUrl', values.cover_image_url)) errors.coverImageUrl = 'Enter a valid http(s) URL.'
    if (Object.keys(errors).length) return idleError('Please review the highlighted fields.', errors)

    const query = id && isUuid(id)
      ? database().from('articles').update(values).eq('id', id)
      : database().from('articles').insert(values)
    const { error } = await query
    if (error) throw error
    refresh('/admin/articles')
    return { status: 'success', message: id ? 'Article updated.' : 'Article created.' }
  } catch (error) {
    safeError('save-article', error)
    return idleError('Unable to save the article. Check that its slug is unique.')
  }
}

export async function deleteArticleAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('articles').delete().eq('id', id)
  if (error) safeError('delete-article', error)
  refresh('/admin/articles')
}

export async function saveSkillGroupAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const id = text(formData.get('id'), 40)
    const values = {
      category: text(formData.get('category'), 100),
      number: text(formData.get('number'), 10),
      skills: commaSeparated(formData.get('skills'), 40),
      is_placeholder: formData.get('isPlaceholder') === 'on',
      published: formData.get('published') === 'on',
      sort_order: order(formData.get('sortOrder')),
    }
    if (!required(values.category, 100) || !required(values.number, 10) || values.skills.length === 0) {
      return idleError('Category, number, and at least one skill are required.')
    }
    const query = id && isUuid(id)
      ? database().from('skill_groups').update(values).eq('id', id)
      : database().from('skill_groups').insert(values)
    const { error } = await query
    if (error) throw error
    refresh('/admin/skills')
    return { status: 'success', message: id ? 'Skill group updated.' : 'Skill group created.' }
  } catch (error) {
    safeError('save-skill-group', error)
    return idleError('Unable to save the skill group. Please try again.')
  }
}

export async function deleteSkillGroupAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('skill_groups').delete().eq('id', id)
  if (error) safeError('delete-skill-group', error)
  refresh('/admin/skills')
}

export async function saveProfileAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const name = text(formData.get('name'), 100)
    const firstName = text(formData.get('firstName'), 60)
    const lastName = text(formData.get('lastName'), 60)
    const role = text(formData.get('role'), 120)
    const education = text(formData.get('education'), 180)
    const location = text(formData.get('location'), 180)
    const availability = text(formData.get('availability'), 180)
    const values = {
      name,
      first_name: firstName,
      last_name: lastName,
      eyebrow: text(formData.get('eyebrow'), 100),
      roles: commaSeparated(formData.get('roles'), 10),
      introduction: text(formData.get('introduction'), 600),
      about: text(formData.get('about'), 2_000),
      details: [
        { label: 'Name', value: name, isPlaceholder: false },
        { label: 'Role', value: role, isPlaceholder: !role },
        { label: 'Education', value: education || 'Details to be added', isPlaceholder: !education },
        { label: 'Location', value: location || 'Details to be added', isPlaceholder: !location },
        { label: 'Availability', value: availability || 'Details to be added', isPlaceholder: !availability },
      ],
      resume_url: optionalUrl(formData.get('resumeUrl')),
      portrait_url: optionalUrl(formData.get('portraitUrl')),
    }
    if (!name || !firstName || !lastName || !values.eyebrow || !values.introduction || !values.about || values.roles.length === 0) {
      return idleError('Complete all required profile fields.')
    }
    if (invalidUrl(formData, 'resumeUrl', values.resume_url) || invalidUrl(formData, 'portraitUrl', values.portrait_url)) {
      return idleError('Portrait and resume links must be valid http(s) URLs.')
    }
    const { error } = await database().from('profiles').upsert({ id: 'main', ...values })
    if (error) throw error
    refresh('/admin/settings')
    return { status: 'success', message: 'Profile updated.' }
  } catch (error) {
    safeError('save-profile', error)
    return idleError('Unable to save the profile. Please try again.')
  }
}

export async function saveSocialLinkAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const id = text(formData.get('id'), 40)
    const label = text(formData.get('label'), 60)
    const rawUrl = text(formData.get('url'), 2_048)
    const url = optionalUrl(formData.get('url'))
    if (!label || (rawUrl && !url)) return idleError('Enter a label and a valid http(s) URL.')
    const values = {
      label,
      url,
      visible: formData.get('visible') === 'on',
      sort_order: order(formData.get('sortOrder')),
    }
    const query = id && isUuid(id)
      ? database().from('social_links').update(values).eq('id', id)
      : database().from('social_links').insert(values)
    const { error } = await query
    if (error) throw error
    refresh('/admin/settings')
    return { status: 'success', message: id ? 'Social link updated.' : 'Social link created.' }
  } catch (error) {
    safeError('save-social-link', error)
    return idleError('Unable to save the social link. Its label may already exist.')
  }
}

export async function deleteSocialLinkAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('social_links').delete().eq('id', id)
  if (error) safeError('delete-social-link', error)
  refresh('/admin/settings')
}

export async function saveJourneyAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await authorizeAdminMutation()
    const id = text(formData.get('id'), 40)
    const kind = text(formData.get('kind'), 20)
    if (!['education', 'experience', 'focus'].includes(kind)) return idleError('Choose a valid journey type.')
    const values = {
      period: text(formData.get('period'), 80),
      title: text(formData.get('title'), 160),
      description: text(formData.get('description'), 2_000),
      kind,
      is_placeholder: formData.get('isPlaceholder') === 'on',
      published: formData.get('published') === 'on',
      sort_order: order(formData.get('sortOrder')),
    }
    if (!values.period || !values.title || !values.description) return idleError('Period, title, and description are required.')
    const query = id && isUuid(id)
      ? database().from('journey_items').update(values).eq('id', id)
      : database().from('journey_items').insert(values)
    const { error } = await query
    if (error) throw error
    refresh('/admin/settings')
    return { status: 'success', message: id ? 'Journey item updated.' : 'Journey item created.' }
  } catch (error) {
    safeError('save-journey', error)
    return idleError('Unable to save the journey item. Please try again.')
  }
}

export async function deleteJourneyAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('journey_items').delete().eq('id', id)
  if (error) safeError('delete-journey', error)
  refresh('/admin/settings')
}

export async function updateMessageStatusAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  const status = text(formData.get('status'), 20)
  if (!isUuid(id) || !['new', 'read', 'archived'].includes(status)) return
  const { error } = await database().from('contact_messages').update({ status }).eq('id', id)
  if (error) safeError('update-message', error)
  revalidatePath('/admin/messages')
}

export async function deleteMessageAction(formData: FormData) {
  await authorizeAdminMutation()
  const id = text(formData.get('id'), 40)
  if (!isUuid(id)) return
  const { error } = await database().from('contact_messages').delete().eq('id', id)
  if (error) safeError('delete-message', error)
  revalidatePath('/admin/messages')
}
