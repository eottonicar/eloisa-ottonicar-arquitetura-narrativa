import { useEffect, useRef, useState } from 'react'

const MAZE_SYMBOL_SRC = '/images/hero/capa-destaques-2.jpg'
const FRAGMENT_COUNT = 6
const FORMATION_MS = 2600
const CROSSING_MS = 2200
const CROSSING_REDUCED_MS = 420
const MASK_ID = `entry-portal-${Math.random().toString(36).slice(2, 8)}`

const buildWedgePolygon = (index, count) => {
  const startAngle = (index / count) * Math.PI * 2 - Math.PI / 2
  const endAngle = ((index + 1) / count) * Math.PI * 2 - Math.PI / 2
  const radius = 82
  const point = (angle) => {
    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`
  }
  const midAngle = (startAngle + endAngle) / 2
  return `polygon(50% 50%, ${point(startAngle)}, ${point(midAngle)}, ${point(endAngle)})`
}

const FRAGMENTS = Array.from({ length: FRAGMENT_COUNT }, (_, index) => {
  const spreadAngle = (index / FRAGMENT_COUNT) * Math.PI * 2
  const midAngle = ((index + 0.5) / FRAGMENT_COUNT) * Math.PI * 2 - Math.PI / 2
  const splitDir = Math.cos(midAngle) >= 0 ? 1 : -1
  return {
    id: `fragment-${index}`,
    clipPath: buildWedgePolygon(index, FRAGMENT_COUNT),
    driftX: (Math.cos(spreadAngle) * (46 + (index % 3) * 10)).toFixed(1),
    driftY: (Math.sin(spreadAngle) * (46 + (index % 2) * 14)).toFixed(1),
    rotate: (index % 2 === 0 ? 1 : -1) * (18 + index * 6),
    splitDir,
  }
})

function EntryPortal({ onClose }) {
  const [phase, setPhase] = useState('forming')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [lowPower, setLowPower] = useState(false)

  const rootRef = useRef(null)
  const skipRef = useRef(null)
  const symbolRef = useRef(null)
  const phaseRef = useRef('forming')
  const pointerRafRef = useRef(0)
  const velocityRef = useRef({ x: 0, y: 0, last: 0, vx: 0, vy: 0 })
  const failsafeRef = useRef(0)

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(query.matches)
    apply()
    query.addEventListener('change', apply)
    document.documentElement.classList.add('entry-lock')
    return () => {
      query.removeEventListener('change', apply)
      document.documentElement.classList.remove('entry-lock')
    }
  }, [])

  useEffect(() => {
    const coarseQuery = window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)')
    const apply = () => setLowPower(coarseQuery.matches)
    apply()
    coarseQuery.addEventListener('change', apply)
    return () => coarseQuery.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      const idleId = window.setTimeout(() => setPhase('idle'), 0)
      return () => window.clearTimeout(idleId)
    }

    const id = window.setTimeout(() => setPhase('idle'), FORMATION_MS)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  useEffect(() => {
    const root = rootRef.current
    const applyVisibility = () => {
      const hidden = document.hidden
      if (root) {
        root.classList.toggle('entry-portal--paused', hidden)
        const svg = root.querySelector('svg')
        if (svg?.pauseAnimations && svg?.unpauseAnimations) {
          if (hidden) svg.pauseAnimations()
          else svg.unpauseAnimations()
        }
      }
    }
    applyVisibility()
    document.addEventListener('visibilitychange', applyVisibility)
    return () => document.removeEventListener('visibilitychange', applyVisibility)
  }, [])

  useEffect(() => {
    if (reducedMotion) return undefined
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!hoverQuery.matches) return undefined
    const root = rootRef.current
    if (!root) return undefined

    let pending = null
    const velocity = velocityRef.current

    const apply = () => {
      pointerRafRef.current = 0
      if (!pending || phaseRef.current === 'crossing') return
      const { clientX, clientY, time } = pending
      const rect = root.getBoundingClientRect()
      const nx = (clientX - rect.left) / Math.max(rect.width, 1) - 0.5
      const ny = (clientY - rect.top) / Math.max(rect.height, 1) - 0.5

      const dt = Math.max(time - velocity.last, 1)
      const vx = (clientX - velocity.x) / dt
      const vy = (clientY - velocity.y) / dt
      velocity.x = clientX
      velocity.y = clientY
      velocity.last = time
      velocity.vx += (vx - velocity.vx) * 0.35
      velocity.vy += (vy - velocity.vy) * 0.35
      const tension = Math.min(1, Math.hypot(velocity.vx, velocity.vy) * 16)

      root.style.setProperty('--cx', nx.toFixed(3))
      root.style.setProperty('--cy', ny.toFixed(3))
      root.style.setProperty('--tension', tension.toFixed(3))

      const symbolNode = symbolRef.current
      if (symbolNode) {
        const srect = symbolNode.getBoundingClientRect()
        const scx = srect.left + srect.width / 2
        const scy = srect.top + srect.height / 2
        const distance = Math.hypot(clientX - scx, clientY - scy)
        const proximity = Math.max(0, 1 - distance / (srect.width * 2.6))
        root.style.setProperty('--symbol-proximity', proximity.toFixed(3))
      }
    }

    const handleMove = (event) => {
      pending = { clientX: event.clientX, clientY: event.clientY, time: performance.now() }
      if (!pointerRafRef.current) pointerRafRef.current = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current)
      pointerRafRef.current = 0
    }
  }, [reducedMotion])

  const handleDragMove = (event) => {
    if (reducedMotion || event.pointerType === 'mouse') return
    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5
    const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5
    root.style.setProperty('--cx', nx.toFixed(3))
    root.style.setProperty('--cy', ny.toFixed(3))
  }

  const cross = () => {
    if (phaseRef.current === 'crossing' || phaseRef.current === 'done') return
    setPhase('crossing')
    const duration = reducedMotion ? CROSSING_REDUCED_MS : CROSSING_MS
    failsafeRef.current = window.setTimeout(onClose, duration)
  }

  useEffect(() => () => {
    if (failsafeRef.current) window.clearTimeout(failsafeRef.current)
    if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current)
    document.documentElement.classList.remove('entry-lock')
  }, [])

  const phaseClass = phase === 'forming' ? ' is-forming' : phase === 'crossing' ? ' is-crossing' : ' is-idle'
  const motionClass = reducedMotion ? ' entry-portal--simple' : ''
  const wallsMaskUrl = `url(#${MASK_ID}-mask)`

  return (
    <div
      ref={rootRef}
      className={`entry-portal${phaseClass}${motionClass}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portal do Mapa da Travessia"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
        if (event.key === 'Tab') {
          event.preventDefault()
          const target = event.target === skipRef.current
            ? rootRef.current?.querySelector('.entry-portal__button')
            : skipRef.current
          target?.focus()
        }
      }}
      onPointerMove={handleDragMove}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id={MASK_ID} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0 0 0 1 0"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="-6" intercept="4.2" />
              <feFuncG type="linear" slope="-6" intercept="4.2" />
              <feFuncB type="linear" slope="-6" intercept="4.2" />
            </feComponentTransfer>
          </filter>
          <mask id={`${MASK_ID}-mask`} maskContentUnits="objectBoundingBox">
            <image
              href={MAZE_SYMBOL_SRC}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="xMidYMid slice"
              filter={`url(#${MASK_ID})`}
            />
          </mask>
          {!reducedMotion && !lowPower ? (
            <filter id={`${MASK_ID}-liquid`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" numOctaves="2" seed="7" result="noise" baseFrequency="0.008 0.012">
                <animate
                  attributeName="baseFrequency"
                  dur="26s"
                  values="0.008 0.012;0.011 0.007;0.007 0.014;0.008 0.012"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="46" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          ) : null}
        </defs>
      </svg>

      <div
        className="entry-portal__field"
        aria-hidden="true"
        style={!reducedMotion && !lowPower ? { filter: `url(#${MASK_ID}-liquid)` } : undefined}
      >
        <span className="entry-portal__blob entry-portal__blob--a" />
        <span className="entry-portal__blob entry-portal__blob--b" />
        <span className="entry-portal__blob entry-portal__blob--c" />
        <span className="entry-portal__blob entry-portal__blob--d" />
        <span className="entry-portal__ghost entry-portal__ghost--acid" />
        <span className="entry-portal__grain" />
        <span className="entry-portal__vignette" />
      </div>

      <div className="entry-portal__symbol" ref={symbolRef} aria-hidden="true">
        <span className="entry-portal__cavity" />
        {FRAGMENTS.map((fragment, index) => (
          <span
            key={fragment.id}
            className="entry-portal__fragment"
            style={{
              clipPath: fragment.clipPath,
              WebkitClipPath: fragment.clipPath,
              maskImage: wallsMaskUrl,
              WebkitMaskImage: wallsMaskUrl,
              '--frag-x': `${fragment.driftX}vw`,
              '--frag-y': `${fragment.driftY}vh`,
              '--frag-rot': `${fragment.rotate}deg`,
              '--frag-index': index,
              '--split-dir': fragment.splitDir,
            }}
          />
        ))}
      </div>

      <button type="button" className="entry-portal__button" onClick={cross} aria-label="Símbolo do labirinto — atravesse para o mapa da travessia">
        <span className="entry-portal__clue">ENTRE</span>
      </button>

      <button ref={skipRef} type="button" className="entry-portal__skip" onClick={onClose}>
        PULAR INTRO
      </button>
    </div>
  )
}

export default EntryPortal
