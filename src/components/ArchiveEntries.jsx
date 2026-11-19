import { projects } from '../content/archive.js'

const formatDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })

export default function ArchiveEntries({ records, labHref, detailed = false }) {
  return (
    <ul className="archive-entries">
      {records.map((record, index) => (
        <li key={record.slug}>
          <article id={detailed ? record.slug : undefined} tabIndex={detailed ? -1 : undefined}>
            <div className="archive-entry-meta">
              <span className="editorial-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span>{record.type}</span>
              {record.date && <time dateTime={record.date}>{formatDate.format(new Date(record.date))}</time>}
            </div>
            <div className="archive-entry-copy">
              <h3>{detailed ? record.title : (
                <a href={`${labHref}#${record.slug}`}>{record.title} <span aria-hidden="true">↗</span></a>
              )}</h3>
              <p>{record.summary}</p>
              {detailed && (
                <>
                  {record.cover && (
                    <figure className="archive-image">
                      <img src={record.cover.src} alt={record.cover.alt}
                        width={record.cover.width} height={record.cover.height} loading="lazy" decoding="async" />
                      {record.cover.caption && <figcaption>{record.cover.caption}</figcaption>}
                    </figure>
                  )}
                  {record.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {record.projectStage && <p className="archive-stage">Estado do projeto · {record.projectStage}</p>}
                  {record.tags.length > 0 && <p className="archive-tags">{record.tags.join(' · ')}</p>}
                  {record.relatedProjects.length > 0 && (
                    <ul className="archive-links" aria-label="Projetos relacionados">
                      {record.relatedProjects.map((slug) => {
                        const project = projects[slug]
                        return project && <li key={slug}><a href={project.href}>{project.title} ↗</a></li>
                      })}
                    </ul>
                  )}
                  {record.links?.length > 0 && (
                    <ul className="archive-links" aria-label="Links do registro">
                      {record.links.map(({ href, label }) => <li key={href}><a href={href}>{label} ↗</a></li>)}
                    </ul>
                  )}
                </>
              )}
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
