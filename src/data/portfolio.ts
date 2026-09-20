export const navigation = [
  { label: 'About', href: '/#about' },
  { label: 'Opinions', href: '/#opinions' },
  { label: 'Work', href: '/#work' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Lab', href: '/#lab' },
  { label: 'Contact', href: '/#contact' },
] as const

export const profile = {
  name: 'Hisham Abdulla',
  firstName: 'Hisham',
  lastName: 'Abdulla',
  eyebrow: "Hello, I'm",
  roles: ['Developer', 'Machine learning', 'Technology'],
  introduction:
    'I’m Hisham Abdulla—a curious mind who loves exploring ideas, building useful things, and occasionally getting lost in movies, books, and thoughts about life.\n\nI’m a developer, but code is only part of the story. This little corner of the internet is where I share what I build, learn, experience, and think about.\n\nSince you’ve already made it this far, you might as well look around. Who knows? You might find something interesting.\n\nAnd if you have an idea, a story, a different perspective, or simply something worth sharing, let’s connect. I’d love to hear it.',
  about:
    'I enjoy turning ideas into working digital products—from the interface people see to the systems working behind it. I explore, experiment, solve problems, and keep improving until an idea becomes something real and useful.',
  details: [
    { label: 'Name', value: 'Hisham Abdulla', isPlaceholder: false },
    { label: 'Role', value: 'Full-stack developer', isPlaceholder: false },
    { label: 'Education', value: 'BCA', isPlaceholder: false },
    { label: 'Location', value: 'Calicut', isPlaceholder: false },
  ],
  resumeUrl: null as string | null,
} as const

export const skillGroups = [
  { category: 'Frontend', number: '01', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js'] },
  { category: 'Backend', number: '02', skills: ['Node.js', 'Express.js', 'Django', 'REST API', 'Supabase'] },
  { category: 'Databases', number: '03', skills: ['PostgreSQL', 'MongoDB'] },
  { category: 'Machine Learning & Data Science', number: '04', skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'scikit-learn'] },
  { category: 'Tools / Infrastructure', number: '05', skills: ['Git', 'GitHub', 'Docker', 'Vercel'] },
] as const

export const projects = [
  {
    number: '01',
    name: 'BroDoctor',
    type: 'Medical Learning Platform',
    description:
      'A digital learning platform built to make medical education simpler, organized, and more accessible.',
    technologies: [],
    liveUrl: 'https://www.brodoctor.online',
    githubUrl: 'https://github.com/hishamabdulla20/brodoctor',
    caseStudyUrl: null as string | null,
    status: 'Featured project',
  },
] as const

export const services = [
  { number: '01', title: 'Full-Stack Development', description: 'Digital products across interface, application logic, data and deployment.' },
  { number: '02', title: 'Frontend Development', description: 'Responsive, accessible interfaces with thoughtful interactions.' },
  { number: '03', title: 'Backend & System Design', description: 'Maintainable backend architecture built around real product needs.' },
  { number: '04', title: 'API Development & Integration', description: 'Reliable APIs and connections between products, services and data.' },
  { number: '05', title: 'Database Integration / Optimization', description: 'Practical data modeling and optimization for reliable applications.' },
  { number: '06', title: 'Deployment & Cloud Infrastructure', description: 'Production deployment and infrastructure suited to each project.' },
] as const

export const labCategories = [
  { number: '01', title: 'Experiments', description: "Small things I'm building just to see what happens." },
  { number: '02', title: 'Ideas', description: 'Things living somewhere between\n"this could work" and "probably not."' },
  { number: '03', title: 'Failed successfully', description: 'Things I broke, mistakes I made,\nand what they taught me.' },
] as const

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
