export const siteConfig = {
  name: 'Hisham Abdulla',
  fullName: 'Hisham Abdulla A P',
  alternateNames: ['Hisham Abdulla A P', 'hishamabdulla'],
  title: 'Hisham Abdulla | Developer & Machine Learning',
  description:
    'Hisham Abdulla is a developer and machine-learning learner. Explore his projects, skills, experiences, movie takes, writing, and work.',
  openGraphDescription:
    'Official personal website of Hisham Abdulla — developer and machine-learning learner. Explore projects, skills, writing, and movie takes.',
  url: 'https://hishamabdulla.com/',
  locale: 'en_US',
} as const

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
