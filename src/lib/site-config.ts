export const siteConfig = {
  name: 'Hisham Abdulla',
  title: 'Hisham Abdulla | Full-Stack Software Developer',
  description:
    'Personal portfolio of Hisham Abdulla, a full-stack software developer building modern web applications and exploring machine learning.',
  url: 'https://hishamabdulla.com',
  locale: 'en_US',
} as const

export function absoluteUrl(path = '') {
  if (!path || path === '/') return siteConfig.url
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}
