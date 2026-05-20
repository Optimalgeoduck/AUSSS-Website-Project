import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On every route change: scroll to the top, OR, if the URL carries a
 * hash like `/#about`, smooth-scroll to that section once it's mounted.
 * Renders nothing.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait a tick so the target route/section has rendered.
      const id = hash.replace('#', '')
      const t = setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
