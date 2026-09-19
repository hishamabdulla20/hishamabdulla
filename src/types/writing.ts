export const writingCategories = [
  'movies',
  'books',
  'tv-series',
  'novels',
  'technology',
  'development',
  'ai',
  'ideas',
  'experiences',
  'culture',
  'personal',
  'essays',
  'other',
] as const

export type WritingCategory = (typeof writingCategories)[number]

export type WritingArticleMeta = {
  title: string
  slug: string
  category: WritingCategory
  date: string
  excerpt: string
  readingTime: string
  type?: 'opinion' | 'thought'
  isPlaceholder?: boolean
  subtitle?: string
  image?: string
  imageAlt?: string
  mediaTitle?: string
  mediaCreator?: string
  mediaYear?: string
  originalTitle?: string
  director?: string
  writer?: string
  producers?: string
  starring?: string
  cinematography?: string
  editing?: string
  music?: string
  genres?: string
  synopsis?: string
}

export type WritingArticle = WritingArticleMeta & {
  body: string
}

export type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'code'; language?: string; value: string }
  | { type: 'divider' }
