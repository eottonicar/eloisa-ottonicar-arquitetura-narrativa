import mirror from '../assets/editorial-ape-el-espelho.webp'
import sense from '../assets/editorial-sense-640.webp'
import './project-cut.css'

export default function ProjectCut({ worldsHref }) {
  return (
    <section className="project-cut editorial-inset" id="corte" tabIndex={-1} aria-labelledby="project-cut-title">
      <div className="project-cut-sticky">
        <header className="project-cut-header">
          <h2 id="project-cut-title">Apê E-L <span aria-hidden="true">→</span><span className="editorial-visually-hidden"> para </span> Sense</h2>
          <p className="project-cut-hint">Role para atravessar <span aria-hidden="true">↓</span></p>
        </header>
        <div className="project-cut-frame">
          <figure className="project-cut-shot project-cut-shot--mirror">
            <img src={mirror} width="960" height="1200" loading="lazy" decoding="async"
              alt="Espelho redondo sobre a mesa de jantar do Apê E-L" />
            <figcaption>Apê E-L</figcaption>
          </figure>
          <figure className="project-cut-shot project-cut-shot--sense">
            <img src={sense} width="640" height="820" loading="lazy" decoding="async"
              alt="Círculo amarelo na parede do quarto de Sense" />
            <figcaption>Sense</figcaption>
          </figure>
        </div>
        <nav className="project-cut-nav" aria-label="Navegação do corte">
          <a className="editorial-text-link project-cut-skip" href="#fim-do-corte">Pular o corte <span aria-hidden="true">↓</span></a>
        </nav>
      </div>
      <div className="project-cut-end" id="fim-do-corte" tabIndex={-1}>
        <a className="editorial-text-link project-cut-replay" href="#corte">Rever o corte <span aria-hidden="true">↑</span></a>
        <a className="editorial-text-link" href={worldsHref}>Ver Sense na galeria <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
