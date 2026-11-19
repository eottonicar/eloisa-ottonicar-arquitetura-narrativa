import { useCallback, useEffect, useRef, useState } from 'react'
import './project-films.css'

const reducedMotion = '(prefers-reduced-motion: reduce)'

export default function ProjectFilms({ slides }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia(reducedMotion).matches)
  const [visible, setVisible] = useState(false)
  const [failedSource, setFailedSource] = useState(null)
  const screen = useRef(null)
  const video = useRef(null)
  const slide = slides[index]
  const source = slide.video && slide.video !== failedSource ? slide.video : null
  const running = playing && visible

  const move = useCallback((direction) => {
    setIndex((current) => (current + direction + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= .25), { threshold: .25 })
    observer.observe(screen.current)
    const preference = window.matchMedia(reducedMotion)
    const pauseForPreference = (event) => { if (event.matches) setPlaying(false) }
    preference.addEventListener('change', pauseForPreference)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', pauseForPreference)
    }
  }, [])

  useEffect(() => {
    const element = video.current
    if (!element) return
    if (running) {
      element.play().catch((error) => {
        if (error.name !== 'AbortError') setFailedSource(source)
      })
    } else {
      element.pause()
    }
    return () => element.pause()
  }, [running, source])

  useEffect(() => {
    if (!running || source) return
    const timer = window.setTimeout(() => move(1), 5000)
    return () => window.clearTimeout(timer)
  }, [running, source, index, move])

  return (
    <section className="project-films" aria-label="Projetos em sequência">
      <div className="project-films-stage">
        <div className="project-films-screen" ref={screen}>
          {source ? (
            <video key={source} ref={video} src={source} poster={slide.poster} playsInline muted
              preload="none" aria-label={`Vídeo de ${slide.title}`}
              onEnded={() => { if (running) move(1) }}
              onError={() => setFailedSource(source)} />
          ) : (
            <img key={slide.title} src={slide.poster} srcSet={slide.srcSet}
              sizes="(min-width: 768px) 67vw, 92vw" alt={`Imagem do projeto ${slide.title}`} />
          )}
        </div>
        <div className="project-films-caption" aria-live={running ? 'off' : 'polite'}>
          <p className="editorial-folio">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</p>
          <h2>{slide.title}</h2>
          <a className="editorial-text-link" href={slide.href}>Ver galeria <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="project-films-controls" aria-label="Controles da sequência" role="group">
        <button type="button" onClick={() => move(-1)} aria-label="Projeto anterior">←</button>
        <button type="button" onClick={() => setPlaying((active) => !active)}>
          {playing ? 'Pausar' : 'Reproduzir'}
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Próximo projeto">→</button>
      </div>
    </section>
  )
}
