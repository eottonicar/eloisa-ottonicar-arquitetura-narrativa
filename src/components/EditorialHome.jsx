import { archive } from '../content/archive.js'
import films from '../content/project-films.json'
import ArchiveEntries from './ArchiveEntries.jsx'
import EditorialHeader from './EditorialHeader.jsx'
import ProjectFilms from './ProjectFilms.jsx'
import ProjectCut from './ProjectCut.jsx'
import portrait from '../assets/eloisa-autoral.webp'
import solaris480 from '../assets/editorial-solaris-480.webp'
import solaris960 from '../assets/editorial-solaris-960.webp'
import sense320 from '../assets/editorial-sense-320.webp'
import sense640 from '../assets/editorial-sense-640.webp'
import apartment480 from '../assets/editorial-ape-el-480.webp'
import apartment960 from '../assets/editorial-ape-el-960.webp'
import isola960 from '../assets/editorial-isola-960.webp'
import homeOffice960 from '../assets/editorial-home-office-960.webp'
import './editorial-home.css'

export default function EditorialHome({ routes, worlds, applied }) {
  const { linea } = archive
  const groups = [
    { ...worlds, href: routes.worlds, covers: [solaris480, solaris960] },
    { ...applied, href: routes.applied, covers: [apartment480, apartment960] },
  ]
  const slides = [
    { title: 'Apê E-L', href: routes.applied, poster: apartment960 },
    { title: 'Solaris', href: routes.worlds, poster: solaris960, srcSet: `${solaris480} 480w, ${solaris960} 960w` },
    { title: 'Sense', href: routes.worlds, poster: sense640, srcSet: `${sense320} 320w, ${sense640} 640w` },
    { title: 'Isola', href: routes.worlds, poster: isola960 },
    { title: 'Home Office I-G', href: routes.applied, poster: homeOffice960 },
  ].map((slide) => ({ ...slide, video: films[slide.title] }))

  return (
    <div className="editorial">
      <EditorialHeader routes={routes} />

      <main>
        <section className="editorial-hero editorial-inset" id="abertura" tabIndex={-1} aria-labelledby="editorial-title">
          <h1 id="editorial-title"><span>Eloísa</span> <span>Ottonicar</span></h1>
          <p className="editorial-label">Arquitetura · Design · Tecnologia · IA Aplicada</p>
          <ProjectFilms slides={slides} />
          <div className="editorial-hero-copy">
            <p className="editorial-intro">Um arquivo de ideias <em>em movimento.</em></p>
            <div className="editorial-actions">
              <a className="editorial-cta" href="#projetos">Ver projetos <span aria-hidden="true">↓</span></a>
              <a className="editorial-cta editorial-cta--outline" href={routes.linea}>Conhecer o LINEA <span aria-hidden="true">↗</span></a>
              <a className="editorial-text-link" href="#corte">Atravessar o corte <span aria-hidden="true">↓</span></a>
              <a className="editorial-text-link editorial-map-link" href={routes.map}>Explorar o Mapa da Travessia <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <ProjectCut worldsHref={routes.worlds} />

        <section className="editorial-section editorial-inset editorial-about" id="sobre" tabIndex={-1} aria-labelledby="editorial-about-title">
          <figure><img src={portrait} alt="Retrato de Eloísa Ottonicar" loading="lazy" decoding="async" /></figure>
          <div>
            <h2 id="editorial-about-title">Sobre</h2>
            <p className="editorial-lead">Sou arquiteta e urbanista. Projeto espaços, ferramentas, interfaces e sistemas.</p>
            <p>Minha experiência com projetos de arquitetura orienta a forma como exploro tecnologia e inteligência artificial. Investigo como essas ferramentas podem participar da concepção, da visualização e do desenvolvimento de um projeto.</p>
          </div>
        </section>

        <section className="editorial-section editorial-inset" id="projetos" tabIndex={-1} aria-labelledby="editorial-projects-title">
          <h2 id="editorial-projects-title">Projetos</h2>
          {groups.map((group, index) => (
            <article className="editorial-project" key={group.href}>
              <a className="editorial-project-media" href={group.href} aria-label={`Ver ${group.title}`}>
                <img src={group.covers[0]} srcSet={`${group.covers[0]} 480w, ${group.covers[1]} 960w`} sizes="(min-width: 768px) 53vw, 90vw" alt="" width="480" height="600" loading="lazy" decoding="async" />
              </a>
              <div className="editorial-project-copy">
                <span className="editorial-folio" aria-hidden="true">0{index + 1} / 0{groups.length}</span>
                <h3>{group.title}</h3>
                <ul>{group.items.map(({ name }) => <li key={name}>{name}</li>)}</ul>
                <a className="editorial-text-link" href={group.href}>Abrir galeria <span className="editorial-visually-hidden">{group.title}</span> <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </section>

        <section className="editorial-section editorial-inset editorial-linea" id="linea" tabIndex={-1} aria-labelledby="editorial-linea-title">
          <h2 id="editorial-linea-title">{linea.title}</h2>
          <div className="editorial-linea-copy">
            <p className="editorial-lead">{linea.summary}</p>
            <a className="editorial-text-link" href={routes.linea}>Ler sobre o projeto <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="editorial-section editorial-inset archive-section archive-section--home" id="em-processo" aria-labelledby="editorial-process-title">
          <h2 id="editorial-process-title">Em processo</h2>
          <ArchiveEntries records={archive.featured} labHref={routes.lab} />
          <a className="editorial-text-link" href={routes.lab}>Abrir o Laboratório <span aria-hidden="true">↗</span></a>
        </section>

        <section className="editorial-section editorial-inset editorial-split" id="servicos" tabIndex={-1} aria-labelledby="editorial-services-title">
          <h2 id="editorial-services-title">Serviços</h2>
          <div>
            <ul className="editorial-services">
              <li>Arquitetura</li>
              <li>Visualização</li>
              <li>Modelagem</li>
              <li>Soluções com IA</li>
            </ul>
            <a className="editorial-text-link" href="#contato">Conversar sobre escopo <span aria-hidden="true">↓</span></a>
          </div>
        </section>
      </main>

      <footer className="editorial-contact editorial-section editorial-inset" id="contato" tabIndex={-1} aria-labelledby="editorial-contact-title">
        <h2 id="editorial-contact-title">Vamos<br />conversar?</h2>
        <ul>
          <li><a href="mailto:eloisa.o.claudino@gmail.com">E-mail <span aria-hidden="true">↗</span></a></li>
          <li><a href="https://www.instagram.com/arqeloisaottonicar/">Instagram <span aria-hidden="true">↗</span></a></li>
          <li><a href="https://wa.link/al1qf2">WhatsApp <span aria-hidden="true">↗</span></a></li>
        </ul>
        <a className="editorial-brand" href="#abertura">Arquitetura Narrativa ↑</a>
      </footer>
    </div>
  )
}
