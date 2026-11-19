import { useEffect } from 'react'
import { archive } from '../content/archive.js'
import ArchiveEntries from './ArchiveEntries.jsx'
import EditorialHeader from './EditorialHeader.jsx'
import './archive.css'

export default function ArchivePage({ routes, page }) {
  const isLinea = page === 'linea'
  const { linea } = archive
  const title = isLinea ? linea.title : 'Laboratório'
  const records = isLinea ? archive.forProject(linea.slug) : archive.published

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Eloísa Ottonicar`
    const target = document.getElementById(window.location.hash.slice(1))
    target?.scrollIntoView({ behavior: 'instant' })
    return () => { document.title = previousTitle }
  }, [title])

  return (
    <div className={`editorial archive-page archive-page--${page}`}>
      <EditorialHeader routes={routes} page={page} />
      <main id="conteudo" tabIndex={-1}>
        <header className="archive-masthead editorial-inset">
          <p>{isLinea ? linea.stage : 'Um arquivo de ideias em movimento.'}</p>
          <h1>{title}</h1>
          <p className="archive-deck">{isLinea ? linea.summary : 'Investigações e registros de processo em arquitetura, design e tecnologia.'}</p>
        </header>

        {isLinea && (
          <div className="archive-brief editorial-inset">
            {[
              ['Origem', linea.origin],
              ['Problema', linea.problem],
              ['Visão', linea.vision],
            ].map(([label, explanation], index) => (
              <details key={label} name="linea-brief" open={index === 0}>
                <summary><span>{label}</span></summary>
                <p>{explanation}</p>
              </details>
            ))}
          </div>
        )}

        {!isLinea && records.length > 0 && (
          <nav className="archive-index editorial-inset" aria-label="Índice do Laboratório">
            <ol>
              {records.map(({ slug, title }, index) => (
                <li key={slug}>
                  <a href={`#${slug}`}><span className="editorial-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{title}<span aria-hidden="true">↓</span></a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {isLinea && linea.interfaces.length > 0 && (
          <section className="editorial-section editorial-inset" aria-labelledby="interfaces-title">
            <h2 id="interfaces-title">Interfaces</h2>
            {linea.interfaces.map((item) => (
              <figure className="archive-image" key={item.src}>
                <img src={item.src} alt={item.alt} width={item.width} height={item.height}
                  loading="lazy" decoding="async" />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </section>
        )}

        <section className="editorial-section editorial-inset archive-section" aria-labelledby="records-title">
          <h2 id="records-title">{isLinea ? 'Caderno de processo' : 'Registros'}</h2>
          {records.length > 0
            ? <ArchiveEntries records={records} labHref={routes.lab} detailed={!isLinea} />
            : <p>Ainda não há registros publicados.</p>}
          {isLinea && <a className="editorial-text-link" href={routes.lab}>Explorar o Laboratório <span aria-hidden="true">↗</span></a>}
        </section>
      </main>
      <footer className="archive-footer editorial-inset">
        <a className="editorial-text-link" href={routes.home}>← Voltar ao portfólio</a>
        <a className="editorial-text-link" href="/#contato">Contato <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  )
}
