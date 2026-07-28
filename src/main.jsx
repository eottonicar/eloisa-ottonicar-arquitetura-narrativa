import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from '@studio-freight/lenis'
import './index.css'
import App from './App.jsx'
const usePageEffects = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
    })

    let frameId = 0
    const root = document.documentElement
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const LERP_FACTOR = 0.05
    const PARALLAX_X_MULTIPLIER = 14
    const PARALLAX_Y_MULTIPLIER = 12
    const SCROLL_MULTIPLIER = 0.03
    const MAX_SCROLL_OFFSET = -20

    const handlePointerMove = (event) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      targetX = nx * PARALLAX_X_MULTIPLIER
      targetY = ny * PARALLAX_Y_MULTIPLIER
    }

    const handlePointerLeave = () => {
      targetX = 0
      targetY = 0
    }

    const raf = (time) => {
      lenis.raf(time)
      currentX += (targetX - currentX) * LERP_FACTOR
      currentY += (targetY - currentY) * LERP_FACTOR

      const scrollOffset = Math.max(MAX_SCROLL_OFFSET, -window.scrollY * SCROLL_MULTIPLIER)
      root.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`)
      root.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`)
      root.style.setProperty('--parallax-scroll', `${scrollOffset.toFixed(2)}px`)

      frameId = requestAnimationFrame(raf)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })

    frameId = requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(frameId)
      lenis.destroy()
      root.style.removeProperty('--parallax-x')
      root.style.removeProperty('--parallax-y')
      root.style.removeProperty('--parallax-scroll')
    }
  }, [])
}

export function Root() {
  usePageEffects()

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
