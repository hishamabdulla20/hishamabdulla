export const writingCategories = [
  'movies',
  'novels',
  'books',
  'technology',
  'ai',
  'personal',
  'essays',
] as const

export type WritingCategory = (typeof writingCategories)[number]

export type WritingArticleMeta = {
  title: string
  slug: string
  category: WritingCategory
  date: string
  excerpt: string
  readingTime: string
  subtitle?: string
  image?: string
  imageAlt?: string
  mediaTitle?: string
  mediaCreator?: string
  mediaYear?: string
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
