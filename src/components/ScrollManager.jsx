import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Scroll behaviour on navigation:
 *   - `/#section` hash  → smooth-scroll to that section once mounted.
 *   - Back / Forward (POP) → restore the scroll position you left, so backing
 *     out of a committee page lands you on the same section of the home page
 *     you were already in.
 *   - A new forward navigation (PUSH/REPLACE) → start at the top.
 * Renders nothing.
 */
const positions = new Map() // history entry key → scrollY

export default function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType() // 'POP' | 'PUSH' | 'REPLACE'

  // Continuously remember where this history entry is scrolled to.
  useEffect(() => {
    const save = () => positions.set(location.key, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      save() // capture the final position right before leaving
      window.removeEventListener('scroll', save)
    }
  }, [location.key])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const t = setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }

    if (navType === 'POP') {
      // Restore the remembered position. Re-apply across a couple of frames
      // (and a short fallback) so it sticks once the destination has laid out.
      const y = positions.get(location.key) ?? 0
      const restore = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })
      const raf1 = requestAnimationFrame(() => {
        restore()
        requestAnimationFrame(restore)
      })
      const t = setTimeout(restore, 120)
      return () => {
        cancelAnimationFrame(raf1)
        clearTimeout(t)
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.key, location.hash, navType])

  return null
}
