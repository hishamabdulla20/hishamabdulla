export const siteConfig = {
  name: 'Hisham Abdulla',
  fullName: 'Hisham Abdulla A P',
  alternateNames: ['Hisham Abdulla', 'hishamabdulla'],
  title: 'Hisham Abdulla | Full-Stack Developer',
  description:
    'Hisham Abdulla A P is a full-stack developer and machine-learning learner. Explore my projects, skills, articles, and work.',
  openGraphDescription:
    'Personal portfolio of Hisham Abdulla A P — full-stack developer and machine-learning learner.',
  url: 'https://hishamabdulla.com/',
  locale: 'en_US',
} as const

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
