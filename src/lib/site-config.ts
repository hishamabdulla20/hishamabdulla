export const siteConfig = {
  name: 'Hisham Abdulla',
  fullName: 'Hisham Abdulla A P',
  alternateNames: ['Hisham Abdulla', 'HishamAbdulla'],
  title: 'Hisham Abdulla A P | Developer',
  description:
    'The official personal website of Hisham Abdulla A P. Explore my projects, writing, takes on technology, and experiences as a developer.',
  openGraphDescription:
    'The official personal website of Hisham Abdulla A P. Explore projects, writing, takes, and development experiences.',
  url: 'https://hishamabdulla.com/',
  locale: 'en_US',
} as const

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
