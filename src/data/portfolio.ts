export const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Writing', href: '#writing' },
  { label: 'Beyond code', href: '#beyond' },
  { label: 'Contact', href: '#contact' },
] as const

export const profile = {
  name: 'Hisham Abdulla',
  firstName: 'Hisham',
  lastName: 'Abdulla',
  eyebrow: "Hello, I'm",
  roles: ['Full-stack developer', 'Machine learning learner', 'Technology enthusiast'],
  introduction:
    'I build digital experiences and explore how software, technology, and intelligent systems work from beginning to end.',
  about:
    'I’m interested in the full shape of a digital product: how it reads, how it feels, how the system behind it works, and what can be learned by building it well.',
  details: [
    { label: 'Name', value: 'Hisham Abdulla', isPlaceholder: false },
    { label: 'Role', value: 'Full-stack developer', isPlaceholder: false },
    { label: 'Education', value: 'Details to be added', isPlaceholder: true },
    { label: 'Location', value: 'Details to be added', isPlaceholder: true },
    { label: 'Availability', value: 'Details to be added', isPlaceholder: true },
  ],
  resumeUrl: null as string | null,
} as const

export const skillGroups = [
  { category: 'Frontend', number: '01', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend', number: '02', skills: ['Supabase'] },
  { category: 'Databases', number: '03', skills: ['PostgreSQL'] },
  { category: 'Machine Learning / Data', number: '04', skills: ['Details to be added'], isPlaceholder: true },
  { category: 'Tools / Infrastructure', number: '05', skills: ['Details to be added'], isPlaceholder: true },
] as const

export const projects = [
  {
    number: '01',
    name: 'BroDoctor',
    type: 'Medical Learning Platform',
    description:
      'A web-based learning platform for medical education. Further case-study details can be added once the product scope and implementation are documented.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    liveUrl: 'https://brodoctor.online',
    githubUrl: null as string | null,
    caseStudyUrl: null as string | null,
    status: 'Featured project',
  },
] as const

export const services = [
  { number: '01', title: 'Full-Stack Development', description: 'Cohesive digital products spanning interface, application logic, data and deployment.' },
  { number: '02', title: 'Frontend Development', description: 'Responsive, accessible interfaces with deliberate interaction and visual craft.' },
  { number: '03', title: 'Backend & System Design', description: 'Clear application architecture designed around maintainability and real product needs.' },
  { number: '04', title: 'API Development & Integration', description: 'Purposeful APIs and reliable connections between products, services and data.' },
  { number: '05', title: 'Database Integration / Optimization', description: 'Practical data modeling and integration for dependable application workflows.' },
  { number: '06', title: 'Deployment & Cloud Infrastructure', description: 'Production-minded delivery and infrastructure shaped to the needs of the project.' },
] as const

export const journey = [
  {
    period: 'Timeline',
    title: 'Education & experience',
    description: 'Verified education, employment, certifications and dates will be added here.',
    isPlaceholder: true,
  },
] as const

export const currentFocus = [
  { number: '01', label: 'Currently building', value: 'Project details to be added' },
  { number: '02', label: 'Currently learning', value: 'Learning focus to be added' },
  { number: '03', label: 'Currently exploring', value: 'Exploration notes to be added' },
] as const

export const interests = [
  'Books', 'Novels', 'Movies', 'Technology', 'AI', 'Photography', 'Travel', 'Writing', 'Personal Thoughts',
].map((title, index) => ({
  number: String(index + 1).padStart(2, '0'),
  title,
  slug: title.toLowerCase().replaceAll(' ', '-'),
}))

export const articles = [
  {
    title: 'Add your first essay title',
    date: 'Unpublished',
    category: 'Draft placeholder',
    description: 'A prepared editorial entry for a future article. Replace this copy before publishing.',
    slug: 'first-essay-placeholder',
    isPlaceholder: true,
  },
  {
    title: 'Add a technical field note',
    date: 'Unpublished',
    category: 'Draft placeholder',
    description: 'Use this space for a concise description of a technical note, lesson or experiment.',
    slug: 'technical-note-placeholder',
    isPlaceholder: true,
  },
] as const

export const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/hishamabdulla20' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hishamabdulla20' },
  { label: 'Email', url: 'mailto:hisham@hishamabdulla.com' },
  { label: 'Instagram', url: 'https://www.instagram.com/hisham.abdulla/' },
] as const
