import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  articles as fallbackArticles,
  currentFocus as fallbackFocus,
  journey as fallbackJourney,
  profile as fallbackProfile,
  projects as fallbackProjects,
  skillGroups as fallbackSkillGroups,
  socialLinks as fallbackSocialLinks,
} from '@/data/portfolio'
import type { PortfolioData, ProfileDetail } from '@/types/portfolio'
import { getPublicSupabaseConfig } from './supabase/env'
import { safeError } from './validation'

function fallbackData(): PortfolioData {
  return {
    profile: {
      ...fallbackProfile,
      roles: [...fallbackProfile.roles],
      details: fallbackProfile.details.map((detail) => ({ ...detail })),
      portraitUrl: null,
    },
    projects: fallbackProjects.map((project) => ({
      ...project,
      technologies: [...project.technologies],
    })),
    skillGroups: fallbackSkillGroups.map((group) => ({
      ...group,
      skills: [...group.skills],
    })),
    journey: fallbackJourney.map((item) => ({ ...item })),
    currentFocus: fallbackFocus.map((item) => ({ ...item })),
    articles: fallbackArticles.map((article) => ({ ...article })),
    socialLinks: fallbackSocialLinks.map((link) => ({ ...link })),
  }
}

function formatArticleDate(value: string | null): string {
  if (!value) return 'Unpublished'
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function isProfileDetails(value: unknown): value is ProfileDetail[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const detail = item as Record<string, unknown>
    return typeof detail.label === 'string' && typeof detail.value === 'string'
  })
}

export const getPortfolioData = cache(async (): Promise<PortfolioData> => {
  const config = getPublicSupabaseConfig()
  if (!config) return fallbackData()

  const supabase = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    const [profileResult, projectsResult, skillsResult, journeyResult, articlesResult, socialsResult] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', 'main').maybeSingle(),
        supabase.from('projects').select('*').eq('published', true).order('sort_order'),
        supabase.from('skill_groups').select('*').eq('published', true).order('sort_order'),
        supabase.from('journey_items').select('*').eq('published', true).order('sort_order'),
        supabase.from('articles').select('*').eq('published', true).order('sort_order'),
        supabase.from('social_links').select('*').eq('visible', true).order('sort_order'),
      ])

    const firstError = [profileResult, projectsResult, skillsResult, journeyResult, articlesResult, socialsResult]
      .find((result) => result.error)?.error
    if (firstError) throw firstError

    const fallback = fallbackData()
    const profileRow = profileResult.data
    const journeyRows = journeyResult.data ?? []

    return {
      profile: profileRow ? {
        name: profileRow.name,
        firstName: profileRow.first_name,
        lastName: profileRow.last_name,
        eyebrow: profileRow.eyebrow,
        roles: profileRow.roles.map((role: string) => (
          role === 'Machine learning learner' ? 'Machine learning' : role
        )),
        introduction: fallback.profile.introduction,
        about: profileRow.about,
        details: isProfileDetails(profileRow.details)
          ? profileRow.details
            .filter((detail: ProfileDetail) => detail.label !== 'Availability')
            .map((detail: ProfileDetail) => ({
              ...detail,
              ...(detail.label === 'Education' ? { value: 'BCA', isPlaceholder: false } : {}),
              ...(detail.label === 'Location' ? { value: 'Calicut', isPlaceholder: false } : {}),
            }))
          : fallback.profile.details,
        resumeUrl: profileRow.resume_url,
        portraitUrl: profileRow.portrait_url,
      } : fallback.profile,
      projects: (projectsResult.data ?? []).map((project) => ({
        id: project.id,
        number: project.number,
        name: project.name,
        type: project.type,
        description: project.description,
        technologies: project.technologies,
        liveUrl: project.live_url,
        githubUrl: project.github_url,
        caseStudyUrl: project.case_study_url,
        imageUrl: project.image_url,
        status: project.status,
      })),
      skillGroups: fallback.skillGroups,
      journey: journeyRows.filter((item) => item.kind !== 'focus').map((item) => ({
        id: item.id,
        period: item.period,
        title: item.title,
        description: item.description,
        kind: item.kind,
        isPlaceholder: item.is_placeholder,
      })),
      currentFocus: journeyRows.filter((item) => item.kind === 'focus').map((item) => ({
        id: item.id,
        number: item.period,
        label: item.title,
        value: item.description,
      })),
      articles: (articlesResult.data ?? []).map((article) => ({
        id: article.id,
        title: article.title,
        date: formatArticleDate(article.published_at),
        category: article.category,
        description: article.description,
        slug: article.slug,
        tags: article.tags,
        content: article.content,
        coverImageUrl: article.cover_image_url,
      })),
      socialLinks: (socialsResult.data ?? []).map((link) => ({
        id: link.id,
        label: link.label,
        url: fallback.socialLinks.find((fallbackLink) => fallbackLink.label === link.label)?.url ?? link.url,
      })),
    }
  } catch (error) {
    safeError('public-content', error)
    return fallbackData()
  }
})

export const getPublishedArticle = cache(async (slug: string) => {
  const config = getPublicSupabaseConfig()
  if (!config || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null

  const supabase = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase
    .from('articles')
    .select('title,slug,category,description,content,tags,cover_image_url,published_at')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    safeError('public-article', error)
    return null
  }

  return data ? {
    title: data.title,
    slug: data.slug,
    category: data.category,
    description: data.description,
    content: data.content,
    tags: data.tags as string[],
    coverImageUrl: data.cover_image_url as string | null,
    date: formatArticleDate(data.published_at),
  } : null
})
