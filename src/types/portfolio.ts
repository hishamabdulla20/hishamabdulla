export type ProfileDetail = {
  label: string
  value: string
  isPlaceholder: boolean
}

export type Profile = {
  name: string
  firstName: string
  lastName: string
  eyebrow: string
  roles: string[]
  introduction: string
  about: string
  details: ProfileDetail[]
  resumeUrl: string | null
  portraitUrl: string | null
}

export type Project = {
  id?: string
  number: string
  name: string
  type: string
  description: string
  technologies: string[]
  liveUrl: string | null
  githubUrl: string | null
  caseStudyUrl: string | null
  imageUrl?: string | null
  status: string
}

export type SkillGroup = {
  id?: string
  category: string
  number: string
  skills: string[]
  isPlaceholder?: boolean
}

export type JourneyItem = {
  id?: string
  period: string
  title: string
  description: string
  kind?: 'education' | 'experience' | 'focus'
  isPlaceholder: boolean
}

export type FocusItem = {
  id?: string
  number: string
  label: string
  value: string
}

export type Article = {
  id?: string
  title: string
  date: string
  category: string
  description: string
  slug: string
  tags?: string[]
  content?: string
  coverImageUrl?: string | null
  isPlaceholder?: boolean
}

export type SocialLink = {
  id?: string
  label: string
  url: string | null
}

export type PortfolioData = {
  profile: Profile
  projects: Project[]
  skillGroups: SkillGroup[]
  journey: JourneyItem[]
  currentFocus: FocusItem[]
  articles: Article[]
  socialLinks: SocialLink[]
}

export type ActionResult = {
  status: 'idle' | 'success' | 'error'
  message: string
  fieldErrors?: Record<string, string>
}
