import 'server-only'

import { cache } from 'react'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  writingCategories,
  type MarkdownBlock,
  type WritingArticle,
  type WritingArticleMeta,
  type WritingCategory,
} from '@/types/writing'

const writingDirectory = join(process.cwd(), 'content', 'writing')
const opinionsDirectory = join(process.cwd(), 'content', 'opinions')
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

type FrontMatter = Record<string, string>

function parseScalar(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseDocument(source: string, filename: string): { data: FrontMatter; body: string } {
  const normalized = source.replaceAll('\r\n', '\n')
  if (!normalized.startsWith('---\n')) {
    throw new Error(`[writing] ${filename} must begin with front matter.`)
  }

  const closingIndex = normalized.indexOf('\n---\n', 4)
  if (closingIndex === -1) {
    throw new Error(`[writing] ${filename} has unclosed front matter.`)
  }

  const data: FrontMatter = {}
  const frontMatter = normalized.slice(4, closingIndex)
  for (const line of frontMatter.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const separator = line.indexOf(':')
    if (separator === -1) {
      throw new Error(`[writing] ${filename} has an invalid metadata line: ${line}`)
    }
    const key = line.slice(0, separator).trim()
    data[key] = parseScalar(line.slice(separator + 1))
  }

  return { data, body: normalized.slice(closingIndex + 5).trim() }
}

function required(data: FrontMatter, key: string, filename: string): string {
  const value = data[key]?.trim()
  if (!value) throw new Error(`[writing] ${filename} is missing required metadata: ${key}`)
  return value
}

function isWritingCategory(value: string): value is WritingCategory {
  return writingCategories.includes(value as WritingCategory)
}

function isSafeImageSource(value: string): boolean {
  return value.startsWith('/') || /^https:\/\//.test(value)
}

function estimateReadingTime(body: string): string {
  const wordCount = body
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`
}

function parseArticle(
  filename: string,
  directory: string,
  defaultType: 'opinion' | 'thought',
): WritingArticle | null {
  const source = readFileSync(join(directory, filename), 'utf8')
  const { data, body } = parseDocument(source, filename)
  if (data.draft?.toLowerCase() === 'true') return null

  const title = required(data, 'title', filename)
  const slug = required(data, 'slug', filename)
  const category = required(data, 'category', filename).toLowerCase()
  const date = required(data, 'date', filename)
  const excerpt = required(data, 'excerpt', filename)
  const expectedSlug = filename.replace(/\.md$/, '')

  if (!slugPattern.test(slug) || slug !== expectedSlug) {
    throw new Error(`[writing] ${filename} must use the same lowercase, hyphenated value for its filename and slug.`)
  }
  if (!isWritingCategory(category)) {
    throw new Error(`[writing] ${filename} has an unsupported category: ${category}`)
  }
  if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`[writing] ${filename} must use a valid YYYY-MM-DD date.`)
  }
  if (data.image && !isSafeImageSource(data.image)) {
    throw new Error(`[writing] ${filename} image must be a root-relative path or an https URL.`)
  }
  if (data.image && !data.imageAlt) {
    throw new Error(`[writing] ${filename} must include imageAlt when image is set.`)
  }
  if (!body) throw new Error(`[writing] ${filename} has no article body.`)

  const articleType: 'opinion' | 'thought' = data.type === 'opinion' || data.type === 'thought'
    ? data.type
    : defaultType

  return {
    title,
    slug,
    category,
    date,
    excerpt,
    readingTime: data.readingTime || estimateReadingTime(body),
    type: articleType,
    ...(data.isPlaceholder?.toLowerCase() === 'true' ? { isPlaceholder: true } : {}),
    ...(data.subtitle ? { subtitle: data.subtitle } : {}),
    ...(data.image ? { image: data.image, imageAlt: data.imageAlt } : {}),
    ...(data.mediaTitle ? { mediaTitle: data.mediaTitle } : {}),
    ...(data.mediaCreator ? { mediaCreator: data.mediaCreator } : {}),
    ...(data.mediaYear ? { mediaYear: data.mediaYear } : {}),
    body,
  }
}

export const getWritingArticles = cache((): WritingArticle[] => {
  if (!existsSync(writingDirectory)) return []
  const filenames = readdirSync(writingDirectory)
    .filter((filename) => filename.endsWith('.md') && !filename.startsWith('_'))
    .sort()

  return filenames
    .map((filename) => parseArticle(filename, writingDirectory, 'thought'))
    .filter((article): article is WritingArticle => Boolean(article))
    .sort((a, b) => b.date.localeCompare(a.date))
})

export const getOpinions = cache((): WritingArticle[] => {
  if (!existsSync(opinionsDirectory)) return []
  const filenames = readdirSync(opinionsDirectory)
    .filter((filename) => filename.endsWith('.md') && !filename.startsWith('_'))
    .sort()

  return filenames
    .map((filename) => parseArticle(filename, opinionsDirectory, 'opinion'))
    .filter((article): article is WritingArticle => Boolean(article))
    .sort((a, b) => b.date.localeCompare(a.date))
})

export function getWritingArticle(slug: string): WritingArticle | null {
  if (!slugPattern.test(slug)) return null
  const opinion = getOpinions().find((article) => article.slug === slug)
  if (opinion) return opinion
  return getWritingArticles().find((article) => article.slug === slug) ?? null
}

export function getWritingArticleMeta(): WritingArticleMeta[] {
  return getWritingArticles().map(({ body: _body, ...article }) => article)
}

export function getOpinionsMeta(): WritingArticleMeta[] {
  return getOpinions().map(({ body: _body, ...article }) => article)
}

export function formatWritingDate(date: string): string {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function formatWritingCategory(category: WritingCategory): string {
  if (category === 'ai') return 'AI'
  if (category === 'tv-series') return 'TV & Series'
  if (category === 'other') return 'Other'
  return `${category.charAt(0).toUpperCase()}${category.slice(1)}`
}

function startsBlock(line: string): boolean {
  return /^(#{1,3})\s+/.test(line)
    || /^>\s?/.test(line)
    || /^[-*]\s+/.test(line)
    || /^\d+\.\s+/.test(line)
    || /^!\[/.test(line)
    || /^```/.test(line)
    || /^---+$/.test(line.trim())
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replaceAll('\r\n', '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || undefined
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index])
        index += 1
      }
      if (index >= lines.length) throw new Error('[writing] An article has an unclosed code block.')
      blocks.push({ type: 'code', language, value: code.join('\n') })
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length === 3 ? 3 : 2, text: heading[2] })
      index += 1
      continue
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'divider' })
      index += 1
      continue
    }

    const image = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)$/)
    if (image) {
      if (!image[1].trim()) throw new Error('[writing] Article images need descriptive alt text.')
      if (!isSafeImageSource(image[2])) throw new Error('[writing] Article image URLs must be root-relative or use https.')
      blocks.push({ type: 'image', alt: image[1], src: image[2], ...(image[3] ? { caption: image[3] } : {}) })
      index += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = []
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''))
        index += 1
      }
      blocks.push({ type: 'quote', text: quote.join(' ') })
      continue
    }

    const ordered = /^\d+\.\s+/.test(line)
    if (ordered || /^[-*]\s+/.test(line)) {
      const pattern = ordered ? /^\d+\.\s+/ : /^[-*]\s+/
      const items: string[] = []
      while (index < lines.length && pattern.test(lines[index])) {
        items.push(lines[index].replace(pattern, ''))
        index += 1
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraph = [line.trim()]
    index += 1
    while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
  }

  return blocks
}
