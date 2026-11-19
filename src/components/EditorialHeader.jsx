import { useRef, useState } from 'react'

export default function EditorialHeader({ routes, page = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menu = useRef(null)
  const home = page === 'home'
  const homeSection = (id) => `${home ? '' : routes.home}#${id}`
  const navigation = [
    ['Sobre', homeSection('sobre')],
    ['Projetos', homeSection('projetos')],
    ['Laboratório', routes.lab],
    ['LINEA', routes.linea],
    ['Serviços', homeSection('servicos')],
    ['Contato', homeSection('contato')],
  ]

  return (
    <>
      <a className="editorial-skip" href={home ? '#abertura' : '#conteudo'}>Ir para o conteúdo</a>
      <header className="editorial-header">
        <a className="editorial-brand" href={home ? '#abertura' : routes.home}>Arquitetura Narrativa</a>
        <nav aria-label="Navegação principal" onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menu.current?.focus()
          }
        }}>
          <button ref={menu} className="editorial-menu" type="button" aria-expanded={menuOpen}
            aria-controls="editorial-menu-links" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? 'Fechar' : 'Menu'} <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
          </button>
          <ul id="editorial-menu-links" className="editorial-nav" data-open={menuOpen}>
            {navigation.map(([label, href]) => (
              <li key={label}>
                <a href={href} aria-current={routes[page] === href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}
