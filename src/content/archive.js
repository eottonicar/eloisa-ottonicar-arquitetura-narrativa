import linea from './linea.json'

const files = import.meta.glob('./records/*.published.json', { eager: true, import: 'default' })

const published = Object.values(files)
  .filter((record) => record.publication === 'published')
  .sort((first, second) => (second.date ?? '').localeCompare(first.date ?? '') || first.slug.localeCompare(second.slug))

export const projects = {
  portfolio: { title: 'Arquitetura Narrativa', href: '/' },
  solaris: { title: 'Solaris', href: '/mundos' },
  sense: { title: 'Sense', href: '/mundos' },
  isola: { title: 'Isola', href: '/mundos' },
  'ape-e-l': { title: 'Apê E-L', href: '/aplicados' },
  'home-office-i-g': { title: 'Home Office I-G', href: '/aplicados' },
  linea: { title: linea.title, href: '/linea' },
}

export const archive = {
  linea,
  published,
  featured: published.filter((record) => record.featured).slice(0, 3),
  forProject: (slug) => published.filter((record) => record.relatedProjects.includes(slug)),
}
